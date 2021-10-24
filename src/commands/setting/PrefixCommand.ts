import { CommandOptions, Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import prefix from "../../database/Manager/GuildManager";
import * as config from "../../config.json";

@ApplyOptions<CommandOptions>({
    name: "prefix",
    aliases: ["setprefix", "set-prefix"],
    cooldownDelay: 10000,
    cooldownLimit: 3,
    requiredUserPermissions: ["MANAGE_GUILD"]
})

export class PrefixCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");
        let guildPrefix = await prefix.findOne({ id: msg.guild?.id! })

        if (!argument.success) return msg.channel.send(`My prefix for this guild is **${guildPrefix.prefix ?? config.prefix}**`);

        if (argument.value.length > 5) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription(`Prefix shouldn't be longer than 5 characters. Yours has ${argument.value.length}`)
                .setColor("RED")
            ]
        })

        guildPrefix.prefix = argument.value;
        await guildPrefix.save()

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription(`My prefix has changed to **${argument.value}**`)
                .setColor(msg.guild?.me?.displayHexColor!)
            ]
        });
    }
}