import { CommandOptions, Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import music from "../../database/Manager/MusicManager";

@ApplyOptions<CommandOptions>({
    name: "247",
    aliases: ['247', '24/7', 'twentyfourseven'],
    requiredUserPermissions: ["MANAGE_GUILD"],
    cooldownDelay: 10000,
    cooldownLimit: 2
})

class TwentyfoursevenCommand extends Command {
    async messageRun(msg: Message) {
        const data = await music.findOne({ Guild: msg.guildId });

        if (!data) {
            new music({
                Guild: msg.guild?.id,
                Stay: true
            }).save();

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('24/7 Mode Activated')
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
        } else if (data.Stay === false) {
            data.Stay = true
            data.save();

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('24/7 Mode Activated')
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
        } else if (data.Stay === true) {
            data.Stay = false
            data.save();

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('24/7 Mode Deactivated')
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
        }
    }
}