module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: env('DATABASE_URL'),
    ssl: {
      rejectUnauthorized: false,
    },
    debug: false,
  },
});
