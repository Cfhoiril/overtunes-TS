import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { VoiceChannel, MessageEmbed } from "discord.js";
import { TextBasedChannelTypes, VoiceBasedChannelTypes } from "@sapphire/discord.js-utilities";
import { VoicePacket } from "erela.js";
import channel from "../../database/Manager/MusicManager";

@ApplyOptions<ListenerOptions>({
    name: "voiceStateUpdate"
})

export class rawEvent extends Listener {
    async run(oldState: any, newState: any) {
        const player = await this.container.client.manager.get(oldState.guild.id);
        if (!player) return;
        const voiceChannel = this.container.client.channels?.cache?.get(player.voiceChannel!) as VoiceChannel

        const prem = await channel.findOne({ Guild: oldState.guild.id });
        if (prem.Stay === true) return;

        if (oldState && oldState.channel && !voiceChannel?.members?.filter(m => !m.user.bot).size && player.voiceChannel === oldState.channelId) {
            // @ts-expect-error
            player.timeout = setTimeout(() => {
                if (!player.queue.current) {
                    const channel = this.container.client.channels.cache.get(player.textChannel!) as TextBasedChannelTypes;
                    channel.send({
                        embeds: [new MessageEmbed()
                            .setDescription('I left the voice channel because I was inactive for too long.If you are satisfied with our service, please vote for us by [clicking here](https://top.gg/bot/873101608467185684/vote/)')
                            .setColor(this.container.client.guilds.cache.get(player.guild)?.me?.displayHexColor!)
                        ]
                    })
                    player.destroy()
                }
            }, 600000)
        }
    }
}
