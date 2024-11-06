const { Events, EmbedBuilder, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.author.bot) return;
        let embed = new EmbedBuilder();

        // Gestion des DMs
        if (message.channel.type === ChannelType.DM) {
            const guild = await message.client.guilds.cache.get(process.env.guild);
            if (guild) {
                const category = await guild.channels.cache.get(process.env.category);
                if (category) {
                    const existingChannel = category.children.cache.find(c => c.topic === message.author.id);

                    if (!existingChannel) {
                        const openButton = new ButtonBuilder()
                            .setCustomId('openTicket')
                            .setLabel('Ouvrir')
                            .setStyle(ButtonStyle.Success);
                        const cancelButton = new ButtonBuilder()
                            .setCustomId('cancelTicket')
                            .setLabel('Annuler')
                            .setStyle(ButtonStyle.Danger);

                        const row = new ActionRowBuilder().addComponents(openButton, cancelButton);

                        const promptEmbed = new EmbedBuilder()
                            .setTitle(`Demande de ModMail`)
                            .setDescription(`Voulez-vous ouvrir un ticket pour parler à l'équipe de modération ?`)
                            .setColor(process.env.color)
                            .setThumbnail(message.author.displayAvatarURL());

                        await message.author.send({ embeds: [promptEmbed], components: [row] });
                        return;
                    }

                    embed.setTitle(`Message de \`${message.author.username}\``);
                    embed.setDescription(`\`\`\`${message.content}\`\`\``);
                    embed.setColor(process.env.color);
                    embed.setThumbnail(message.author.displayAvatarURL());
                    await existingChannel.send({ embeds: [embed] });
                    await message.react('✅');
                }
            }
        } else {
            if (message.channel.parentId === process.env.category && message.channel.type === ChannelType.GuildText) {
                if (message.channel.topic && message.channel.topic.includes("ferme")) {
                    await message.react('❌');
                    return;
                }

                if (message.content === ".fermer") {
                    const closeButton = new ButtonBuilder()
                        .setCustomId('closeDefinitive')
                        .setLabel('Fermer définitivement')
                        .setStyle(ButtonStyle.Danger);
                    const tempCloseButton = new ButtonBuilder()
                        .setCustomId('closeTemporary')
                        .setLabel('Fermer temporairement')
                        .setStyle(ButtonStyle.Secondary);

                    const row = new ActionRowBuilder().addComponents(closeButton, tempCloseButton);

                    const closeEmbed = new EmbedBuilder()
                        .setTitle('Fermeture du ModMail')
                        .setDescription('Souhaitez-vous fermer définitivement ou temporairement ce ModMail ?')
                        .setColor(process.env.color);

                    await message.channel.send({ embeds: [closeEmbed], components: [row] });
                } else if (message.channel.topic !== null) {
                    const member = await message.guild.members.cache.get(message.channel.topic);
                    if (member) {
                        const highestrole = member.roles.highest.name;
                        embed.setTitle(`Message de \`${highestrole} | ${message.author.username}\``);
                        embed.setDescription(`\`\`\`${message.content}\`\`\``);
                        embed.setColor(process.env.color);
                        embed.setThumbnail(message.author.displayAvatarURL());
                        embed.setFooter({ text: "Nyx © 2024 - Tous droits réservés." });
                        await message.react('✅');
                        await member.send({ embeds: [embed] });
                    }
                }
            }
        }
    },
};