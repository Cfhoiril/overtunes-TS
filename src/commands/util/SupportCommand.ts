import { CommandOptions, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "support",
})

export class PingCommand extends Command {
    async messageRun(msg: Message) {
        let support = new MessageButton()
            .setStyle('LINK')
            .setURL('https://discord.gg/hM8U8cHtwu')
            .setLabel('Support Server')

        const ab = new MessageActionRow()
            .addComponents(support)

        await msg.channel.send({ content: `Click here to join support server`, components: [ab] });
    }
}