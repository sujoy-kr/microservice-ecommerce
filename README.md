# Microservice E-commerce Backend

This project is a microservice-based e-commerce backend, designed to showcase various technologies and architectural patterns. Each service within this system has its own specific role, technology stack, and communication methods.

## Table of Contents

-   [Project Structure](#project-structure)
-   [Technologies Used](#technologies-used)
-   [Database Used](#database-used)
-   [Getting Started](#getting-started)
-   [Service Details](#service-details)
    -   [User Service](#user-service)
    -   [Product Service](#product-service)
    -   [Order Service](#order-service)
    -   [Cart Service](#cart-service)
    -   [Notification Service](#notification-service)
-   [Communication Between Services](#communication-between-services)
-   [Security Considerations](#security-considerations)
-   [Future Improvements](#future-improvements)

## Project Structure

This project is divided into multiple microservices, each with its own repository (or sub-folder) and technology stack:

-   **User Service**: Manages user registration, authentication, and profiles.
-   **Product Service**: Handles product catalog and search functionality with Elasticsearch.
-   **Order Service**: Manages order placement and processing.
-   **Cart Service**: Manages shopping cart operations using Redis for session management.
-   **Notification Service**: Sends order and shipping notifications via email.

## Technologies Used

-   **Node.js** for the backend logic
-   **Express.js** as the web framework
-   **RabbitMQ** for message brokering between services
-   **Nodemailer** for sending notifications
-   **jsonwebtoken** for authenticating users and admins
-   **Multer** as a middleware for uploading files
-   **Bcrypt** for encrypting passwords
-   **Joi** for validating user information
-   **Express-rate-limit** for limiting API requests
-   **Prisma** as a PostgreSQL ORM
-   **Mongoose** as a MongoDB ORM
-   **PM2** for process management
-   **Concurrently** for starting all the services at the same time
-   **Server-Sent Events (SSE)** in the Order Service for real-time data tracking

## Database Used

-   **PostgreSQL** in the Order Service
-   **MongoDB** in the Product Service
-   **Redis** in the Cart Service
-   **Elasticsearch** for product search

## Getting Started

### Prerequisites

-   Node.js
-   PostgreSQL
-   MongoDB
-   Redis
-   Elasticsearch
-   RabbitMQ

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/sujoy-kr/microservice-ecommerce.git
    cd microservice-ecommerce
    ```

2. Install dependencies for each service:

    ```bash
    cd services/user-service
    npm install
    ```

3. Repeat for other services.

4. Set up environment variables for each service. Example for User Service:

    ```bash
    cp .env.example .env
    ```

5. Edit the `.env` file with your settings. Ensure the JWT secret is the same across all services.

## Service Details

### User Service

**Tech Stack**: Node.js, Express, PostgreSQL, JWT, bcrypt, Prisma, RabbitMQ, Express-rate-limit, Joi

**Environment Variables**:

```bash
PORT=3000
DATABASE_URL="username://password:postgres@localhost:5432/databaseName"
SALT_ROUND=15
JWT_SECRET=sujoykr
AMQP_SERVER=amqp://localhost
```

**Routes**:

-   `POST /api/user/register`: Register a new user.

    -   **Request Body**:
        ```json
        {
            "name": "Sujoy Karmakar",
            "email": "demo@gmail.com",
            "password": "helloWorld"
        }
        ```

-   `POST /api/user/login`: Authenticate user and return a JWT.
    -   **Request Body**:
        ```json
        {
            "email": "demo@gmail.com",
            "password": "helloWorld"
        }
        ```
-   `GET /api/user/profile`: Return user profile data based on JWT.
-   `DELETE /api/user/delete`: Delete user data based on JWT.

<br />

### Product Service

**Tech Stack**: Node.js, Express, MongoDB, Elasticsearch, RabbitMQ, Multer, Mongoose, JWT
**Environment Variables**:

```bash
PORT=4000
DATABASE_URL="mongodb://localhost:27017/databaseName"
JWT_SECRET=sujoykr
AMQP_SERVER=amqp://localhost
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=sujoykr
ELASTICSEARCH_PASSWORD=sujoykr
```

**Routes**:

-   `GET /api/product/`: Get all products.
-   `POST /api/product/`: Create a new product.
    -   **Request Body**:
        ```json
        {
            "name": "string", // Required
            "description": "string", // Optional
            "price": "number", // Required
            "category": "string", // Required
            "stock": "number", // Required
            "image": "file" // Required
        }
        ```
-   `GET /api/product/:id`: Get single product by ID.
-   `DELETE /api/product/:id`: Delete a product by ID.
-   `POST /api/product/:id/order`: Order a product.
    -   **Request Body**:
        ```json
        {
            "quantity": "number" // Optional. Default is 1
        }
        ```
-   `GET /api/product/search/:keyword`: Search products by keywords.

<br/>

### Order Service

**Tech Stack**: Node.js, Express, Prisma, PostgreSQL, RabbitMQ, JWT, Redis, Server-Sent Events (SSE)
**Environment Variables**:

```bash
PORT=5000
DATABASE_URL="username://password:postgres@localhost:5432/databaseName"
AMQP_SERVER=amqp://localhost
JWT_SECRET=sujoykr
```

**Routes**:

-   `GET /api/order/`: Get all pending orders (real-time updates via SSE).
-   `PUT /api/order/:id`: Update order status (e.g., packaged, delivered, shipped).
    -   **Request Body**:
        ```json
        {
            "status": "string" // Required, e.g., "packaged", "delivered", "shipped"
        }
        ```

<br/>

### Cart Service

**Tech Stack**: Node.js, Express, Redis, JWT
**Environment Variables**:

```bash
PORT=7000
JWT_SECRET=sujoykr
```

**Routes**:

-   `GET /api/cart/`: Get user cart data based on JWT.
    -   **Request Body**:
        ```json
        {
            "productId": "string", // Required, ID of the product
            "quantity": "number" // Required, quantity of the product
        }
        ```
-   `POST /api/cart/`: Adds items to user cart data in cache based on JWT (expires in 1 hour).
-   `DELETE /api/cart/`: Delete items from user cart data from cache based on JWT.
    -   **Request Body**:
        ```json
        {
            "productId": "string"
        }
        ```

### Notification Service

**Tech Stack**: Node.js, Express, Nodemailer, RabbitMQ, Redis
**Environment Variables**:

```bash
PORT=6000
AMQP_SERVER=amqp://localhost
NODEMAILER_EMAIL="demo@gmail.com"
NODEMAILER_PASS="sldk slgf glkj vlke" // gmail app password myaccount.google.com/apppasswords

```

**Routes**:

no routes

**Functionality**:

-   The service listens to RabbitMQ messages and sends email notifications (e.g., order confirmation).

## Communication Between Services

-   **RabbitMQ**: Services communicate asynchronously through RabbitMQ. For example, when an order is placed, the Order Service sends a message to the Notification Service to send a confirmation email.
<!-- -   **Server-Sent Events (SSE)**: Used in the Order Service to provide real-time updates on order status. -->

## Security Considerations

-   **Authentication**: All endpoints requiring user data are secured using JWT. Users must provide a valid token to access these endpoints.
-   **Authorization**: Enforces roles and permissions to ensure that only authorized users can perform certain actions (e.g., admins can view and modify all orders).
-   **Data Encryption**: Passwords are securely hashed using bcrypt before being stored in the database.
-   **Rate Limiting**: The service uses Express Rate Limiter to protect against brute force attacks.
-   **CORS Configuration**: Cross-Origin Resource Sharing (CORS) is configured to control which domains can access the services.
-   **Helmet**: Used to secure HTTP headers to protect the application from common web vulnerabilities.

## Future Improvements

-   **Docker & Kubernetes**: Containerize services and manage them with Kubernetes.
-   **NGINX**: Implement NGINX as a reverse proxy for better load balancing and security.
-   **Prometheus**: Integrate Prometheus for monitoring and alerting.
-   **Recommendation Service**: Develop a recommendation engine using machine learning to provide personalized product suggestions.
-   **Payment Service**: Integrate a payment gateway using Stripe for handling transactions.
-   **gRPC Communication**: Implement gRPC for more efficient communication between services.
-   **Service Discovery**: Implement service discovery using tools like Consul or Eureka.

-   **API Gateway**: Implement an API Gateway to manage and route requests to different services.
-   **Inventory Service**: Implement an Inventory Service that uses Apache Cassandra
