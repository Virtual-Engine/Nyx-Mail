const { Discord, ActivityType, Events, EmbedBuilder, Client } = require('discord.js');
const moment = require('moment')
const { log, logs } = require("nyx-logger");
const fs = require('node:fs');
const { connexionApi, checkApiStatus, sessionIdApi } = require('../api')
const config = require("../config");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {

        connexionApi();

        log("info", `Login : ${client.user.username}`);

        const logChannel = client.channels.cache.get(process.env.salon_starting);
        if (logChannel) {
            log("info", `Waiting for embed starting`);
            setTimeout(() => {
                const Embed = new EmbedBuilder()
                    .setTitle("**Starting L0yy Mail**")
                    .setDescription(`\`\`\`L0yy Mail Starting with session ${sessionIdApi}\n\`\`\``)
                    .setColor("#7f00ff")
                    .setTimestamp()

                logChannel.send({ embeds: [Embed] })
                log("done", `Embed Starting Send At ${process.env.salon_starting}`);
            }, 60000);
        }

        client.user.setPresence({
            activities: [{ name: 'DM Me for support', type: ActivityType.Streaming, url: "https://www.twitch.tv/punisherenlive" }],

        });
    },
};