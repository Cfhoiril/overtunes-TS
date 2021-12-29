import { Guild, Client, TextChannel, MessageEmbed } from "discord.js";
import { ShoukakuQueue, ShoukakuPlayer, ShoukakuTrack } from "shoukaku";

class QueueManager {

    client: Client;
    guild: Guild;
    text: TextChannel;
    player: ShoukakuPlayer;
    queue: Array<ShoukakuTrack>;
    current: ShoukakuTrack | null;
    previous: ShoukakuTrack | null;
    repeat: number;
    end: boolean

    constructor(options: any) {
        this.client = options.client;
        this.guild = options.guild;
        this.player = options.player;
        this.text = options.text;
        this.queue = [];
        this.end = false;
        this.repeat = 0;
        this.current = null;
        this.previous = null;
    }

    async play() {
        // @ts-ignore
        this.current = this.queue?.shift();
        this.player.playTrack(this.current?.track!);
    }

    async pause() {
        if (!this.player) return;
        if (!this.player.paused) await this.player.setPaused(true);
    }

    async resume() {
        if (!this.player) return;
        if (this.player.paused) await this.player.setPaused(false);
    }

    async skip(skipto = 1) {
        if (!this.player) return;
        if (skipto > 1) {
            this.queue.unshift(this.queue[skipto - 1]);
            this.queue.splice(skipto, 1);
        }
        await this.player.stopTrack();
    }

    async stop() {
        if (!this.player) return;
        this.queue.length = 0;
        this.repeat = 0;
        await this.player.stopTrack();
    }

    shuffle() {
        for (let i = this.queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
        }
    }

    destroy() {
        this.stop();
        this.player.connection.disconnect();
        // @ts-ignore
        this.client.audioQueue.delete(this.guild.id);
        if (this.end) return;
    }

}

export default QueueManager;