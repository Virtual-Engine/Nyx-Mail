const { Events, EmbedBuilder, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const guild = interaction.client.guilds.cache.get(process.env.guild);
        const category = guild.channels.cache.get(process.env.category);

        await interaction.deferUpdate();

        if (interaction.customId === 'openTicket') {
            const newChannel = await guild.channels.create({
                name: `mail-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: category.id,
                topic: interaction.user.id,
            });

            const embed = new EmbedBuilder()
                .setTitle(`Nouveau ModMail de \`${interaction.user.username}\``)
                .setDescription(`Envoyez vos messages ici !`)
                .setColor(process.env.color)
                .setThumbnail(interaction.user.displayAvatarURL());

            await newChannel.send({ embeds: [embed] });
            await interaction.followUp({ content: "Votre ticket a été ouvert !", ephemeral: true });
        } else if (interaction.customId === 'cancelTicket') {
            await interaction.followUp({ content: "Demande de ModMail annulée.", ephemeral: true });
        } else if (interaction.customId === 'closeDefinitive') {
            await interaction.channel.delete();
        } else if (interaction.customId === 'closeTemporary') {
            const channel = interaction.channel;
            await channel.setTopic(`${channel.topic} - ferme temporairement`);
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });

            const tempCloseEmbed = new EmbedBuilder()
                .setTitle('ModMail fermé temporairement')
                .setDescription('Le salon est temporairement fermé.')
                .setColor(process.env.color);

            const reopenButton = new ButtonBuilder()
                .setCustomId('reopenTicket')
                .setLabel('Réouvrir')
                .setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder().addComponents(reopenButton);

            await channel.send({ embeds: [tempCloseEmbed], components: [row] });
            await interaction.followUp({ content: "Le salon a été fermé temporairement.", ephemeral: true });
        } else if (interaction.customId === 'reopenTicket') {
            const channel = interaction.channel;
            if (channel.topic && channel.topic.includes("ferme temporairement")) {
                await channel.setTopic(channel.topic.replace(' - ferme temporairement', ''));
                await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: true });

                const reopenEmbed = new EmbedBuilder()
                    .setTitle('ModMail réouvert')
                    .setDescription('Le salon a été réouvert. Vous pouvez maintenant envoyer des messages.')
                    .setColor(process.env.color);

                await channel.send({ embeds: [reopenEmbed] });
                await interaction.followUp({ content: "Le salon a été réouvert.", ephemeral: true });
            }
        }
    },
};