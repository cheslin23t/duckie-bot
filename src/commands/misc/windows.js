const { Client, Interaction, EmbedBuilder } = require("discord.js");

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

            const response2 = await fetch("https://weao.xyz/api/versions/future");
            const obj2 = await response2.json();
                
            const embed = new EmbedBuilder()
            .setDescription("## Windows Information")
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
                },
                {
                    name: "Windows Version Hash (Future):",
                    value: obj2["Windows"],
                },
                {
                    name: "Date/Time Released (Future):",
                    value: obj2["WindowsDate"],
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
