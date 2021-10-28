import { CommandOptions, Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import music from "../../database/Manager/MusicManager";

@ApplyOptions<CommandOptions>({
    name: "announce",
    requiredUserPermissions: ["MANAGE_GUILD"],
    cooldownDelay: 10000,
    cooldownLimit: 2
})

export class AnnounceCommand extends Command {
    async messageRun(msg: Message) {
        const data = await music.findOne({ Guild: msg.guildId });

        if (!data) {
            new music({
                Guild: msg.guild?.id,
                Announce: false
            }).save();

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('**Tracks Announcement** is now disabled')
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
        } else if (data.Announce === true) {
            data.Announce = false
            data.save();

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('**Tracks Announcement** is now disabled')
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
        } else if (data.Announce === false) {
            data.Announce = true
            data.save();

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('**Tracks Announcement** is now enabled')
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
        }
    }
}