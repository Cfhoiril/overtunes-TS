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
        console.log(chalk.green(`🎧 ${node.options.identifier} Connected`))
    }
}
