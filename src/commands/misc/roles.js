const {
    Client,
    Interaction,
    EmbedBuilder,
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

            const roles = guild.roles.cache
                .sort((a, b) => b.position - a.position)
                .filter((role) => role.name !== "@everyone")
                .map((role) => `${role}`)
                .join("\n");

            if (!roles) {
                return await interaction.editReply("This server has no roles.");
            }

            const embed = new EmbedBuilder()
                .setColor("#4ea554")
                .setTitle(`Roles List`)
                .setDescription(roles)
                .setFooter({
                    text: `Requested by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("Error fetching roles:", error);
            await interaction.editReply("An error occurred while trying to fetch the roles.");
        }
    },

    name: "roles",
    description: "Displays a list of all roles in the server.",
};
