import { Message } from "discord.js";
import { add, canFaucet } from "./cache.js";

export const handleMessage = (msg: Message, faucetAddress: string) => {
  const { result, address } = validateMsg(msg)
  if (!result) {
    return {
      status: 'failed',
      msg: []
    }
  }

  if (canFaucet(address)) {
    add(address, Date.now())
    return createMsgSends(faucetAddress, address)
  }

  return {
    status: 'failed',
    msg: []
  }
}

export const validateMsg = (msg: Message) => {
  const TEST_COMMAND_CHANNEL_ID = "1072686227507126342";
  const FAUCET_CHANNEL_ID = "1073127922942103592";

  if (msg.channelId !== TEST_COMMAND_CHANNEL_ID && msg.channelId !== FAUCET_CHANNEL_ID) {
    return { result: false, address: '' }
  }

  const cmd = msg.content.split(" ")[0]
  const address = msg.content.split(" ")[1]

  if (cmd === null || address === null) {
    return { result: false, address: '' }
  }

  if (cmd !== '!faucet') {
    return { result: false, address: '' }
  }

  if (address.length < 40 || address.length > 45) {
    return { result: false, address: '' }
  }

  return { result: address.startsWith('nova'), address: address }
}

const createMsgSends = (faucetAddress: string, receiver: string) => {
  return {
    status: "success",
    msg: [
      {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: {
          fromAddress: faucetAddress,
          toAddress: receiver,
          amount: [
            { amount: "10000000", denom: "unova" },
          ],
        },
      },
      {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: {
          fromAddress: faucetAddress,
          toAddress: receiver,
          amount: [
            { amount: "10000000", denom: "ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B" },
          ],
        },
      },
      {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: {
          fromAddress: faucetAddress,
          toAddress: receiver,
          amount: [
            { amount: "10000000", denom: "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2" },
          ],
        },
      },
      {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: {
          fromAddress: faucetAddress,
          toAddress: receiver,
          amount: [
            { amount: "10000000", denom: "ibc/4CD525F166D32B0132C095F353F4C6F033B0FF5C49141470D1EFDA1D63303D04" },
          ],
        },
      }
    ]
  }
}
