import {DirectSecp256k1HdWallet, EncodeObject} from "@cosmjs/proto-signing";
import {GasPrice, SigningStargateClient} from "@cosmjs/stargate";

export const sendTokens = async (data: EncodeObject[]) => {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(process.env.FAUCET_MNEMONIC || "", { prefix: 'nova' })
  const [faucet] = await wallet.getAccounts()
  const gasPrice = GasPrice.fromString('0.01unova')
  const client = await SigningStargateClient.connectWithSigner(process.env.RPC_ENDPOINT || "", wallet, { gasPrice: gasPrice })
  return await client.signAndBroadcast(faucet.address, data, 'auto')
}
