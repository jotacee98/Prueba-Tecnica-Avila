# Prueba técnica de Juan Andrade - Avila Tek

Este repositorio alberga la prueba técnica desarrollada por Juan Carlos Andrade. Incluye funcionalidades clave como un sistema de autenticación de usuarios, gestión de inventario de productos y procesamiento de órdenes de compra.

![Node.js](https://img.shields.io/badge/Node.js-%235FA04E?logo=nodedotjs&logoColor=white)
![TS Node](https://img.shields.io/badge/TSNode-%233178C6?logo=tsnode&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-%23C21325?logo=jest&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-%232D3748?logo=prisma&logoColor=white)
![Typescript](https://img.shields.io/badge/Typescript-%233178C6?logo=typescript&logoColor=white)

---

## Tabla de contenido

- [Funcionalidades y Características](#Funcionalidades-y-Características)
- [Requisitos Previos](#Requisitos-previos)
- [Instalación del proyecto](#Instalación-del-proyecto)
  - [Configuración de la base de datos para entorno de desarrollo PostgreSQL](#Configuración-de-la-base-de-datos-para-entorno-de-desarrollo-PostgreSQL)
  - [Ejecución de la API en entorno de desarrollo](#Ejecución-de-la-API-en-entorno-de-desarrollo)
  - [Configuración de la base de datos para entorno de pruebas PostgreSQL](#Configuración-de-la-base-de-datos-para-entorno-de-pruebas-PostgreSQL)
  - [Ejecución de la API en entorno de pruebas](#Ejecución-de-la-API-en-entorno-de-pruebas)
  - [Pruebas de endpoints con Postman](#Pruebas-de-endpoints-con-Postman)
- [Arquitectura del sistema](#Arquitectura-del-sistema)
  - [Justificación de la arquitectura](#Justificación-de-la-arquitectura)
  - [Patrón de diseño](#Patrón-de-diseño)
- [Librerías y Frameworks](#Librerías-y-Frameworks)
- [Documentación de la API](#Documentación-de-la-API)
  - [Autenticación](#Autenticación)
  - [Usuarios](#Usuarios)
  - [Productos](#Productos)
  - [Ordenes](#Ordenes)

## Funcionalidades y Características

- Registro, login, modificación, eliminación y lista de usuarios.
- Creación, modificación, actualización y eliminación de productos y listas de productos.
- Creación de órdenes de compra.
- Cambiar estado de la orden de compra.
- Cancelar orden de compra.
- Historial de compras del usuario logueado.

➕ **Tests unitarios y de Integración**

➕ **Uso de Patrón Adaptador**

## Requisitos Previos

- Instalar la última versión LTS de Node.js de [Node.js](https://nodejs.org/en/)
- Esto debería instalar npm, el gestor de paquetes de Node.js
- Instalar el manejador de bases de datos PostgreSQL de [PostgreSQL](https://www.postgresql.org/download/)
- Clonar este repositorio a su máquina local


## Instalación del proyecto

- Abrir la terminal y navegar al directorio root del repositorio clonado
  `cd /path/to/Prueba-Tecnica-Avila`

- Instalar las dependencias necesarias
  `npm install`

- Crear un archivo `.env` en el directorio root del proyecto. 

Puede copiar el archivo `.env.template` y renombrarlo a `.env`.

## Configuración de la base de datos para entorno de desarrollo PostgreSQL

- Crear una nueva base de datos en PostgreSQL, preferiblemente con una codificación `UTF8`
  `CREATE DATABASE Prueba-Tecnica-Avila WITH ENCODING 'UTF8';`

- Modificar el url de conexión con la base de datos en el archivo `.env`
  `DATABASE_URL=postgresql://username:password@localhost:5432/Prueba-Tecnica-Avila`

- Ejecutar las migraciones desde nuestro esquema del ORM Prisma para crear las tablas en la base de datos

  `npx prisma migrate dev`

- Nutrir la base de datos con una data inicial

  `npx prisma db seed`

## Ejecución de la API en entorno de desarrollo

- Levantar la API en entorno de desarrollo

  `npm run dev`

- La API se ejecutará en `http://localhost:PORT` donde `PORT` es el número del puerto especificado en el archivo `.env`


## Configuración de la base de datos para entorno de pruebas PostgreSQL

- Crear una nueva base de datos en PostgreSQL, preferiblemente con una codificación `UTF8`
  `CREATE DATABASE test WITH ENCODING 'UTF8';`

- Modificar el url de conexión con la base de datos en el archivo `.env.test`
  `DATABASE_URL=postgresql://username:password@localhost:5432/test`


## Ejecución de la API en entorno de pruebas

- Levantar la API en entorno de pruebas
  `npm run test`

- La API se ejecutará en `http://localhost:PORT` donde `PORT` es el número del puerto especificado en el archivo `.env.test`


## Pruebas de endpoints con Postman

Para configurar los endpoints en Postman siga los siguiente pasos:

- Abra Postman.
- En la barra lateral haga clic en import
- Arrastre el archivo `Avila-Tek-Prueba-endpoints.postman_collection.json` que se encuentra en el directorio `root` de este proyecto

⚠️ Tenga en cuenta, a la hora de hacer login, que se recomienda el uso de las siguientes credenciales, ya que este usuario tiene el rol de `Administrator`. Se hace esta observación ya que **existe un control de acceso por rol implementado en ciertos endpoints**:

```
{
    "email": "james.admin@email.com",
    "password": "James123456*"
}
```

Dichas credenciales ya están colocadas en el endpoint del login ubicado en la carpeta auth de la colección en Postman.

✅ De igual manera, un aspecto a resaltar es que, **cada vez que se ejecute el endpoint de login en Postman, automáticamente se extrae el token de la respuesta y se coloca en una variable global de la colección llamada `authToken` (que fue configurada de antemano). Esta variable se colocó como Bearer Token en cada uno de los endpoints que requieren que el usuario esté autenticado. Por lo tanto, cada vez que se ejecute el endpoint de login, se actualizará el Bearer Token de cada endpoint que lo esté utilizando. Esto ahorra tiempo a la persona que esté probando la API, ya que no tendrá que colocar manualmente el token en cada endpoint luego de que este expire o después de volver a llamar al endpoint de login.**


## Arquitectura del sistema

Este proyecto se desarrolló utilizando los principios de la **Arquitectura Limpia (Clean Architecture)**. Uno de los objetivos
de esta arquitectura es la separación de responsabilidades y se logra dicha separación dividiendo el software en capas

La **Regla de Dependencia** es fundamental para esta arquitectura. Esta regla establece que cualquier dependencia del
código fuente tiene que apuntar hacia la parte de adentro del esquema de capas. Las capas más internas no deberían saber nada
de las capas más externas.

Para propósitos de este proyecto la capa más interna está representada por la carpeta `core`, la siguiente capa está representada por la carpeta `presentation` y la capa más externa está representada por la carpeta `infrastructure`

**Prueba_Tecnica_Avila**

```
|
|-- 📁 src
| |-- 📁 config
| |
| |-- 📁 core
| |
| |-- 📁 data
| |
| |-- 📁 infrastructure
| |
| |-- 📁 presentation
| |
| |-- 📁 shared
| |
| |-- 📄 app.ts
|
|-- 📁 tests
| |-- 📁 core
| |
| |-- 📁 presentation
| | |
| | |-- 📁 products
| |
| |-- 📄 app.test.ts
```

## **CORE cuenta con las siguientes carpetas:**

- `sources`: Esta carpeta contiene clases abstractas con métodos abstractos que definen la forma en que la aplicación interactúa con fuentes de datos externas. Esto garantiza que la lógica de dominio permanezca desacoplada de los detalles específicos de la infraestructura, como bases de datos, APIs externas o sistemas de archivos. De este modo, si en el futuro se cambia la fuente de datos, solo será necesario modificar la implementación correspondiente, sin afectar el resto del sistema. En esta aplicación, la fuente de datos utilizada es PostgreSQL.

- `dtos`: Los DTOs (Data Transfer Objects) son objetos diseñados específicamente para transportar datos entre las diferentes capas de la aplicación, encapsulando la información necesaria y evitando exponer la estructura interna de las entidades.

- `entities`: Esta carpeta contiene las entidades del núcleo (core), que representan los objetos esenciales del modelo de negocio. Estas clases encapsulan tanto los datos como el comportamiento asociado a ellos, lo que garantiza la coherencia e integridad de la información en toda la aplicación. Además, las entidades están diseñadas para ser independientes de los detalles de implementación externos, lo que facilita la mantenibilidad y la flexibilidad del sistema.

- `errors`: Esta carpeta contiene las excepciones personalizadas del sistema. Su propósito es proporcionar mensajes de error más claros y significativos cuando se producen excepciones, lo que facilita la detección y el manejo de errores. Esto contribuye a una mejor depuración y mejora la experiencia del desarrollador al identificar problemas.

- `repositories`: Esta carpeta contiene clases abstractas que actúan como intermediarios entre el dominio y las fuentes de datos. En ellas se definen los métodos abstractos que representan las operaciones que se pueden realizar sobre las entidades, como agregar, actualizar, eliminar, obtener por ID, entre otras. Esta abstracción especifica el contrato de las operaciones sin imponer cómo deben implementarse, lo que favorece un diseño flexible y desacoplado. De este modo, las implementaciones concretas pueden cambiar sin afectar la lógica de negocio, facilitando la extensibilidad y el mantenimiento del sistema.

## **PRESENTATION cuenta con las siguientes carpetas**

- Se reprenta con una carpeta los conceptos clave del dominio. En este caso las carpetas `auth` , `orders`, `users` y `products`:

Cada una de estas carpetas contiene:

- `controller`: Esta carpeta contiene los controladores, que actúan como intermediarios entre las solicitudes del cliente y la lógica de negocio. Su función principal es recibir las peticiones HTTP entrantes, interpretar los datos, y llamar a los servicios correspondientes para procesar la información. Una vez completada la operación, los controladores envían la respuesta apropiada al cliente. En la Arquitectura Limpia, los controladores delegan la mayor parte de la lógica a los servicios, lo que simplifica el mantenimiento y facilita la prueba del código.

- `routes`: Aquí se definen las rutas de acceso a la aplicación. Estas especifican las URLs disponibles para que los clientes interactúen con las distintas funcionalidades. Cada ruta está asociada a un controlador específico, asegurando que las solicitudes sean dirigidas al componente adecuado.

- `services`: Contiene la lógica de negocio de la aplicación. Los servicios orquestan las acciones necesarias para cumplir con las solicitudes, encapsulando las reglas del dominio. De esta forma, los controladores permanecen ligeros y enfocados en la gestión de solicitudes y respuestas.

- `middlewares`: Funciones intermedias que se ejecutan antes o después de las solicitudes a los controladores. Su propósito es modificar o inspeccionar las solicitudes y respuestas, lo que permite agregar funcionalidades transversales, como la autenticación, validación o registro de logs, sin acoplarlas a la lógica principal.

## **INFRAESTRUCTURE cuenta con las siguientes carpetas**

- `repositories`: Esta carpeta contiene las implementaciones concretas de los repositorios definidos en el dominio. Los repositorios actúan como intermediarios entre la lógica de negocio y las fuentes de datos, encapsulando las operaciones de persistencia. Es importante destacar que los repositorios se comunican con los datasources, lo que proporciona una mayor flexibilidad para cambiar la fuente de datos si fuese necesario. En esta aplicación, se utiliza PostgreSQL como única fuente de datos, pero gracias a este diseño, sería posible intercambiar o añadir nuevas fuentes (como MongoDB o una API externa) sin afectar la lógica de negocio.

- `sources`: En esta carpeta se tienen las implementaciones concretas de los datasources definidos en el dominio



## Justificación de la arquitectura

- Es una arquitectura **independiente de cualquier framework o librería**, por lo tanto el diseño del sistema no está fuertemente
  acoplado a ningún detalle de implementación. Esto significa que la lógica y las reglas del negocio se mantienen separadas y no
  dependen de ninguna herramienta externa.

- La arquitectura permite **realizar pruebas exhaustivas de manera sencilla**. Las reglas de negocio pueden ser probadas sin la necesidad de una UI, base de datos, servidor web o cualquier otro elemento externo.

- **Es flexible**. Si el día de mañana se decide cambiar la base de datos, entonces fácilmente se podrá hacer esto sin la necesidad
  de refactorizaciones importantes.

- **Facilita la actualización y mantenimiento del sistema**, ya que los cambios en las herramientas o librerías no afectan la lógica de negocios

- Gracias a la **inyección de dependencias** en la arquitectura limpia se facilita la modularidad y el mantenimiento al desacoplar las dependencias de los componentes, permitiendo la sustitución fácil de implementaciones para pruebas y actualizaciones sin afectar la lógica del negocio. Esto se logra inyectando las dependencias desde fuera, promoviendo la flexibilidad y manteniendo la lógica central independiente de frameworks y bibliotecas específicos.



## Patrón de diseño

Se destaca el uso del siguiente patrón de diseño:

### Patrón Adaptador

El Patrón Adaptador permite que objetos con interfaces incompatibles trabajen juntos, actuando como un intermediario que traduce las llamadas de una interfaz a otra. También resulta útil para integrar librerías de terceros sin acoplar directamente la lógica de negocio a ellas, lo que facilita la sustitución o actualización de dichas librerías en el futuro.

✅ En esta aplicación, se utilizó el Patrón Adaptador para centralizar las dependencias externas y encapsular las interacciones con las librerías jsonwebtoken y bcrypt. De esta forma, todas las llamadas a estas librerías pasan por un único punto de acceso, lo que facilita la mantenibilidad y reduce la duplicación de código. Además, si en el futuro se decide cambiar jsonwebtoken por otra herramienta de gestión de tokens o reemplazar bcrypt por otro algoritmo de encriptación, solo será necesario modificar los adaptadores, sin afectar el resto del sistema. Esto asegura que la lógica de negocio no dependa directamente de las librerías externas, promoviendo un diseño más modular y flexible.

# Librerías y Frameworks

- **bcrypt (v5.1.1):** Biblioteca para hashing de contraseñas. Proporciona funciones para crear y verificar hashes seguros. Fue utilizada para encriptar la contraseña de los usuarios.

- **dotenv (v16.4.7):** Carga variables de entorno desde el archivo `.env` a `process.env`. Permite gestionar datos y configuraciones sensibles dentro del proyecto.

- **express (v4.21.2):** Framework web para Node.js, utilizado para construir aplicaciones y APIs de manera sencilla y eficiente.
  Dentro del proyecto se utilizó esta librería para configurar el servidor, definir rutas y middlewares, gestionar errores, implementar autenticación y autorización y conectar la base de datos.

- **joi (v17.13.3):** Biblioteca para validar datos. Permite definir y verificar las variables de entorno definidas para el proyecto.

- **jsonwebtoken (v9.0.2):** Implementación de JSON Web Tokens (JWT) para la autenticación segura de usuarios.

- **jest (v29.7.0):** Framework de pruebas para JavaScript, diseñado para asegurar la corrección del código a través de pruebas unitarias y de integración.

- **prisma (v6.1.0):** ORM moderno para Node.js y TypeScript, simplifica las consultas de bases de datos y la gestión de esquemas.

- **supertest (v7.0.0):** Herramienta para probar APIs HTTP. Permite realizar solicitudes y verificar respuestas en aplicaciones Express.

- **compression (^1.7.5):** Middleware para Express utilizado para reducir el tamaño de las respuestas HTTP enviadas al cliente. Funciona comprimiendo los datos, lo que ayuda a mejorar la velocidad de carga de la página y el rendimiento general de la aplicación.



## Documentación de la API

- ⚠️En los Endpoints la variable {`PORT`} es el número del puerto especificado en el archivo `.env`

- ⚠️En cada uno de los Endpoints que tengan el atributo **Autorización** la variable {`token`} es el token que se genera al hacer login. Si se importa el archivo con la colección de Endpoints `Atek-endpoints.postman_collection.json` en Postman, entonces los Bearer Token de cada endpoint que tenga habilitada la autorización se colocarán de manera automática luego de hacer login.

- ⚠️Si no se hace el import de la colección de endpoints, entonces se requiere hacer el siguiente proceso para configurar la autorización de cada petición:
  1. seleccionar la sección de autorización del endpoint
  2. elegir la opción de Bearer Token
  3. colocar el token generado por el login.

### Autenticación

#### Registrar usuario

```http
  POST /api/auth/register
  Host: localhost:{PORT}
  Url: localhost:{PORT}/api/auth/register
  Content-Type: application/json

{
    "firstName": "Juan",
    "lastName": "Andrade",
    "email": "juanca@gmail.com",
    "password": "1234567"
}
```

| Body item   | Type     | Description                                           |
| :---------- | :------- | :---------------------------------------------------- |
| `firstName` | `string` | **Requerido**. Nombre del usuario que se registra.    |
| `lastName`  | `string` | **Requerido**. Apellido del usuario que se registra.  |
| `email`     | `string` | **Requerido, Único**. Correo del usuario a registrar. |
| `password`  | `string` | **Requerido**. Contraseña de usuario a registrar.     |

#### Inicio de sesión de usuario

```http
  POST /api/auth/login
  Host: localhost:{PORT}
  Url: localhost:{PORT}/api/auth/login
  Content-Type: application/json

{
    "email": "juanca@gmail.com",
    "password": "1234567"
}
```

| Body item  | Type     | Description                                            |
| :--------- | :------- | :----------------------------------------------------- |
| `email`    | `string` | **Requerido**. Correo del usuario que se registra.     |
| `password` | `string` | **Requerido**. Contraseña del usuario que se registra. |


### Usuarios

#### Crear Usuario

```http
  POST /api/users
  Host: localhost:{PORT}
  Url: localhost:{PORT}/api/users
  Content-Type: application/json
  Autorización: Bearer {token}

{
    "firstName": "Juan",
    "lastName": "Andrade",
    "email": "juanca@gmail.com",
    "password": "1234567"
}
```

| Body item   | Type     | Description                                           |
| :---------- | :------- | :---------------------------------------------------- |
| `firstName` | `string` | **Requerido**. Nombre del usuario que se registra.    |
| `lastName`  | `string` | **Requerido**. Apellido del usuario que se registra.  |
| `email`     | `string` | **Requerido, Único**. Correo del usuario a registrar. |
| `password`  | `string` | **Requerido**. Contraseña de usuario a registrar.     |

#### Obtener Usuarios

```http
  GET /api/users
  Host: localhost:{PORT}
  Url: localhost:{PORT}/api/users
  Content-Type: application/json
  Autorización: Bearer {token}
  Parámetros de Consulta (Query Parameters): limit | page

```

| Query Parameter | Type     | Description                                                         |
| :-------------- | :------- | :------------------------------------------------------------------ |
| `limit`         | `number` | **Opcional**. Cantidad de usuarios por página (por defecto es 1).   |
| `page`          | `number` | **Opcional**. Número de la página a visualizar (por defecto es 10). |

```http
  GET /api/users?page=1&limit=2
```

#### Obtener Usuario

```http
  GET /api/users/:id
  Host: localhost:{PORT}
  Host: localhost:{PORT}/api/users/:id
  Content-Type: application/json
  Autorización: Bearer {token}
```

| Parameter | Type     | Description                   |
| :-------- | :------- | :---------------------------- |
| `id`      | `number` | **Requerido**. ID del usuario |

```http
  GET /api/users/3
```

#### Modificar Usuario

```http
  PUT /api/users/:id
  Host: localhost:{PORT}
  Host: localhost:{PORT}/api/users/:id
  Content-Type: application/json
  Autorización: Bearer {token}

  {
    "role": "Administrator",
    "email": "test@email.com"
}
```

| Parameter | Type     | Description                   |
| :-------- | :------- | :---------------------------- |
| `id`      | `number` | **Requerido**. ID del usuario |

```http
  PUT /api/users/3
```

#### Eliminar Usuario

```http
  DELETE /api/users/:id
  Host: localhost:{PORT}
  Host: localhost:{PORT}/api/users/:id
  Content-Type: application/json
  Autorización: Bearer {token}
```

| Parameter | Type     | Description                   |
| :-------- | :------- | :---------------------------- |
| `id`      | `number` | **Requerido**. ID del usuario |

```http
  DELETE /api/users/3
```



### Productos

#### Obtener Productos

```http
  GET /api/products
  Host: localhost:{PORT}
  Url: localhost:{PORT}/api/products
  Content-Type: application/json
  Autorización: Bearer {token}
  Parámetros de Consulta (Query Parameters): limit | page

```

| Query Parameter | Type     | Description                                                         |
| :-------------- | :------- | :------------------------------------------------------------------ |
| `limit`         | `number` | **Opcional**. Cantidad de productos por página (por defecto es 1).  |
| `page`          | `number` | **Opcional**. Número de la página a visualizar (por defecto es 10). |

```http
  GET /api/products?page=1&limit=2
```

#### Obtener Producto

```http
  GET /api/products/:id
  Host: localhost:{PORT}
  Host: localhost:{PORT}/api/products/:id
  Content-Type: application/json
  Autorización: Bearer {token}
```

| Parameter | Type     | Description                   |
| :-------- | :------- | :---------------------------- |
| `id`      | `number` | **Requerido**. ID del usuario |

```http
  GET /api/products/3
```

#### Crear Producto

```http
  GET /api/products
  Host: localhost:{PORT}
  Host: localhost:{PORT}/api/products
  Content-Type: application/json
  Autorización: Bearer {token}
  Rol Necesario: Administrator

{
    "name": "Pepsi",
    "price": 10.4,
    "description": "Better than Coca-Cola",
    "quantity": 21
}
```

| Body item     | Type     | Description                                            |
| :------------ | :------- | :----------------------------------------------------- |
| `name`        | `string` | **Requerido, Único**. Nombre del producto a modificar. |
| `price`       | `number` | **Requerido**. Precio del producto a modificar.        |
| `description` | `string` | **Requerido**. Descripción del producto a modificar.   |
| `quantity`    | `number` | **Requerido**. Cantidad del producto a modificar.      |

#### Modificar Producto

```http
  PUT /api/products/:id
  Host: localhost:{PORT}
  Host: localhost:{PORT}/api/products
  Content-Type: application/json
  Autorización: Bearer {token}
  Rol Necesario: Administrator

{
    "name": "Flips",
    "price": 9.2,
    "description": "The Best Cereal",
    "quantity": 8
}
```

| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `id`      | `number` | **Requerido**. ID del producto |

| Body item     | Type     | Description                                            |
| :------------ | :------- | :----------------------------------------------------- |
| `name`        | `string` | **Requerido, Único**. Nombre del producto a modificar. |
| `price`       | `number` | **Requerido**. Precio del producto a modificar.        |
| `description` | `string` | **Requerido**. Descripción del producto a modificar.   |
| `quantity`    | `number` | **Requerido**. Cantidad del producto a modificar.      |

```http
  PUT /api/products/1
```

#### Eliminar Producto

```http
  DELETE /api/products/:id
  Host: localhost:{PORT}
  Host: localhost:{PORT}/api/products
  Content-Type: application/json
  Autorización: Bearer {token}
  Rol Necesario: Administrator
```

| Parameter | Type     | Description                               |
| :-------- | :------- | :---------------------------------------- |
| `id`      | `number` | **Requerido**. ID del producto a eliminar |

```http
  DELETE /api/products/3
```

#### Modificar solo la cantidad del Producto

```http
  PATCH /api/products/:id/quantity
  Host: localhost:{PORT}
  Host: localhost:{PORT}/api/products
  Content-Type: application/json
  Autorización: Bearer {token}
  Rol Necesario: Administrator

{
    "quantity": 9
}
```

| Parameter | Type     | Description                                |
| :-------- | :------- | :----------------------------------------- |
| `id`      | `number` | **Requerido**. ID del producto a modificar |

| Body item  | Type     | Description                                       |
| :--------- | :------- | :------------------------------------------------ |
| `quantity` | `number` | **Requerido**. Cantidad del producto a modificar. |

```http
  PATCH /api/products/3/quantity
```

#### Modificar solo el precio del Producto

```http
  PATCH /api/products/:id/price
  Host: localhost:{PORT}
  Host: localhost:{PORT}/api/products
  Content-Type: application/json
  Autorización: Bearer {token}
  Rol Necesario: Administrator

{
    "price": 8.4
}
```

| Parameter | Type     | Description                                |
| :-------- | :------- | :----------------------------------------- |
| `id`      | `number` | **Requerido**. ID del producto a modificar |

| Body item | Type     | Description                                     |
| :-------- | :------- | :---------------------------------------------- |
| `price`   | `number` | **Requerido**. Precio del producto a modificar. |

```http
  PATCH /api/products/3/price
```



### Ordenes

#### Obtener Órdenes

```http
  GET /api/orders
  Host: localhost:{PORT}
  Url: localhost:{PORT}/api/orders
  Content-Type: application/json
  Autorización: Bearer {token}
  Parámetros de Consulta (Query Parameters): limit | page
  Rol Necesario: Administrator

```

| Query Parameter | Type     | Description                                                         |
| :-------------- | :------- | :------------------------------------------------------------------ |
| `limit`         | `number` | **Opcional**. Cantidad de órdenes por página (por defecto es 1).    |
| `page`          | `number` | **Opcional**. Número de la página a visualizar (por defecto es 10). |

```http
  GET /api/orders?page=1&limit=2
```

#### Obtener Orden

```http
  GET /api/orders/:id
  Host: localhost:{PORT}
  Host: localhost:{PORT}/api/orders/:id
  Content-Type: application/json
  Autorización: Bearer {token}
```

| Parameter | Type     | Description                   |
| :-------- | :------- | :---------------------------- |
| `id`      | `number` | **Requerido**. ID de la Orden |

```http
  GET /api/orders/2
```

#### Obtener Órdenes por Id de Usuario

```http
  GET /api/orders/user/:id
  Host: localhost:{PORT}
  Url: localhost:{PORT}/api/orders/user/:id
  Content-Type: application/json
  Autorización: Bearer {token}
  Parámetros de Consulta (Query Parameters): limit | page

```

| Query Parameter | Type     | Description                                                         |
| :-------------- | :------- | :------------------------------------------------------------------ |
| `limit`         | `number` | **Opcional**. Cantidad de órdenes por página (por defecto es 1).    |
| `page`          | `number` | **Opcional**. Número de la página a visualizar (por defecto es 10). |

```http
  GET /api/orders/user/1?page=1&limit=2
```

#### Crear Orden

```http
  GET /api/orders
  Host: localhost:{PORT}
  Host: localhost:{PORT}/api/orders
  Content-Type: application/json
  Autorización: Bearer {token}
  Rol Necesario: Administrator

{
    "id": 1,
    "email": "test@email.con",
    "role": "Administrator",
    "products": [{
        "id": 1,
        "quantity": 1
    }]
}
```

| Body item             | Type     | Description                                                                        |
| :-------------------- | :------- | :--------------------------------------------------------------------------------- |
| `id`                  | `string` | **Requerido, Único**. ID del usuario al que pertenece la orden.                    |
| `email`               | `number` | **Requerido**. Email del usuario al que pertenece la orden.                        |
| `role`                | `string` | **Requerido**. Rol del usuario al que pertenece la orden. (Debe ser Administrator) |
| `products`            | `array`  | **Requerido**. Lista de productos en la orden.                                     |
| `products[].id`       | `number` | **Requerido**. ID del producto.                                                    |
| `products[].quantity` | `number` | **Requerido**. Cantidad del producto en la orden                                   |

#### Eliminar Orden

```http
  DELETE /api/orders/:id
  Host: localhost:{PORT}
  Host: localhost:{PORT}/api/orders
  Content-Type: application/json
  Autorización: Bearer {token}
  Rol Necesario: Administrator
```

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `id`      | `number` | **Requerido**. ID de la orden a eliminar |

```http
  DELETE /api/orders/1
```

#### Modificar estatus de la Orden

```http
  PATCH /api/orders/:id/status
  Host: localhost:{PORT}
  Host: localhost:{PORT}/api/orders/:id/status
  Content-Type: application/json
  Autorización: Bearer {token}
  Rol Necesario: Administrator

{
    "status": 4.9
}
```

| Parameter | Type     | Description                               |
| :-------- | :------- | :---------------------------------------- |
| `id`      | `number` | **Requerido**. ID de la orden a modificar |

| Body item | Type     | Description                                                                                                                     |
| :-------- | :------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `status`  | `string` | **Requerido**. Estatus de la orden a modificar. Debe ser uno de estos valores ["Pending", "Processing", "Shipped", "Delivered"] |

```http
  PATCH /api/orders/1/status
```

**[⬆ Volver a la Tabla de contenido](#Tabla-de-contenido)**
