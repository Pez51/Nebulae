const polkadotService = require('./services/polkadotService');

async function test() {
  console.log('\nProbando conexion Polkadot...\n');
  try {
    const info = await polkadotService.getChainInfo();
    console.log('Blockchain Info:');
    console.log(`  Chain: ${info.chain}`);
    console.log(`  Node: ${info.nodeName}`);
    console.log(`  Block: #${info.blockNumber}`);
    console.log('\nConexion exitosa!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await polkadotService.disconnect();
  }
}

test();
