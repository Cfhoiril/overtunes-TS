import { Shoukaku, Libraries } from "shoukaku";
import chalk from "chalk";
import privateLavalink from "../config/lavalink";
import publicLavalink from "../config/lavalink2";
import { Client } from "discord.js";
import { LavasfyClient } from "lavasfy";
import Overtunes from "./overtunes";

class ShoukakuHandler extends Shoukaku {
    spotify: LavasfyClient;

    public constructor(client: Overtunes) {
        super(new Libraries.DiscordJS(client), privateLavalink, {
            moveOnDisconnect: true,
            reconnectInterval: 5000,
            reconnectTries: 9999999999,
            resumable: true,
            resumableTimeout: 60000,
        });

        this.spotify = new LavasfyClient({
            clientID: "93f4dd8ea4d94be685594c36e735c",
            clientSecret: "314b997a5f8f49aba8aabd",
            audioOnlyResults: true,
            useSpotifyMetadata: true,
            // @ts-ignore
        }, [...client.audioManager.getNode()])
    }
}

export default ShoukakuHandler;