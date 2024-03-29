import { CommandOptions, Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import music from "../../database/Manager/MusicManager";

@ApplyOptions<CommandOptions>({
    name: "djonly",
    requiredUserPermissions: ["MANAGE_GUILD"],
    aliases: ["enabledj", "dj"],
    cooldownDelay: 10000,
    cooldownLimit: 2
})

export class AnnounceCommand extends Command {
    async messageRun(msg: Message) {
        const data = await music.findOne({ Guild: msg.guildId });

        if (!data) {
            new music({
                Guild: msg.guildId,
                Dj: true
            }).save();

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('DjOnly mode **Activated**, make sure you have role named **DJ** at your server')
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
        } else if (data.Dj === false) {
            data.Dj = true
            data.save();

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('DjOnly mode **Activated**, make sure you have role named **DJ** at your server')
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
        } else if (data.Dj === true) {
            data.Dj = false
            data.save();

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('DjOnly mode **Deactivated**')
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
        }
    }
}