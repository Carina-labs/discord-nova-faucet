import Queue from "@supercharge/queue-datastructure";
import wait from "waait";
import { logger } from "./logger.js";
import { handleMessage } from "./handler.js";
import { sendTokens } from "./faucet.js";
import { EncodeObject } from "@cosmjs/proto-signing";
import { Message } from "discord.js";

export const processing = async (queue: Queue<Message<boolean>>, faucetAddress: string) => {
  while(true) {
    const clonedQueue = new Queue<Message>(...queue.items())
    const queueSize = clonedQueue.size()
    for (let i = 0; i < queueSize; i++) {
      queue.dequeue()
    }
    logger.log({
      level: 'info',
      message: `queueSize: ${queueSize}`
    })

    if (queueSize > 0) {
      const parsedList = []
      while(!clonedQueue.isEmpty()) {
        const queuedDiscordMsg = clonedQueue.dequeue()
        if (queuedDiscordMsg === null) {
          logger.log({
            level: 'error',
            message: 'discord msg is null'
          })
        }

        const handleResult = handleMessage(queuedDiscordMsg!, faucetAddress)
        if (handleResult.status === 'success') {
          parsedList.push({
            data: handleResult.msg,
            discordMsg: queuedDiscordMsg
          })
        } else {
          queuedDiscordMsg?.reply(`:x: you cannot get faucet until 24hours.`)
        }
      }

      const msgSends: EncodeObject[] = []
      parsedList.forEach((parsed) => {
        parsed.data.forEach((single) => {
          msgSends.push(single)
        })
      })

      if (msgSends.length > 0) {
        const txResult = await sendTokens(msgSends)
        Promise.all(
          parsedList.map((parsed) => new Promise((resolve) => {
            parsed.discordMsg?.reply(`:ballot_box_with_check: send 10NOVA and 10ibc tokens: <https://explorer.dev-supernova.xyz/supernova/transactions/${txResult.transactionHash}>`)
          }))
        ).then((res) => console.log('finish...'))
      }
    }

    logger.log({
      level: 'info',
      message: 'wait 10s'
    })
    await wait(10_000)
  }
}
