import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Track, Player, Node } from "erela.js";
import { Client } from "discord.js";
import chalk from "chalk";
import { TextBasedChannelTypes } from "@sapphire/discord.js-utilities";

@ApplyOptions<ListenerOptions>({
    name: "nodeDisconnect",
    emitter: "manager" as keyof Client,
    event: "nodeDisconnect"
})

export class nodeConnectEvent extends Listener {
    async run(node: Node) {
        for (const players of [...this.container.client.manager.players.filter(x => x.node === node).values()]) {
            if (players.state == "DESTROYING") return players.destroy();
            const channel = this.container.client.channels?.cache?.get(players?.textChannel!) as TextBasedChannelTypes
            if (players.get("Message")) channel?.messages?.fetch(players.get("Message")).then((x: any) => x.delete()).catch((e: any) => { });

            const newNode = this.container.client.manager.nodes.get(this.container.client?.manager?.leastLoadNodes.first()?.options.identifier as string);

            const playOptions = {
                op: "play",
                guildId: players.guild,
                track: players.queue.current?.track,
                startTime: players.position,
                volume: players.volume,
            };

            await newNode?.send(players.voiceState);
            await newNode?.send(playOptions);
            // @ts-ignore
            players.node = newNode;
            console.log(chalk.yellow(`🏹 ${this.container.client.guilds?.cache?.get(players.guild)?.name}'s player moved to ${newNode?.options.identifier}`))
        }
    }
}
