import { AuthUserDto } from "../../core/dtos/auth/auth-user.dto";
import { GenerateOrderDto } from "../../core/dtos/orders/generate-order-dto";
import { UpdateOrderDto } from "../../core/dtos/orders/update-order-dto";
import { OrderEntity } from "../../core/entities";
import { CustomError } from "../../core/errors/custom.error";
import {
  OrderRepository,
  ProductRepository,
  UserRepository,
} from "../../core/repositories";
import { PaginationDto } from "../../shared/dtos/pagination.dto";
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository
  ) {}

  public async getAllOrders(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, products] = await Promise.all([
        this.orderRepository.count(),
        this.orderRepository.getAll(paginationDto),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/orders?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0 ? `/api/orders?page=${page - 1}&limit=${limit}` : null,
        data: products,
      };
    } catch (error) {
      throw CustomError.internalServer();
    }
  }

  public async getOrderById(id: number) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw CustomError.notFound("Order not found");
    }

    return order;
  }

  public async getAllOrdersByUserId(id: number, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const userExists = await this.userRepository.existsById(id);
    if (!userExists) {
      throw CustomError.notFound("User not found");
    }

    try {
      const [total, orders] = await Promise.all([
        this.orderRepository.countByUserId(id),
        this.orderRepository.getAllByUserId(id, paginationDto),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/orders/user/${id}?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0
            ? `/api/orders/user/${id}?page=${page - 1}&limit=${limit}`
            : null,
        data: orders,
      };
    } catch (error) {
      throw CustomError.internalServer();
    }
  }

  public async generateOrder(
    generateOrderDto: GenerateOrderDto,
    authUser: AuthUserDto
  ) {
    //Verify for duplicate products
    const uniqueIds = new Set(
      generateOrderDto.products.map((product) => product.id)
    );
    if (uniqueIds.size !== generateOrderDto.products.length) {
      throw CustomError.badRequest("Duplicate products not allowed");
    }

    // initialize products unit price and stock
    const productsToOrder = generateOrderDto.products.map((p) => {
      return {
        id: p.id,
        quantity: p.quantity,
        stock: 0,
        unitPrice: 0,
      };
    });

    // Verify that all products exist and have enough stock for required quantity
    for (const productToOrder of productsToOrder) {
      const product = await this.productRepository.findById(productToOrder.id);
      if (!product) {
        throw CustomError.badRequest("Product not found");
      }

      if (product.quantity < productToOrder.quantity) {
        throw CustomError.badRequest(
          "Not enough stock for product " + product.name
        );
      }

      productToOrder.stock = product.quantity;
      productToOrder.unitPrice = product.price;
    }

    const orderToSave = {
      status: "Pending",
      userId: authUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      products: productsToOrder.map((p) => {
        return {
          productId: p.id,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
        };
      }),
    } as unknown as Omit<OrderEntity, "id">;

    // Create order
    try {
      const order = await this.orderRepository.create(orderToSave);

      // Update product quantities
      for (const productToOrder of productsToOrder) {
        const remainingStock = productToOrder.stock - productToOrder.quantity;
        await this.productRepository.updateQuantityOnly(productToOrder.id, {
          quantity: remainingStock,
        });
      }

      return order;
    } catch (error) {
      console.log(error);

      throw CustomError.internalServer();
    }
  }

  public async deleteOrder(id: number) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw CustomError.notFound("Order not found");
    }

    try {
      const message = await this.orderRepository.deleteById(id);
      return message;
    } catch (error) {
      throw CustomError.internalServer();
    }
  }

  public async updateOrderStatus(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw CustomError.notFound("Order not found");
    }

    if (order.status === updateOrderDto.status) {
      throw CustomError.badRequest(
        "Order already has the status " + updateOrderDto.status
      );
    }

    try {
      const updatedOrder = await this.orderRepository.updateById(
        id,
        updateOrderDto
      );
      return updatedOrder;
    } catch (error) {
      throw CustomError.internalServer();
    }
  }
}
