import { CommandOptions, Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import prefix from "../../database/Manager/GuildManager";
import * as config from "../../config.json";

@ApplyOptions<CommandOptions>({
    name: "help",
    aliases: ["h", "?"],
    cooldownDelay: 5000,
    cooldownLimit: 3
})

export class HelpCommand extends Command {
    async messageRun(msg: Message) {
        let data = await prefix.findOne({ id: msg.guild?.id! });

        let embed = new MessageEmbed()
            .setAuthor(this.container.client.user?.username as string + ' Help menu', this.container.client.user?.displayAvatarURL(), "https://discord.com/oauth2/authorize?client_id=873101608467185684&scope=bot&permissions=4332047432&scope=applications.commands%20bot")
            .setColor(msg.guild?.me?.displayHexColor!)
            .setFooter(`Click button bellow to get more info`)

        const categories = [...new Set(this.container.stores.get("commands").filter(f => f.category !== "developer").map(x => x.fullCategory[x.fullCategory.length - 1]))];

        for (const category of categories) {
            const commands = this.container.stores.get("commands").filter(x => x.fullCategory[x.fullCategory.length - 1] === category);
            embed.fields.push({
                name: `${category.toUpperCase()}`,
                value: commands.map(x => `\`${data.prefix ?? config.prefix}${x.name}\``).join(", "),
                inline: false
            });
        }

        return msg.channel.send({
            embeds: [embed],
            components: [new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('Commands')
                        .setURL('https://overtunes.me/commands')
                )
            ]
        })

    }
}