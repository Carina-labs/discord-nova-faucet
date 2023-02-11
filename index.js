require("dotenv").config();
const { Client, Events, GatewayIntentBits, SlashCommandBuilder} = require('discord.js');
const sendToken = require("./faucet");
const {add} = require("./cache");
const client = new Client({ intents: [1, 512, 32768]});

const COMMAND_PREFIX = "!faucet";
const TEST_COMMAND_CHANNEL_ID = "1072686227507126342";
const FAUCET_CHANNEL_ID = "1073127922942103592";

client.on('ready', () => {
  console.log('bot is ready.');
});

client.on(Events.MessageCreate, async (msg) => {
  if (msg.content.startsWith(COMMAND_PREFIX) && (msg.channelId === TEST_COMMAND_CHANNEL_ID || msg.channelId === FAUCET_CHANNEL_ID)) {
    const address = msg.content.split(" ")[1];
    console.log(`user faucet request, ${address}`);
    const res = await sendToken(address);
    const cacheResult = add(address, Date.now());
    if (cacheResult) {
      await msg.reply(`faucet executed send 10NOVA and 10ibc tokens, receiver: ${address}, tx hash: ${res.transactionHash}`);
    } else {
      await msg.reply(`you cannot get faucet until 24hours.`)
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
