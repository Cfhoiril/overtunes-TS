import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
// @ts-expect-error
import { toColonNotation } from "colon-notation";
// @ts-expect-error
import { progress } from "oxy-progress-bar1";

@ApplyOptions<CommandOptions>({
    name: "nowplaying",
    aliases: ["nowplay", "np"],
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const player = this.container.client.audioQueue.get(msg.guild?.id);

        var total = player.current.info.length;
        var current = player?.player.position;
        var slider = '🟠', bar = '▬', size = 20;

        let now = new MessageEmbed()
            .setTitle('Current song')
            .setDescription(`${player.current.info.title} [${player.current.info.requester}]`)
            .setColor(msg.guild?.me?.displayHexColor!)
            .setFooter(`${toColonNotation(player?.player.position ?? 1000)} ${progress(bar, current, total, slider, size)[0]} ${player.current.info.isStream ? 'LIVE' : toColonNotation(player.current.info.length ?? 1000)}`)
        return msg.channel.send({ embeds: [now] });
    }
}