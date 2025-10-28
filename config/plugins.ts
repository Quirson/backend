'use strict';

module.exports = ({ env }) => ({
  graphql: {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: true,
      depthLimit: 10,
      amountLimit: 100,
    },
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
    },
  },
  email: {
    config: {
      // Usando 'nodemailer' como provedor de e-mail para resolver o problema de instalação.
      // Certifique-se de instalar o pacote '@strapi/provider-email-nodemailer' no seu projeto.
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.ethereal.email'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: 'no-reply@socialdeal.com',
        defaultReplyTo: 'no-reply@socialdeal.com',
      },
    },
  },
});

