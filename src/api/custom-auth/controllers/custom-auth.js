'use strict';

module.exports = ({ strapi }) => ({
  async sendVerification(ctx) {
    try {
      const { email } = ctx.request.body;

      if (!email) {
        return ctx.badRequest('Email é obrigatório');
      }

      // Gerar código de verificação
      const code = await strapi.service('api::custom-auth.custom-auth').generateVerificationCode(email);

      ctx.send({
        message: 'Código de verificação enviado com sucesso',
        code // Em produção, remover esta linha!
      });
    } catch (error) {
      console.error('Erro ao enviar verificação:', error);
      ctx.badRequest(error.message);
    }
  },

  async verifyAndRegister(ctx) {
    try {
      const { email, code, userData, profileData } = ctx.request.body;

      if (!email || !code) {
        return ctx.badRequest('Email e código são obrigatórios');
      }

      // 1. Verificar código
      await strapi.service('api::custom-auth.custom-auth').verifyCode(email, code);

      // 2. Registrar usuário
      const user = await strapi.plugins['users-permissions'].services.user.add({
        username: userData.username,
        email: email,
        password: userData.password,
        confirmed: true, // Já verificado por email
      });

      // 3. Criar profile automaticamente
      const profile = await strapi.service('api::custom-auth.custom-auth').createUserProfile(user.id, {
        displayName: userData.username,
        ...profileData
      });

      // 4. Gerar JWT
      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
      });

      ctx.send({
        jwt,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          profile: profile
        }
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      ctx.badRequest(error.message);
    }
  },

  async createProfile(ctx) {
    try {
      const { userId, profileData } = ctx.request.body;

      if (!userId) {
        return ctx.badRequest('User ID é obrigatório');
      }

      // Verificar se user existe
      const user = await strapi.plugins['users-permissions'].services.user.fetch({
        id: userId
      });

      if (!user) {
        return ctx.badRequest('Usuário não encontrado');
      }

      // Criar profile
      const profile = await strapi.service('api::custom-auth.custom-auth').createUserProfile(userId, profileData);

      ctx.send({
        message: 'Profile criado com sucesso',
        profile
      });

    } catch (error) {
      console.error('Erro ao criar profile:', error);
      ctx.badRequest(error.message);
    }
  }
});