// ecosystem.config.js
module.exports = {
    apps: [
        {
            name: 'user-service',
            script: './user-service/app.js',
            env: {
                NODE_ENV: 'development',
                PORT: 3000,
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'product-service',
            script: './product-service/app.js',
            env: {
                NODE_ENV: 'development',
                PORT: 4000,
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'order-service',
            script: './order-service/app.js',
            env: {
                NODE_ENV: 'development',
                PORT: 5000,
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'notification-service',
            script: './notification-service/app.js',
            env: {
                NODE_ENV: 'development',
                PORT: 6000,
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'cart-service',
            script: './cart-service/app.js',
            env: {
                NODE_ENV: 'development',
                PORT: 7000,
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
}
