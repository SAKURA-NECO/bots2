const {alCrientId} = require('./al/config.json');
const hFnc = require("./al/func.js")
const {mikaCrinetId} = require('./mika/config.json')
const mFnc = require("./mika/func.js")

require('dotenv').config();
const server = require('./server.js'); 
const path = require('path')
const fs = require("fs")

server.keepServer();

const {
  REST,
  Routes,
  Client,
  Partials,
  Collection,
  EmbedBuilder,
  GatewayIntentBits,
} = require("discord.js");

const al = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [
    Partials.Channel,
    Partials.Message
  ]
});//intents設定
const mika = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [
    Partials.Channel,
    Partials.Message
  ]
});//intents設定

if (
    alCrientId == undefined) {
  console.error("ALClientIDが設定されていません。");
  process.exit(0);
}//clientId照合
if (
  mikaCrinetId == undefined) {
console.error("MIKAClientIDが設定されていません。");
process.exit(0);
}//clientId照合

if (
    process.env['AL_TOKEN'] == undefined) {
    console.error("AL_TOKENが設定されていません。");
    process.exit(0);
  }//アルtoken照合
if (
    process.env['MIKA_TOKEN']== undefined) {
    console.error("MIKA_TOKENが設定されていません。");
    process.exit(0);
    }//ミカtoken照合

console.log("起動準備中...")

al.on("ready", () => {

  hFnc.register(al,alCrientId,Collection,REST,Routes,path,fs)
  
 
  

});//readyevent

al.login(process.env['AL_TOKEN']);//ログイン

mika.on("ready", () => {

  mFnc.register(mika,mikaCrinetId,Collection,REST,Routes,path,fs)
  
  
  

});//readyevent

mika.login(process.env['MIKA_TOKEN']);//ログイン

function readyLog() { console.log("―――起動完了―――") }
  setTimeout(readyLog, 2500)


  al.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;
          let senduser = require("./al/commands/dmsend.js")
    if (interaction.customId === 'DMsend') {
  
    // Get the data entered by the user
    const content = interaction.fields.getTextInputValue('contents');
  
    console.log(senduser.options);
          al.users.cache.get(senduser).send(content)
          await interaction.reply({content:"メッセージを送信しました！",ephemeral: true})
    interaction.channel.send(`送信内容:${content}`);
  
    }
  });
  
  al.on('messageCreate', (message) => {
  if(message.author.bot)return;
    if(!message.guild){
  const Embed = new EmbedBuilder()
    .setTitle("DMメッセージ着信")
    .setDescription(`ユーザ：${message.author.displayName}`)
    .addFields(
      { name: '内容', value: `${message.content}` }
    )
    .setColor(`#f89475`);
  
    const channels = al.channels.cache.get('1247750543179386921');
    channels.send({embeds: [Embed] });
  }
  });
  
  al.on('interactionCreate', async interaction => {
    try{
    if (!interaction.isChatInputCommand()) return;
  
    const command = interaction.client.commands.get(interaction.commandName);
  
    if (!command) {
      console.error(`${interaction.commandName} が見つかりません。`);
      return;
    }
  
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
    }
    }catch(e){
      interaction.channel.send("Interationでエラーが発生しました。\n少し時間を開けて再度実行してください。")
      console.log(e)
    }
  });//スラッシュコマンド設定  


  mika.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;
          let senduser = require("./al/commands/dmsend.js")
    if (interaction.customId === 'DMsend') {
  
    // Get the data entered by the user
    const content = interaction.fields.getTextInputValue('contents');
  
    console.log(senduser.options);
          mika.users.cache.get(senduser).send(content)
          await interaction.reply({content:"メッセージを送信しました！",ephemeral: true})
    interaction.channel.send(`送信内容:${content}`);
  
    }
  });
  
  mika.on('messageCreate', (message) => {
  if(message.author.bot)return;
    if(!message.guild){
  const Embed = new EmbedBuilder()
    .setTitle("DMメッセージ着信")
    .setDescription(`ユーザ：${message.author.displayName}`)
    .addFields(
      { name: '内容', value: `${message.content}` }
    )
    .setColor(`#f89475`);
  
    const channels = mika.channels.cache.get('1247750543179386921');
    channels.send({embeds: [Embed] });
  }
  });
  
  mika.on('interactionCreate', async interaction => {
    try{
    if (!interaction.isChatInputCommand()) return;
  
    const command = interaction.client.commands.get(interaction.commandName);
  
    if (!command) {
      console.error(`${interaction.commandName} が見つかりません。`);
      return;
    }
  
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
    }
    }catch(e){interaction.channel.send("Interationでエラーが発生しました。\n少し時間を開けて再度実行してください。")}
  });//スラッシュコマンド設定  
