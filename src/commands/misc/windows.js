const { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply();

            const fetchWindowsHash = async (url) => {
                const response = await fetch(url);
                return await response.json();
            };

            const currentData = await fetchWindowsHash("https://weao.xyz/api/versions/current");
            const futureData = await fetchWindowsHash("https://weao.xyz/api/versions/future");

            const createEmbed = (data, type) => {
                return new EmbedBuilder()
                    .setTitle(`Windows ${type} Information`)
                    .setColor("#4ea554")
                    .setTimestamp()
                    .setFooter({
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                    .addFields(
                        {
                            name: `${type} Windows Version Hash:`,
                            value: `\`${data["Windows"]}\``,
                            inline: true,
                        },
                        {
                            name: "Date/Time Released:",
                            value: data["WindowsDate"],
                            inline: true,
                        }
                    );
            };

            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("current")
                    .setLabel("Current")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("future")
                    .setLabel("Future")
                    .setStyle(ButtonStyle.Success)
            );

            await interaction.editReply({
                embeds: [createEmbed(currentData, "Current")],
                components: [buttons],
            });

            const filter = (btnInteraction) => btnInteraction.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({
                filter,
                time: 60000,
            });

            collector.on("collect", async (btnInteraction) => {
                await btnInteraction.deferUpdate();

                if (btnInteraction.customId === "current") {
                    await interaction.editReply({
                        embeds: [createEmbed(currentData, "Current")],
                    });
                } else if (btnInteraction.customId === "future") {
                    await interaction.editReply({
                        embeds: [createEmbed(futureData, "Future")],
                    });
                }
            });

            collector.on("end", async () => {
                const disabledRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("current")
                        .setLabel("Current")
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId("future")
                        .setLabel("Future")
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(true)
                );

                await interaction.editReply({ components: [disabledRow] });
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            await interaction.editReply("An error occurred while fetching the data.");
        }
    },
    name: "windows",
    description: "Get the list of Roblox Windows Versions (Current and Future).",
};
