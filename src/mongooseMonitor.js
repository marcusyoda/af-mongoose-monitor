const { SuperConsole } = require('af-super-console');

class MongooseMonitor {
  constructor(connection) {
    this.connection = connection;
  }

  monitor() {
    // conectando
    this.connection.on('connecting', () => {
      SuperConsole.groupLog({
        type: 'info',
        group: 'DB',
        message: 'Conectando',
        reason: 'Iniciando a Conexão',
      });
    });

    // desconectando
    this.connection.on('disconnecting', () => {
      SuperConsole.groupLog({
        type: 'info',
        group: 'DB',
        message: 'Desconectando',
        reason: 'Encerrando a Conexão',
      });
    });

    // falhas de re-conexão
    this.connection.on('reconnectFailed', () => {
      SuperConsole.groupLog({
        type: 'warning',
        group: 'DB',
        message: 'Desconectado',
        reason: 'Tentando re-conexão',
      });
    });

    // conectado
    this.connection.on('connected', () => {
      SuperConsole.groupLog({
        type: 'success',
        group: 'DB',
        message: 'Conectado',
        reason: 'Comunicação estabelecida com Sucesso',
      });
    });

    // desconectado
    this.connection.on('disconnected', () => {
      SuperConsole.groupLog({
        type: 'warning',
        group: 'DB',
        message: 'Desconectado',
        reason: 'A conexão foi interrompida inesperadamente',
      });
    });

    // fechada
    this.connection.on('close', () => {
      SuperConsole.groupLog({
        type: 'warning',
        group: 'DB',
        message: 'Desconectado',
        reason: 'A conexão foi fechada via close()',
      });
    });

    // erro
    this.connection.on('error', ({ message, reason }) => {
      SuperConsole.groupLog({
        type: 'error',
        group: 'DB',
        message,
        reason,
      });
    });
  }
}

module.exports = MongooseMonitor;
