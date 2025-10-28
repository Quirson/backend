'use strict';

/**
 * Auth.js controller
 *
 * @description: A set of functions called "actions" for managing `Auth`.
 */

const { sanitize } = require('@strapi/utils');
const { getAbsoluteAdminUrl, getAbsoluteServerUrl, sanitizeUser } = require('@strapi/utils');

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const sanitizeUserOutput = (user) => {
    const sanitizedUser = sanitizeUser(user, {});
    return sanitizedUser;
};

module.exports = (plugin) => {
    // Adicionar os novos controllers
    plugin.controllers.auth.sendVerificationCode = async (ctx) => {
        try {
            const { email } = ctx.request.body;

            if (!email) {
                return ctx.badRequest('O campo de e-mail é obrigatório');
            }

            if (!emailRegex.test(email)) {
                return ctx.badRequest('Formato de e-mail inválido');
            }

            const normalizedEmail = email.toLowerCase().trim();

            // Verificar se o usuário já existe
            const existingUser = await strapi.query('plugin::users-permissions.user').findOne({
                where: { email: normalizedEmail }
            });

            if (existingUser) {
                return ctx.badRequest('Este e-mail já está cadastrado');
            }

            // Gerar código de 6 dígitos
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

            // Deletar códigos anteriores para este email
            await strapi.query('api::email-verification.email-verification').deleteMany({
                where: { email: normalizedEmail }
            });

            // Criar novo código de verificação
            await strapi.query('api::email-verification.email-verification').create({
                data: {
                    email: normalizedEmail,
                    code: code,
                    expiration: expiration
                }
            });

            // Log do código para desenvolvimento (remover em produção)
            console.log(`📧 Código de verificação para ${normalizedEmail}: ${code}`);

            return ctx.send({
                message: 'Código de verificação enviado com sucesso',
                success: true
            });

        } catch (error) {
            console.error('Erro ao enviar código de verificação:', error);
            return ctx.internalServerError('Erro interno do servidor');
        }
    };

    plugin.controllers.auth.verifyEmail = async (ctx) => {
        try {
            const { email, code, userData } = ctx.request.body;

            // Validações básicas
            if (!email || !code || !userData) {
                return ctx.badRequest('Email, código e dados do usuário são obrigatórios');
            }

            if (!userData.username || !userData.password) {
                return ctx.badRequest('Username e senha são obrigatórios');
            }

            const normalizedEmail = email.toLowerCase().trim();

            // Buscar verificação
            const verification = await strapi.query('api::email-verification.email-verification').findOne({
                where: {
                    email: normalizedEmail,
                    code: code
                }
            });

            if (!verification) {
                return ctx.badRequest('Código de verificação inválido');
            }

            // Verificar expiração
            if (new Date() > new Date(verification.expiration)) {
                await strapi.query('api::email-verification.email-verification').delete({
                    where: { id: verification.id }
                });
                return ctx.badRequest('Código de verificação expirado');
            }

            // Verificar se email já existe (dupla verificação)
            const existingUser = await strapi.query('plugin::users-permissions.user').findOne({
                where: { email: normalizedEmail }
            });

            if (existingUser) {
                return ctx.badRequest('Este e-mail já está cadastrado');
            }

            // Verificar se username já existe
            const existingUsername = await strapi.query('plugin::users-permissions.user').findOne({
                where: { username: userData.username }
            });

            if (existingUsername) {
                return ctx.badRequest('Este username já está em uso');
            }

            // Buscar role padrão
            const authenticatedRole = await strapi.query('plugin::users-permissions.role').findOne({
                where: { type: 'authenticated' }
            });

            if (!authenticatedRole) {
                return ctx.internalServerError('Role de usuário não encontrada');
            }

            // Criar usuário
            const newUser = await strapi.plugins['users-permissions'].services.user.add({
                username: userData.username,
                email: normalizedEmail,
                password: userData.password,
                confirmed: true,
                blocked: false,
                role: authenticatedRole.id,
                provider: 'local'
            });

            // Deletar código de verificação
            await strapi.query('api::email-verification.email-verification').delete({
                where: { id: verification.id }
            });

            // Gerar JWT
            const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
                id: newUser.id
            });

            // Sanitizar usuário
            const sanitizedUser = sanitizeUserOutput(newUser);

            return ctx.send({
                jwt,
                user: sanitizedUser,
                message: 'Usuário criado com sucesso'
            });

        } catch (error) {
            console.error('Erro na verificação de email:', error);
            return ctx.internalServerError('Erro interno do servidor');
        }
    };

    return plugin;
};