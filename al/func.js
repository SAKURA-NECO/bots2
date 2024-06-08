const { promises: fsPromises, ...fs } = require('fs');

function register(al,alCrientId,Collection,REST,Routes,path,fs) {
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
        console.log(`AlBOT:${commandFiles}`);
        console.log(`AlBOT:${commands.length}個のアプリケーションコマンドを登録します`);
  
        const data = await rest.put(
          Routes.applicationCommands(alCrientId),
          { body: commands },
        );
  
        console.log(`AlBOT:${data.length}個のアプリケーションコマンドを登録しました。`);
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
        console.log(`AlBOT:${filePath}に必要な"data"か"execute"がありません`)
      }
  
    }
    }

    module.exports = {
        register
    }