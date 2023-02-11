const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const { SigningStargateClient, GasPrice, calculateFee} = require("@cosmjs/stargate");

module.exports = async function sendToken(recipient) {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(process.env.FAUCET_MNEMONIC, { prefix: "nova" });
  const [faucet] = await wallet.getAccounts();
  const gasPrice = GasPrice.fromString("0.01unova");
  const client = await SigningStargateClient.connectWithSigner(process.env.RPC_ENDPOINT, wallet, { gasPrice: gasPrice });
  const msgs = [
    {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: {
        fromAddress: faucet.address,
        toAddress: recipient,
        amount: [
          { amount: "10000000", denom: "unova" },
        ],
      },
    },
    {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: {
        fromAddress: faucet.address,
        toAddress: recipient,
        amount: [
          { amount: "10000000", denom: "ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B" },
        ],
      },
    },
    {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: {
        fromAddress: faucet.address,
        toAddress: recipient,
        amount: [
          { amount: "10000000", denom: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2" },
        ],
      },
    },
    {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: {
        fromAddress: faucet.address,
        toAddress: recipient,
        amount: [
          { amount: "10000000", denom: "ibc/4CD525F166D32B0132C095F353F4C6F033B0FF5C49141470D1EFDA1D63303D04" },
        ],
      },
    }
  ]

  return await client.signAndBroadcast(faucet.address, msgs, "auto")
}
