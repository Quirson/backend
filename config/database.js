module.exports = ({ env }) => ({
  default: {
    connection: {
      client: 'postgres',
      connection: env('DATABASE_URL'),
      ssl: {
        rejectUnauthorized: false,
      },
    },
    debug: false,
  },
});
