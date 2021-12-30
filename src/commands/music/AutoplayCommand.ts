import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "autoplay",
    requiredClientPermissions: ["CONNECT", "SPEAK"],
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const player = this.container.client.audioQueue.get(msg.guild?.id);

        if (!player.autoplay) {
            player.autoplay = true;
            player.requester = msg.author;
            const title = player.current.info.title;

            const node = this.container.client.audioManager.getNode();
            const search = await node.rest.resolve(title, "youtube");
            const track = search.tracks[2];
            // @ts-ignore
            track.info.requester = msg.author;
            await this.container.client.audioQueue.handle(msg, node, track!);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Autoplay is now **Enabled**`)
                    .setColor(msg.guild?.me?.displayHexColor!)]
            });
        } else {
            player.autoplay = false;
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Autoplay is now **Disabled**`)
                    .setColor(msg.guild?.me?.displayHexColor!)]
            });
        }
    }
}