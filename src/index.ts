// src/extensions/users-permissions/strapi-server.js

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register() {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  bootstrap({ strapi }) {
    console.log('🚀 Configurando Socket.io...');
    
    // Configurações e inicialização do Socket.io
    const io = require('socket.io')(strapi.server.httpServer, {
      cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"], 
        methods: ["GET", "POST"],
        credentials: true
      }
    });
    
    // Middleware de Autenticação do Socket.io
    // Verifica o token JWT antes de permitir a conexão do cliente
    io.use(async (socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        console.log('❌ Conexão rejeitada: Nenhum token fornecido.');
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        const payload = await strapi.plugins['users-permissions'].services.jwt.verify(token);
        const user = await strapi.entityService.findOne(
          'plugin::users-permissions.user',
          payload.id,
          { populate: ['profile'] }
        );

        if (!user || !user.profile) {
          console.log('❌ Conexão rejeitada: Usuário não encontrado ou sem perfil.');
          return next(new Error('Authentication error: User not found or no profile'));
        }

        // Armazena o ID do perfil no socket para uso em outros eventos
        socket.profileId = user.profile.id;
        console.log(`✅ Conexão autenticada para o perfil: ${socket.profileId}`);
        next();
      } catch (err) {
        console.log('❌ Conexão rejeitada: Token inválido.');
        return next(new Error('Authentication error: Invalid token'));
      }
    });

    console.log('✅ Socket.io configurado!');

    // Estrutura de dados para rastrear usuários online
    const onlineUsers = new Set();

    // Evento principal de conexão do cliente
    io.on('connection', (socket) => {
      console.log(`👤 Usuário conectado: ${socket.id} (Perfil: ${socket.profileId})`);

      // ----------------------------------------------------
      // LÓGICA DE PRESENÇA DE USUÁRIO (ONLINE/OFFLINE)
      // ----------------------------------------------------
      // Adiciona o usuário ao conjunto de online
      onlineUsers.add(socket.profileId);
      // Emite o evento de que um usuário se conectou para todos os clientes
      io.emit('user_connected', { profileId: socket.profileId });
      console.log(`🟢 Usuário ${socket.profileId} está online. Total online: ${onlineUsers.size}`);

      // Evento para buscar a lista de todos os usuários online
      socket.on('get_online_users', () => {
        socket.emit('online_users_list', { onlineUsers: Array.from(onlineUsers) });
      });

      // ----------------------------------------------------
      // LÓGICA DO CHAT: HISTÓRICO, PRIVADO E GRUPO
      // ----------------------------------------------------

      // Evento para carregar o histórico de mensagens de um chat privado
      socket.on('get_chat_history', async (data) => {
        try {
          const { otherUserId } = data;
          const currentUserId = socket.profileId;

          const messages = await strapi.entityService.findMany(
            'api::chat-message.chat-message',
            {
              filters: {
                $or: [
                  { sender: currentUserId, receiver: otherUserId },
                  { sender: otherUserId, receiver: currentUserId }
                ]
              },
              populate: ['sender', 'receiver'],
              sort: { createdAt: 'asc' }
            }
          );
          
          socket.emit('chat_history', {
            messages,
          });

          console.log(`📚 Histórico de mensagens enviado para ${currentUserId} no chat com ${otherUserId}.`);

        } catch (error) {
          console.error('❌ Erro ao buscar histórico de mensagens:', error);
          socket.emit('error', { message: 'Falha ao buscar histórico de mensagens' });
        }
      });

      // Entrar em um grupo de chat
      socket.on('join_group', (data) => {
        const { groupId } = data;
        socket.join(`group_${groupId}`);
        console.log(`👥 Usuário ${socket.profileId} entrou no grupo: ${groupId}`);
        
        socket.to(`group_${groupId}`).emit('user_joined', {
          message: 'Um usuário entrou no grupo',
          socketId: socket.id,
          profileId: socket.profileId
        });
      });

      // Entrar em um chat privado
      socket.on('join_private_chat', (data) => {
        const { otherUserId } = data;
        const chatRoomId = [socket.profileId, otherUserId].sort().join('_');
        socket.join(chatRoomId);
        console.log(`💬 Usuário ${socket.profileId} entrou no chat privado com: ${otherUserId}`);
      });

      // Enviar mensagem para um chat privado
      socket.on('send_private_message', async (data) => {
    try {
        const { content, receiverId, mediaId, messageType } = data;
        const senderId = socket.profileId;

        if (!receiverId) return;

        console.log('📩 Nova mensagem privada recebida:', data);

        const messageData: any = {
            content: content,
            sender: senderId,
            receiver: receiverId,
            messageType: messageType || 'text',
            publishedAt: new Date(),
        };

        if (mediaId) {
            messageData.media = mediaId;
        }

        const message = await strapi.entityService.create(
            'api::chat-message.chat-message',
            {
                data: messageData,
                populate: ['sender', 'receiver', 'media'], // GARANTIR QUE A MÉDIA É POPULADA
            }
        );

        const chatRoomId = [senderId, receiverId].sort().join('_');

        io.to(chatRoomId).emit('new_private_message', {
            message,
            chatRoomId,
        });

        console.log(`✅ Mensagem (tipo: ${messageType}) enviada para a sala: ${chatRoomId}`);

    } catch (error) {
        console.error('❌ Erro ao enviar mensagem privada:', error);
        socket.emit('error', { message: 'Falha ao enviar mensagem privada' });
    }
});

      // Enviar mensagem para um grupo
      socket.on('send_message', async (data) => {
        try {
            const { groupId, content, messageType, mediaId } = data;
            const senderId = socket.profileId;

            if (!groupId) {
                console.error('❌ Group ID não fornecido.');
                    return;
            }

            console.log('📩 Nova mensagem de grupo recebida:', data);

            const messageData: any = {
                content: content,
                group: groupId,
                sender: senderId,
                messageType: messageType || 'text',
                publishedAt: new Date(),
        };

        if (mediaId) {
            messageData.media = mediaId;
        }

        const message = await strapi.entityService.create(
            'api::chat-message.chat-message', // Usamos a mesma tabela!
            {
                data: messageData,
                populate: ['sender', 'group', 'media'], // Popular com os dados certos
            }
        );

        const roomName = `group_${groupId}`;

        // Envia para a sala do grupo
        io.to(roomName).emit('new_message', {
            message,
            groupId,
        });

        console.log(`✅ Mensagem de grupo enviada para a sala: ${roomName}`);

    } catch (error) {
        console.error('❌ Erro ao enviar mensagem de grupo:', error);
        socket.emit('error', { message: 'Falha ao enviar mensagem de grupo' });
    }
});

      // ----------------------------------------------------
      // LÓGICA ADICIONAL: DIGITANDO E DESCONEXÃO
      // ----------------------------------------------------

      // Indicador "digitando"
      socket.on('typing', (data) => {
        const { groupId, userName } = data;
        socket.to(`group_${groupId}`).emit('user_typing', {
          userName: userName,
          groupId: groupId
        });
      });

      // Indicador "parou de digitar"
      socket.on('stop_typing', (data) => {
        const { groupId } = data;
        socket.to(`group_${groupId}`).emit('user_stop_typing', {
          groupId: groupId
        });
      });

      // Evento de teste básico
      socket.on('test_message', (data) => {
        console.log('🧪 Teste recebido:', data);
        socket.emit('test_response', { 
          message: 'Socket.io funcionando com seus Content Types!',
          timestamp: new Date() 
        });
      });

      // Desconexão do usuário
      socket.on('disconnect', () => {
        onlineUsers.delete(socket.profileId);
        io.emit('user_disconnected', { profileId: socket.profileId });
        console.log(`👋 Usuário desconectado: ${socket.id} (Perfil: ${socket.profileId}). Total online: ${onlineUsers.size}`);
      });
    });

    // Torna a instância do Socket.io acessível globalmente
    strapi.io = io;
    console.log('🎯 Socket.io pronto para uso!');
  },
};
