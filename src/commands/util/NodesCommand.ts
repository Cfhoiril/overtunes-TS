import { ApplyOptions } from "@sapphire/decorators";
import { Command, CommandOptions } from "@sapphire/framework";
import { Message } from "discord.js";
import prettyBytes from "pretty-bytes";
import prettyMs from "pretty-ms";

@ApplyOptions<CommandOptions>({
    name: "nodes",
    aliases: ["node"]
})

export class NodesCommand extends Command {
    async messageRun(msg: Message) {
        const player = this.container.client.manager.get(msg.guild?.id!);
        let players = this.container.client.manager.players.size;
        let k: string[] = [];
        let color;

        this.container.client.manager.nodes.map((x) => {
            if (player && player.node.options.identifier == x.options.identifier)
                color = ">";
            else if (!x.connected)
                color = "-";
            else
                color = "+";

            let mana = `\`\`\`diff\n
${color} ID        : ${x.options.identifier}
${color} State     : ${x.connected ? "Connected" : "Disconnected"}
${color} Players   : ${x.stats.playingPlayers}/${x.stats.players} [${players}]
${color} Memory    : ${prettyBytes(x.stats.memory.used)}/${prettyBytes(x.stats.memory.reservable)}
${color} Core      : ${x.stats.cpu.cores}
${color} Uptime    : ${prettyMs(x.stats.uptime, { colonNotation: true, compact: true })}\`\`\``

            k.push(mana);

        }).join("\n");

        msg.channel.send(`\`🔴 Down | \🟢 Up | \⚪\ Current\`\n${k.join("\n")}`);
    }
}