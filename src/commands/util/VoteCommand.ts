import { CommandOptions, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "vote",
})

export class PingCommand extends Command {
    async messageRun(msg: Message) {
        let button = new MessageButton()
            .setStyle('LINK')
            .setLabel('Vote')
            .setURL('https://top.gg/bot/873101608467185684/vote/')

        const ab = new MessageActionRow()
            .addComponents(button)

        await msg.channel.send({ content: `Click here to vote our bot, with this link you can unlock all features in all Overtunes`, components: [ab] });
    }
}