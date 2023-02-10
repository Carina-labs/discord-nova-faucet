const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const { SigningStargateClient, GasPrice, calculateFee} = require("@cosmjs/stargate");

module.exports = async function sendToken(recipient) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(process.env.FAUCET_MNEMONIC, { prefix: "nova" });
  const [account] = await wallet.getAccounts();
  const gasPrice = GasPrice.fromString("0.01unova");
  const client = await SigningStargateClient.connectWithSigner(process.env.RPC_ENDPOINT, wallet, { gasPrice: gasPrice });
  return await client.sendTokens(account.address, recipient, [{ denom: "unova", amount: "1000000" }], "auto");
}
