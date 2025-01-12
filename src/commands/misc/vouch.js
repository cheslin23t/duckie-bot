const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionFlagsBits,
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
} = require("discord.js");
const { testServer } = require("../../../config.json");
module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true });
            if (!interaction.guild.id == "1259660657427742750" && !interaction.guild.id == testServer) {
                return await interaction.followUp({ content: "This command cannot be ran here.", flags: { ephemeral: true } });
            }
            if (!interaction.member.roles.cache.has("1259664662199406723") && !interaction.member.roles.cache.has("1192227352739053629")) {
                return await interaction.followUp({ content: "You do not have the required role to run this command.", flags: { ephemeral: true } });
            }

            const ticketAuthor = interaction.options.getUser("user");
            const issue = interaction.options.getString("issue");
            const staff = interaction.options.getString("staff") || "N/A";
            
            
const embed = new EmbedBuilder()
.setColor("#4ea554")
.setTitle("[Awaiting Approval] Vouch")
.setThumbnail(ticketAuthor.displayAvatarURL({ dynamic: true }))
.setTimestamp()
.addFields(
    {
        name: "User",
        value: `<@${ticketAuthor.id}> (${ticketAuthor.id})`,
    },
    {
        name: "Issue:",
        value: `\`${issue}\``,
        inline: true,
    },
    {
        name: "Ticket:",
        value: `\`${interaction.channel.id}\``,
        inline: true,
    },
    {
        name: "Staff:",
        value: `\`${staff}\``,
    }
)
.setFooter({ text: "Command contributed by Cologne" });

// Create buttons for approve and deny
const row = new ActionRowBuilder().addComponents(
new ButtonBuilder()
    .setCustomId('approve')
    .setLabel('✅Approve')
    .setStyle(ButtonStyle.Success),  // Green button for approval
new ButtonBuilder()
    .setCustomId('deny')
    .setLabel('❌Deny')
    .setStyle(ButtonStyle.Danger)    // Red button for denial
);

// Send the message with the embed and buttons
await interaction.followUp({
embeds: [embed],
ephemeral: true,
components: [row]
});
        } catch (error) {
            console.error("Error banning user:", error);
            await interaction.followUp("An error occurred while trying to ban the user.");
        }
    },

    name: "vouch",
    description: "Vouch handler.",
    options: [
        {
            name: "user",
            description: "The user who created the ticket.",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "issue",
            description: "The issue that the user was having.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "staff",
            description: "Include other staff ids that assisted with the issue.",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
};
