export class ProductEntity {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public description: string,
    public quantity: number
  ) {}

  public static fromObject(object: { [key: string]: any }): ProductEntity {
    const { id, name, price, description, quantity } = object;

    const product = new ProductEntity(id, name, price, description, quantity);

    return product;
  }
}
