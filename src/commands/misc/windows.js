const { Client, Interaction, EmbedBuilder } = require("discord.js");
// For Node.js < 18, uncomment the following line:
// const fetch = require("node-fetch");

module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();

            const response = await fetch("https://weao.xyz/api/versions/current");
            const obj = await response.json();
                
            const embed = new EmbedBuilder()
            .setDescription("# Windows Information")
            .setColor("#4ea554")
            .setTimestamp()
            .addFields(
                {
                    name: "Windows Version Hash:",
                    value: obj["Windows"],
                },
                {
                    name: "Date/Time Released:",
                    value: obj["WindowsDate"],
                }
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("Error fetching data:", error);
            await interaction.editReply("An error occurred while fetching the data.");
        }
    },
    name: "windows",
    description: "Get the list of Roblox Windows Versions.",
};
