import { CommandOptions, Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import music from "../../database/Manager/MusicManager";

@ApplyOptions<CommandOptions>({
    name: "defaultvolume",
    requiredUserPermissions: ["MANAGE_GUILD"],
    cooldownDelay: 60000,
    cooldownLimit: 2,
    preconditions: ["premCommand"]
})

export class AnnounceCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");
        if (!argument.success) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription("You need to input dafault volume")
                .setColor("RED")
            ]
        })

        const volume = Number(argument.value);
        const data = await music.findOne({ Guild: msg.guildId });

        if (!data) {
            new music({
                Guild: msg.guild?.id,
                Volume: volume
            }).save();

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Default volume changed to **${volume}**`)
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
        } else {
            data.Volume = volume
            data.save();

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Default volume changed to **${volume}**`)
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
        }
    }
}