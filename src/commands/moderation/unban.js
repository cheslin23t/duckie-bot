const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionFlagsBits,
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

            if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                return await interaction.editReply("You don't have permission to unban members.");
            }

            const userId = interaction.options.getString("userid");

            if (!userId) {
                return await interaction.editReply("Please provide a valid user ID.");
            }

            const bannedUsers = await interaction.guild.bans.fetch();

            const userBanInfo = bannedUsers.get(userId);

            if (!userBanInfo) {
                return await interaction.editReply("This user is not banned.");
            }

            await interaction.guild.members.unban(userId);

            const user = await client.users.fetch(userId);

            const embed = new EmbedBuilder()
                .setColor("#4ea554")
                .setTitle("Success")
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .addFields(
                    {
                        name: "User Unbanned:",
                        value: `<@${user.id}> (${user.id})`,
                        inline: true,
                    },
                    {
                        name: "Moderator:",
                        value: `${interaction.user} (${interaction.user.id})`,
                        inline: true,
                    },
                );

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("Error unbanning user:", error);
            await interaction.editReply("An error occurred while trying to unban the user.");
        }
    },

    name: "unban",
    description: "Unban a member from the server.",
    options: [
        {
            name: "userid",
            description: "The ID of the user to unban.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
};
