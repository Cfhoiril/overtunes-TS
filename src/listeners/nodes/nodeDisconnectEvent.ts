import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Track, Player, Node } from "erela.js";
import { Client } from "discord.js";
import stay from "../../database/Manager/MusicManager";
import chalk from "chalk";

@ApplyOptions<ListenerOptions>({
    name: "nodeConnect",
    emitter: "manager" as keyof Client,
    event: "nodeConnect"
})

export class nodeConnectEvent extends Listener {
    async run(node: Node) {
        for (const players of [...bot.manager.players.filter(x => x.node === node).values()]) {
            const newNode = bot.manager.nodes.get(bot.manager.leastLoadNodes.first()?.options.identifier);

            const playOptions = {
                op: "play",
                guildId: players.guild,
                track: players.queue.current?.track,
                startTime: players.position,
                volume: players.volume,
            };
            await newNode.send(players.voiceState);
            await newNode.send(playOptions);
            players.node = newNode;
        }
    }
}
