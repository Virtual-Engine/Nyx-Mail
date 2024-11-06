const fs = require('node:fs');
const path = require('node:path');
const { log } = require("nyx-logger");
const { Player } = require('discord-player');
const { REST, Routes, IntentsBitField, Partials } = require('discord.js');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const config = require("./config");
const colors = require("colors")
const intent = require('./intents');

require('dotenv').config();

log("asci", `

 _|      _|  _|              _|                          _|      _|_|_|_|                      _|                      
 _|      _|      _|  _|_|  _|_|_|_|  _|    _|    _|_|_|  _|      _|        _|_|_|      _|_|_|      _|_|_|      _|_|    
 _|      _|  _|  _|_|        _|      _|    _|  _|    _|  _|      _|_|_|    _|    _|  _|    _|  _|  _|    _|  _|_|_|_|  
   _|  _|    _|  _|          _|      _|    _|  _|    _|  _|      _|        _|    _|  _|    _|  _|  _|    _|  _|        
     _|      _|  _|            _|_|    _|_|_|    _|_|_|  _|      _|_|_|_|  _|    _|    _|_|_|  _|  _|    _|    _|_|_|  
                                                                                           _|                          
                                                                                       _|_|         
`, "cyan");

log("done", "Initialize Virtual Engine");
log("dev", `Categorie ID : ${process.env.category}`);
log("dev", `Server ID : ${process.env.guild}`);
log("dev", `Client ID : ${process.env.ID}`);

const client = new Client({ intents: intent, partials: [Partials.Message, Partials.Channel] });
client.commands = new Collection();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN);