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
    }
}

export default ShoukakuHandler;