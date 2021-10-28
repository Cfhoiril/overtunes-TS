import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { VoiceChannel } from "discord.js";
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
            const time = setTimeout(async () => {
                if (oldState && oldState.channel && !voiceChannel?.members?.filter(m => !m.user.bot).size && player.voiceChannel === oldState.channelId) {
                    return player.destroy();
                } else {
                    clearTimeout(time)
                }
            }, 600000);
        }
    }
}
