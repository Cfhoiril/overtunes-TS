import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Client } from "discord.js";
import chalk from "chalk";
import { ShoukakuPlayer } from "shoukaku";

@ApplyOptions<ListenerOptions>({
    name: "nodeDisconnect",
    emitter: "audioManager" as keyof Client,
    event: "disconnect"
})

export class nodeConnectEvent extends Listener {
    async run(name: string, players: Array<ShoukakuPlayer>, moved: boolean) {
        console.log(chalk.yellow(`🏹 ${name} Disconnected, all players are ${moved ? 'Moved' : 'Destroyed'}`))
    }
}
