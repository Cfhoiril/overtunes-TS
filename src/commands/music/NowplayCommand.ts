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
    preconditions: ["havePlayer", "haveQueue"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const player = this.container.client.manager.get(msg.guildId!);

        var total = player?.queue?.current?.duration;
        var current = player?.position;
        var slider = '🟠', bar = '▬', size = 20;

        let now = new MessageEmbed()
            .setTitle('Current song')
            .setDescription(`${player?.queue?.current?.title} [${player?.queue?.current?.requester}]`)
            .setColor(msg.guild?.me?.displayHexColor!)
            .setFooter(`${toColonNotation(player?.position)} ${progress(bar, current, total, slider, size)[0]} ${player?.queue?.current?.isStream ? 'LIVE' : toColonNotation(player?.queue?.current?.duration ?? 0)}`)
        return msg.channel.send({ embeds: [now] });
    }
}