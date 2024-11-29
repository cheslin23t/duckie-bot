const { Client, Interaction, EmbedBuilder } = require("discord.js");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();

      const totalSeconds = Math.floor(client.uptime / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const uptimeString = `${days} day(s), ${hours} hour(s), ${minutes} minute(s), and ${seconds} second(s)`;

      const embed = new EmbedBuilder()
        .setColor("#4ea554")
        .setTitle("Bot Uptime")
        .setDescription(`I have been running for: **${uptimeString}**`)
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching uptime:", error);
      await interaction.editReply("An error occurred while fetching the bot's uptime.");
    }
  },

  name: "uptime",
  description: "Get the bot's current uptime.",
};
