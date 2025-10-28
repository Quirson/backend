module.exports = {
 // graphql: {
 //   config: {
   //   endpoint: '/graphql',
     // shadowCRUD: true,
     // playgroundAlways: true,
     // depthLimit: 10,
     // amountLimit: 100,
   // },
 //},
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
      },
    },
  },
};
