const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    EmbedBuilder,
  } = require("discord.js");
  const ms = require("ms");
  
  module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
  
    callback: async (client, interaction) => {
      const mentionable = interaction.options.get("target-user").value;
      const reason = interaction.options.get("reason")?.value || "No reason provided";
  
      await interaction.deferReply();
  
      const { default: prettyMs } = await import("pretty-ms");
  
      const targetUser = await interaction.guild.members.fetch(mentionable);
  
      const embed = new EmbedBuilder()
        .setTitle("Success")
        .setColor("#4ea554")
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .addFields(
          {
            name: "User UnTimed-Out:",
            value: `${targetUser} (${targetUser.id})`,
            inline: true,
          },
          {
            name: "Moderator:",
            value: `${interaction.user} (${interaction.user.id})`,
            inline: true,
          },
          {
            name: "Reason:",
            value: `\`${reason}\``,
            inline: true,
          }
        );
      
      if (!targetUser) {
        await interaction.editReply("That user doesn't exist in this server.");
        return;
      }
  
      if (targetUser.user.bot) {
        await interaction.editReply("I can't timeout/untimeout a bot.");
        return;
      }
  
      const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
      const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
      const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot
  
      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply(
          "You can't untimeout that user because they have the same/higher role than you."
        );
        return;
      }
  
      if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply(
          "I can't untimeout that user because they have the same/higher role than me."
        );
        return;
      }
  
      // UnTimeout the user
      try {
  
        if (targetUser.isCommunicationDisabled()) {
          await targetUser.timeout(null, reason);
          await interaction.editReply({ embeds: [embed] });
          return;
        }
  
        await targetUser.timeout(null, reason);
        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.log(`There was an error when timing out: ${error}`);
      }
    },
  
    name: "untimeout",
    description: "UnTimeout a user.",
    options: [
      {
        name: "target-user",
        description: "The user you want to untimeout.",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: "reason",
        description: "The reason for the untimeout.",
        type: ApplicationCommandOptionType.String,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.MuteMembers],
};
