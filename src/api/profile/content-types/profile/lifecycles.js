// src/api/profile/content-types/profile/lifecycles.js

module.exports = {
  /**
   * Esta função é o nosso "porteiro". Ela roda automaticamente
   * ANTES de qualquer novo perfil ser criado no banco de dados.
   * @param {object} event - Contém os dados da requisição.
   */
  beforeCreate(event) {
    const { data } = event.params;

    console.log('🚪 Porteiro do Profile: Inspecionando dados antes de criar...', data);

    // CORREÇÃO: Usando "DisplayName" e "Bio" com as letras maiúsculas,
    // exatamente como está no seu schema.json!
    // Se não existirem, definimos um valor padrão.
    if (!data.DisplayName) {
        data.DisplayName = "Novo Usuário";
    }
    if (!data.Bio) {
        data.Bio = "";
    }

    // Medida de Segurança: Removemos qualquer campo sensível que o usuário
    // não deveria ter permissão para definir na criação.
    if (data.isVerified !== undefined) {
      delete data.isVerified;
    }
    if (data.followersCount !== undefined) {
      delete data.followersCount;
    }
    if (data.followingCount !== undefined) {
      delete data.followingCount;
    }

    // Ação Final e mais segura: O back-end define os valores padrão,
    // ignorando qualquer coisa que venha do front-end.
    data.isVerified = false;
    data.followersCount = 0;
    data.followingCount = 0;
    
    console.log('✅ Porteiro do Profile: Dados limpos e prontos para salvar!', data);
  },
};
