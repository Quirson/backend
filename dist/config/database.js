"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ env }) => ({
    connection: {
        client: 'postgres',
        connection: {
            connectionString: env('DATABASE_URL'),
            ssl: {
                rejectUnauthorized: false
            },
        },
        acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
        pool: {
            min: env.int('DATABASE_POOL_MIN', 2),
            max: env.int('DATABASE_POOL_MAX', 10)
        },
    },
});
