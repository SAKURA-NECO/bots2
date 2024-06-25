const { promises: fsPromises, ...fs } = require('fs');

function register(al, alClientId, Collection, REST, Routes, path) {
    al.commands = new Collection();

    const commandsPath = path.join(__dirname, 'commands');
    const commands = [];
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(process.env['AL_TOKEN']);
    (async () => {
        try {
            console.log(`AlBOT: ${commandFiles}`);
            console.log(`AlBOT: ${commands.length}個のアプリケーションコマンドを登録します`);

            const data = await rest.put(
                Routes.applicationCommands(alClientId),
                { body: commands },
            );

            console.log(`AlBOT: ${data.length}個のアプリケーションコマンドを登録しました。`);
        } catch (error) {
            console.error(error);
        }
    })();

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            al.commands.set(command.data.name, command);
        } else {
            console.log(`AlBOT: ${filePath}に必要な"data"か"execute"がありません`);
        }
    }
}

async function checkTime(client) {
    try {
        const japanTime = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        const japanDate = new Date(japanTime);
        const hours = japanDate.getHours();
        const minutes = japanDate.getMinutes();
        const nowtime = `${hours}:${String(minutes).padStart(2, '0')}`;

        const data = await fsPromises.readFile('./data/morningData.json', 'utf-8');
        const jsonData = JSON.parse(data);

        for (const guildId in jsonData) {
            if (jsonData.hasOwnProperty(guildId) && jsonData[guildId].time === nowtime) {
                morning(client, guildId);
            }
        }
    } catch (error) {
        console.error('Error in checkTime:', error);
    }
    return null;
}

async function morning(client, guildId) {
    try {
        const data = await fsPromises.readFile('./data/morningData.json', 'utf-8');
        const jsonData = JSON.parse(data);
        const cid = jsonData[guildId].cid;
        const oid = jsonData[guildId].oid;
        const user = client.users.cache.get(oid);
        user.send(`ハルカ！起きてちょうだい！クライアントからの依頼受けに行くわよ！`);
    } catch (error) {
        console.error('Error in morning:', error);
    }
}

module.exports = {
    register,
    morning,
    checkTime,
}
