const { ApiPromise, WsProvider } = require('@polkadot/api');

class PolkadotService {
  constructor() {
    this.api = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return this.api;
    try {
      const wsProvider = new WsProvider('wss://westend-rpc.polkadot.io');
      console.log('Conectando a Westend...');
      this.api = await ApiPromise.create({ provider: wsProvider });
      await this.api.isReady;
      this.isConnected = true;
      const chain = await this.api.rpc.system.chain();
      console.log(`Conectado a: ${chain}`);
      return this.api;
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }

  async getChainInfo() {
    await this.connect();
    const [chain, nodeName, lastHeader] = await Promise.all([
      this.api.rpc.system.chain(),
      this.api.rpc.system.name(),
      this.api.rpc.chain.getHeader()
    ]);
    return {
      chain: chain.toString(),
      nodeName: nodeName.toString(),
      blockNumber: lastHeader.number.toNumber()
    };
  }

  async disconnect() {
    if (this.api) await this.api.disconnect();
    this.isConnected = false;
  }
}

module.exports = new PolkadotService();
