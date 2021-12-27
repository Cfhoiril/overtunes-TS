import { Shoukaku, Libraries } from "shoukaku";
import chalk from "chalk";
import privateLavalink from "../config/lavalink";
import publicLavalink from "../config/lavalink2";
import { Client } from "discord.js";

class ShoukakuHandler extends Shoukaku {
    constructor(client: Client) {
        super(new Libraries.DiscordJS(client), privateLavalink, {
            moveOnDisconnect: true,
            reconnectInterval: 5000,
            reconnectTries: 9999999999,
            resumable: true,
            resumableTimeout: 60000
        })

        this.on('ready', (name, resumed) =>
            console.log(`LAVALINK => [STATUS] ${name} successfully connected.`, ` This connection is ${resumed ? 'resumed' : 'a new connection'}`)
        );

        this.on('error', (name, error) =>
            client.logger.error(chalk.red(`LAVALINK => ${name}: Error Caught.`, error))
        );

        this.on('close', (name, code, reason) =>
            console.log(chalk.redBright(`LAVALINK => ${name}: Closed, Code ${code}`, `Reason ${reason || 'No reason'}.`))
        );

        this.on('disconnect', (name, players, moved) =>
            console.log(chalk.yellowBright(`LAVALINK => ${name}: Disconnected`, moved ? 'players have been moved' : 'players have been disconnected'))
        );

        this.on('debug', (name, reason) =>
            console.log(chalk.yellowBright`LAVALINK => ${name}`, reason || 'No reason')
        );
    }
}

export default ShoukakuHandler;