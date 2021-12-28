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

        this.player
            .on('start', () => {
                const embed = new MessageEmbed()
                    .setTitle('Now Playing')
                    // @ts-ignore
                    .setDescription(`${this.current?.info.title} [${this.current?.info.requester}]`);
                this.text.send({ embeds: [embed] });
            })
            .on('end', () => {
                this.previous = this.current;
                this.current = null;
                // @ts-ignore
                if (this.repeat === 1) this.queue.unshift(this.previous);
                // @ts-ignore
                else if (this.repeat === 2) this.queue.push(this.previous);
                this.play();
            })
            .on('exception', (exception) => {
                this.text.send({ embeds: [new MessageEmbed().setAuthor('Something went wrong with playing the Track').setDescription(`track - [${this.current?.info.title}](${this.current?.info.uri})\nerror - ${exception.error}`)] });
                console.log(exception)
            })
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

    destroy() {
        this.stop();
        this.player.connection.disconnect();
        // @ts-ignore
        this.client.audioQueue.delete(this.guild.id);
        if (this.end) return;
        this.text.send({ embeds: [new MessageEmbed().setDescription('Destroyed the player and left the voice channel').setColor('GREEN')] }).catch(() => null);
    }

}

export default QueueManager;