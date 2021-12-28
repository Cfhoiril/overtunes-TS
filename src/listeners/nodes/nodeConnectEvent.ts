import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Client } from "discord.js";
import chalk from "chalk";

@ApplyOptions<ListenerOptions>({
    name: "nodeConnect",
    emitter: "musicManager" as keyof Client,
    event: "ready"
})

export class nodeConnectEvent extends Listener {
    async run(name: string, resumed: boolean) {
        console.log(chalk.green(`🎧 ${name} Connected ${chalk.white(`Connection was ${chalk.green(resumed ? 'Resumed' : 'New')}`)}`))
    }
}
