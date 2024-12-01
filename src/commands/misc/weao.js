const { Client, Interaction, EmbedBuilder } = require("discord.js");

module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();

            const fetchExploitStatus = async (url) => {
                const response = await fetch(url);
                const data = await response.json();
                data.updateStatus = data.updateStatus ? `[\`🟩\`]` : `[\`🟥\`]`;
                return data;
            };

            const robloxResponse = await fetch("https://weao.xyz/api/versions/current");
            const robloxObj = await robloxResponse.json();

            const exploits = [
                { name: "Nihon", url: "https://weao.xyz/api/status/exploits/nihon" },
                { name: "Synapse Z", url: "https://weao.xyz/api/status/exploits/synapse%20z" },
                { name: "Wave", url: "https://weao.xyz/api/status/exploits/wave" },
                { name: "Solara", url: "https://weao.xyz/api/status/exploits/solara" },
                { name: "Seliware", url: "https://weao.xyz/api/status/exploits/seliware" },
                { name: "Rebel", url: "https://weao.xyz/api/status/exploits/rebel" },
            ];

            const exploitData = await Promise.all(
                exploits.map(async (exploit) => ({
                    name: exploit.name,
                    ...await fetchExploitStatus(exploit.url),
                }))
            );

            const exploitDescriptions = exploitData.map(
                (exploit) =>
                    `${exploit.updateStatus} **${exploit.name}** | [\`${exploit.version}\`] | [\`${exploit.updatedDate}\`]`
            ).join("\n");

            const embed = new EmbedBuilder()
                .setTitle("[Current Statuses]")
                .setDescription(`
                    [**Windows Hash**]: __${robloxObj.Windows}__ | [\`${robloxObj.WindowsDate}\`]
                    [**Mac Hash**]: __${robloxObj.Mac}__ | [\`${robloxObj.MacDate}\`]
                    
                    ${exploitDescriptions}
                `)
                .setColor("#4ea554")
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("Error fetching data:", error);
            await interaction.editReply("An error occurred while fetching the data.");
        }
    },
    name: "weao",
    description: "Get the list of Roblox Windows Exploits.",
};
