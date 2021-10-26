import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Track, Player, Node } from "erela.js";
import { Client } from "discord.js";
import stay from "../../database/Manager/MusicManager";
import chalk from "chalk";

@ApplyOptions<ListenerOptions>({
    name: "nodeCreate",
    emitter: "manager" as keyof Client,
    event: "nodeCreate"
})

export class nodeCreateEvent extends Listener {
    async run(node: Node) {
        console.log(chalk.yellow(`➕ ${node.options.identifier} Created`))
    }
}
