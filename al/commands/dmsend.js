const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');
const fs = require("fs")
const path = require('path')


module.exports = {
  data: new SlashCommandBuilder()
    .setName('adtool1')
    .setDescription('機能1')
    .addUserOption((option) =>
        option
          .setName('user')
          .setDescription('ユーザーを選択する')
          .setRequired(true)
      )
  ,
  execute: async function(interaction) {
    try{
    let getuser = interaction.options.getUser('user');
    const senduser = getuser.id
    module.exports = senduser;
    console.log(senduser)
    const modal = new ModalBuilder()
    .setCustomId('DMsend')
    .setTitle('DM送信');

// Add components to modal

const dmcontent = new TextInputBuilder()
    .setCustomId('contents')
    .setLabel("送信内容を書き込んでください")
    // Paragraph means multiple lines of text.
    .setStyle(TextInputStyle.Paragraph);

// An action row only holds one text input,
// so you need one action row per text input.
const firstActionRow = new ActionRowBuilder().addComponents(dmcontent);

// Add inputs to the modal
modal.addComponents(firstActionRow);

// Show the modal to the user
await interaction.showModal(modal);
      }catch(e){console.log(e)}
}};

