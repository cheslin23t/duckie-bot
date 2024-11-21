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

            const serverName = interaction.guild.name;
            const memberCount = interaction.guild.memberCount;

            const embed = new EmbedBuilder()
                .setColor("#4ea554")
                .setTimestamp()
                .setDescription(`
                    ## Membercount
                    __${serverName}__ currently has **${memberCount}** members.
                `);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("Error fetching data:", error);
            await interaction.editReply("An error occurred while fetching the data.");
        }
    },

    name: "membercount",
    description: "Get the member count of a server.",
};
