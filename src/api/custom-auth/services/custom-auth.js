'use strict';

module.exports = ({ strapi }) => ({
  async generateVerificationCode(email) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await strapi.entityService.create('api::email-verification.email-verification', {
      data: {
        email,
        code,
        expiration: new Date(Date.now() + 10 * 60 * 1000) // 10 minutos
      }
    });

    return code;
  },

  async verifyCode(email, code) {
    const verification = await strapi.db.query('api::email-verification.email-verification').findOne({
      where: {
        email,
        code,
        expiration: { $gt: new Date() }
      }
    });

    if (!verification) throw new Error('Código inválido ou expirado');

    // Limpar código usado
    await strapi.db.query('api::email-verification.email-verification').delete({
      where: { id: verification.id }
    });

    return true;
  },

  async createUserProfile(userId, profileData) {
    return await strapi.entityService.create('api::profile.profile', {
      data: {
        DisplayName: profileData.displayName || 'Novo Usuário',
        user: userId,
        Bio: profileData.bio || '',
        location: profileData.location || '',
        dateOfBirth: profileData.dateOfBirth || new Date().toISOString().split('T')[0]
      }
    });
  }
});