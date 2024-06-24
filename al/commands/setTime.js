const { SlashCommandBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('モーニングコール')
    .setDescription('陸八魔アルが指定した時間にモーニングコールしてくれます'),
  execute: async function(interaction) {

    // 現在の日本時間を取得
    const japanTime = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
    const japanDate = new Date(japanTime);
    const hours = japanDate.getHours();
    const minutes = japanDate.getMinutes();

    // 現在時刻に2時間を加えて、24時間を超える場合は調整する
    let time;
    if (hours + 2 >= 24) {
        time = `${hours + 2 - 24}:${String(minutes).padStart(2, '0')}`;
    } else {
        time = `${hours + 2}:${String(minutes).padStart(2, '0')}`;
    }

        try {
            // メッセージに返信して通知する
            await interaction.channel.send('わかったわ。その時間に起こしに行くわね！');

            // ファイルから既存のデータを読み込む
            let datas = {};
            try {
                const data = await fsPromises.readFile(`./data/morningData.json`, 'utf8');
                datas = JSON.parse(data);
            } catch (error) {
                // ファイルが存在しない場合や読み込みエラーが発生した場合に備えて、空のオブジェクトを使用します
                console.error('Error reading bumpData.json:', error);
            }

            // 新しいデータを既存のデータに追加
            datas[interaction.author.name] = {
                "uid": `${interaction.author.id}`,
                "time": `${time}`
            };

            // 更新されたデータをファイルに書き込む
            await fsPromises.writeFile(`./data/morningData.json`, JSON.stringify(datas, null, 2));
        } catch (error) {
            console.error('Error processing /bump:', error);
        }
  //await interaction.reply({ content: 'echo', ephemeral: true });
}};


 
