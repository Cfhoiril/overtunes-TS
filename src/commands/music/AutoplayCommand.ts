import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<CommandOptions>({
    name: "autoplay",
    requiredClientPermissions: ["CONNECT", "SPEAK"],
    preconditions: ["inVoice", "sameVoice", "havePlayer", "haveQueue"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const player = this.container.client.manager.get(msg.guildId!);

        const autoplay = player?.get("autoplay");
        if (autoplay === false) {
            player?.set("autoplay", true);
            player?.set("requester", msg.author);
            const search = player?.queue.current?.title!;
            let res = await player?.search(search, msg.author);
            player?.queue.add(res?.tracks[4]!);
            let thing = new MessageEmbed()
                .setDescription(`Autoplay is now **Enabled**`)
                .setColor(msg.guild?.me?.displayHexColor!)
            return msg.channel.send({ embeds: [thing] });

        } else {
            player?.set("autoplay", false);
            let thing = new MessageEmbed()
                .setDescription(`Autoplay is now **Disabled**`)
                .setColor(msg.guild?.me?.displayHexColor!)
            return msg.channel.send({ embeds: [thing] });
        }
    }
}