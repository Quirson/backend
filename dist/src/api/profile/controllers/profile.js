'use strict';
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::profile.profile', ({ strapi }) => ({
    // Follow user
    async follow(ctx) {
        const { id } = ctx.params; // ID do usuário a seguir
        const currentUserId = ctx.state.user.id; // Usuário logado
        try {
            // Buscar perfis
            const currentProfile = await strapi.entityService.findOne('api::profile.profile', currentUserId, {
                populate: ['following']
            });
            const targetProfile = await strapi.entityService.findOne('api::profile.profile', id, {
                populate: ['followers']
            });
            if (!targetProfile) {
                return ctx.badRequest('Profile not found');
            }
            // Adicionar following/followers
            const updatedFollowing = [...(currentProfile.following || []), { id }];
            const updatedFollowers = [...(targetProfile.followers || []), { id: currentUserId }];
            // Atualizar perfis
            await strapi.entityService.update('api::profile.profile', currentUserId, {
                data: {
                    following: updatedFollowing,
                    followingCount: updatedFollowing.length
                }
            });
            await strapi.entityService.update('api::profile.profile', id, {
                data: {
                    followers: updatedFollowers,
                    followersCount: updatedFollowers.length
                }
            });
            return ctx.send({ message: 'Followed successfully' });
        }
        catch (error) {
            return ctx.internalServerError('Follow failed');
        }
    },
    // Unfollow user  
    async unfollow(ctx) {
        // Similar ao follow, mas removendo das listas
    }
}));
