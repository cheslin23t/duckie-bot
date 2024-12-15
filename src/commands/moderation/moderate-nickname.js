const { 
    Client, 
    Interaction, 
    EmbedBuilder, 
    ApplicationCommandOptionType, 
    PermissionsBitField, 
} = require("discord.js");

module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        try {
            if (!interaction.guild) {
                return interaction.reply({
                    content: "This command can only be used in a server.",
                    ephemeral: true,
                });
            }

            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member || !member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
                return interaction.reply({
                    content: "You do not have permission to manage nicknames.",
                    ephemeral: true,
                });
            }

            const userId = interaction.options.getString("userid");
            const reason = interaction.options.getString("reason") || "No reason provided";

            const user = await client.users.fetch(userId).catch(() => null);
            const targetMember = interaction.guild.members.cache.get(userId);

            if (!user || !targetMember) {
                return interaction.reply({
                    content: "Could not find a member with the provided User ID.",
                    ephemeral: true,
                });
            }

            const botMember = interaction.guild.members.cache.get(client.user.id);
            if (!botMember.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
                return interaction.reply({
                    content: "I do not have permission to manage nicknames.",
                    ephemeral: true,
                });
            }

            const randomString = Math.random().toString(36).substring(2, 8);
            const moderatedNickname = `Moderated #${randomString}`;

            await targetMember.setNickname(moderatedNickname, reason);

            const embed = new EmbedBuilder()
                .setTitle("Success")
                .setColor("#4ea554")
                .setDescription(
                    `Successfully moderated the username of **${user.tag}**.\n\n**New Nickname:** \`${moderatedNickname}\`\n**Reason:** ${reason}`
                )
                .setTimestamp()
                .setFooter({
                    text: `Action performed by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error moderating nickname:", error);
            await interaction.reply({
                content: "An error occurred while moderating the nickname.",
                ephemeral: true,
            });
        }
    },

    name: "moderate-nickname",
    description: "Moderates a person's username using their User ID.",
    options: [
        {
            name: "userid",
            description: "The User ID of the person whose username you want to moderate.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "reason",
            description: "The reason for moderating the username.",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
};
