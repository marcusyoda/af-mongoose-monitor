const { SuperConsole } = require('af-super-console');

class MongooseMonitor {
  constructor(connection) {
    this.connection = connection;

    this.monitor = this.monitor.bind(this);
    this.dumpStatus = this.dumpStatus.bind(this);
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

  getStatus() {
    const { readyState } = this.connection;
    return readyState;
  }

  dumpStatus(
    group = 'DB-CONN',
    reason = 'Mongoose Connection Status',
  ) {
    const readyState = this.getStatus();

    // 0: disconnected
    if (readyState === 0) {
      SuperConsole.groupLog({
        type: 'error', message: 'DISCONNECTED', reason, group,
      });
    }

    // 1: connected
    if (readyState === 1) {
      SuperConsole.groupLog({
        type: 'info', message: 'CONNECTED', reason, group,
      });
    }

    // 2: connecting
    if (readyState === 2) {
      SuperConsole.groupLog({
        type: 'info', message: 'CONNECTING', reason, group,
      });
    }

    // 3: disconnecting
    if (readyState === 3) {
      SuperConsole.groupLog({
        type: 'warning', message: 'DISCONNECTING', reason, group,
      });
    }
  }
}

module.exports = MongooseMonitor;
