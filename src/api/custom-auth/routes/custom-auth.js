'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/custom-auth/send-verification',
      handler: 'custom-auth.sendVerification',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/custom-auth/verify-and-register',
      handler: 'custom-auth.verifyAndRegister',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/custom-auth/create-profile',
      handler: 'custom-auth.createProfile',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};