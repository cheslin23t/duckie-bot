const {
    Client,
    Interaction,
    EmbedBuilder,
    ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();

            const guild = interaction.guild;

            if (!guild) {
                return await interaction.editReply("This command can only be used in a server.");
            }

            const owner = await guild.fetchOwner();

            const embed = new EmbedBuilder()
                .setColor("#4ea554")
                .setTitle(`Server Information`)
                .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
                .addFields(
                    { name: "Server Name", value: `${guild.name}`, inline: true },
                    { name: "Server ID", value: `${guild.id}`, inline: true },
                    { name: "Owner", value: `<@${owner.user.id}> (${owner.user.id})`, inline: true },
                    { name: "Created On", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
                    { name: "Members", value: `${guild.memberCount}`, inline: true },
                    { name: "Boost Level", value: `${guild.premiumTier}`, inline: true },
                    { name: "Boost Count", value: `${guild.premiumSubscriptionCount || 0}`, inline: true },
                    { name: "Roles", value: `${guild.roles.cache.size}`, inline: true },
                    { name: "Channels", value: `${guild.channels.cache.size}`, inline: true }
                )
                .setFooter({
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("Error fetching server info:", error);
            await interaction.editReply("An error occurred while trying to fetch the server information.");
        }
    },

    name: "serverinfo",
    description: "Displays information about the current server.",
};
