import { Guild, Message, Client, TextChannel, GuildMember, Channel } from "discord.js";
import { ShoukakuQueue, ShoukakuSocket, ShoukakuTrack } from "shoukaku";
import QueueManager from "./audioManager";

class AudioQueue extends Map {

    client: Client;

    constructor(client: Client) {
        super()
        this.client = client
    }

    async handle(message: Message, node: ShoukakuSocket, track: ShoukakuTrack) {
        const queue = this.get(message.guild?.id);

        if (!queue) {
            const player = await node.joinChannel({
                guildId: message.guild?.id as string,
                shardId: message.guild?.shardId as number,
                channelId: message.channel.id,
                deaf: false
            });

            const dispatcher = new QueueManager({
                client: this.client,
                guild: message.guild,
                text: message.channel,
                player: player
            });

            dispatcher.queue.push(track);
            this.set(message.guild?.id, dispatcher);
            return dispatcher;
        }

        queue.queue.push(track);
        if (!queue.current) await queue.play();
        return null
    }
}

export default AudioQueue;