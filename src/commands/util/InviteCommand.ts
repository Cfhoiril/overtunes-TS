import { CommandOptions, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "invite",
})

export class PingCommand extends Command {
    async messageRun(msg: Message) {
        let button = new MessageButton()
            .setStyle('LINK')
            .setLabel('Invite')
            .setURL('https://discord.com/oauth2/authorize?client_id=873101608467185684&scope=bot&permissions=4332047432&scope=applications.commands%20bot')

        const ab = new MessageActionRow()
            .addComponents(button)

        await msg.channel.send({ content: `Click here to invite ${this.container.client.user?.username}`, components: [ab] });
    }
}