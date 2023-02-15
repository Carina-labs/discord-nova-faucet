import express from 'express'
import { config } from 'dotenv'
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { Client, Events, Message } from "discord.js";
import Queue from "@supercharge/queue-datastructure";
import { processing } from "./process.js";
import { logger } from "./logger.js";
import { validateMsg } from "./handler.js";
import {Mutex} from "async-mutex";

config()
const app = express()
const client = new Client({ intents: [1, 512, 32768] })

app.listen(3000, async () => {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(process.env.FAUCET_MNEMONIC || "", { prefix: 'nova' })
  const [faucet] = await wallet.getAccounts()
  const queue = new Queue<Message>()

  processing(queue, faucet.address).catch((err) => {
    logger.log({
      level: 'error',
      message: `processing error: ${err}`
    })
  })

  client.on(Events.ClientReady, async () => {
    console.log('discord faucet is ready')
  })

  client.on(Events.MessageCreate, async (msg) => {
    const { result, address } = validateMsg(msg)
    if (result) {
      logger.log({
        level: 'info',
        message: `enqueue message: ${address}`
      })
      queue.enqueue(msg)
    }
  })

  client.login(process.env.DISCORD_TOKEN).then((res) => {
    console.log('discord connected.')
  }).catch((err) => {
    console.log('discord connect error', err)
  })
})

app.get('/health', (req, res) => {
  res.send('Discord faucet bot is running!')
})
