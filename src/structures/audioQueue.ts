import { Guild, Client, TextChannel, GuildMember, Channel } from "discord.js";
import { ShoukakuQueue, ShoukakuSocket, ShoukakuTrack } from "shoukaku";
import QueueManager from "./audioManager";

class AudioQueue extends Map {

    client: Client;

    constructor(client: Client) {
        super()
        this.client = client
    }

    async handle(guild: Guild, member: GuildMember, channel: Channel, node: ShoukakuSocket, track: ShoukakuTrack) {
        const queue = this.get(guild.id);

        if (!queue) {
            const player = await node.joinChannel({
                guildId: guild.id,
                shardId: guild.shardId,
                channelId: channel.id,
                deaf: false
            });

            const dispatcher = new QueueManager({
                client: this.client,
                guild: guild,
                text: channel,
                player: player
            });

            dispatcher.queue.push(track);
            this.set(guild.id, dispatcher);
            return dispatcher;
        }

        queue.queue.push(track);
        if (!queue.current) await queue.play();
        return null
    }
}

export default AudioQueue;