// ./config/middlewares.js

module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: [
        'http://localhost:3000', // Front-End local
        'http://localhost:1337', // Seu Admin Strapi local
        // *** IMPORTANTE: ADICIONAR O DOMÍNIO DO NGROK AQUI ***
        'https://prolabor-axel-supraorbital.ngrok-free.dev',
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

// O SEU SERVIDOR STRAPI DEVE SER REINICIADO DEPOIS DE SALVAR ESTE FICHEIRO.