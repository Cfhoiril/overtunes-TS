import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { MessageEmbed, VoiceState } from "discord.js";
import { TextBasedChannelTypes, VoiceBasedChannelTypes } from "@sapphire/discord.js-utilities";
import channel from "../../database/Manager/MusicManager";

@ApplyOptions<ListenerOptions>({
    name: "voiceStateUpdate"
})

export class rawEvent extends Listener {
    async run(oldState: VoiceState, newState: VoiceState) {
        const player = this.container.client.audioQueue.get(oldState.guild.id);

        // if there is no player, return
        if (!player) return;

        // check if player is  moved or not and the id is same with this client
        if (newState.id === this.container.client.user?.id) {
            // channel id will always null if player leave voice channel
            if (newState.channelId === null) {
                return player.destroy()
            }
        }

        const voiceChannel = this.container.client.channels?.cache?.get(player.player.connection.voideId) as VoiceBasedChannelTypes

        const prem = await channel.findOne({ Guild: oldState.guild.id });

        if (prem.Stay) return;

        if (oldState && oldState.channel && !voiceChannel?.members?.filter(m => !m.user.bot).size && player.voiceChannel === oldState.channelId) {
            if (player.timeout) clearTimeout(player.timeout);
            player.timeout = setTimeout(() => {
                const channel = this.container.client.channels.cache.get(player.textChannel!) as TextBasedChannelTypes;
                channel.send({
                    embeds: [new MessageEmbed()
                        .setDescription('I left the voice channel because I was inactive for too long.If you are satisfied with our service, please vote for us by [clicking here](https://top.gg/bot/873101608467185684/vote/)')
                        .setColor(this.container.client.guilds.cache.get(player.guild)?.me?.displayHexColor!)
                    ]
                })
                clearTimeout(player.timeout);
                player.destroy()
            }, 600000)
        }
    }
}
