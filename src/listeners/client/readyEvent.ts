import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import chalk from "chalk";
import * as config from "../../config.json";
import mongoose, { connect } from "mongoose";
import { Node, Player } from "erela.js";
import stay from "../../database/Manager/MusicManager";
import { TextBasedChannelTypes, VoiceBasedChannelTypes } from "@sapphire/discord.js-utilities";
// @ts-ignore
import express from "express";

@ApplyOptions<ListenerOptions>({
    name: "ready",
})

export class readyEvent extends Listener {
    async run() {
        this.container.client.user?.setActivity({
            name: `${config.prefix}play`,
            type: "LISTENING"
        })

        await mongoose.connect(config.mongo).then(() => {
            console.log(chalk.green('🍃 MongoDB connected'));
        }).catch((err) => {
            console.log('❌ MongoDB error - ' + err);
            return process.exit(1)
        });

        process.on('unhandledRejection', error => { });
        process.on('uncaughtException', error => { }); //well this made for client not crashing when error 

        this.container.client.manager.init(this.container.client.user!.id);
        this.container.logger.info(chalk.green(`👋 Logged in as ${chalk.white(this.container.client.user?.username)}`));

        // Player move handler, since event itself not working
        this.container.client.manager.on("playerMove", async (player: Player, oldChannel: string, newChannel: string) => {
            if (!newChannel) {
                const prem = await stay.findOne({ Guild: player.guild })
                if (prem.Stay === true) {
                    if (!player.get("pause")) {
                        player.pause(true);
                        player.connect();
                        player.pause(false);
                        setTimeout(() => {
                            if (this.container.client.guilds?.cache?.get(player.guild)?.me?.voice?.channel === null) return player.destroy();
                        }, 5000);
                        return;
                    } else if (player.get("pause") === true) {
                        player.connect()
                        setTimeout(() => {
                            if (this.container.client.guilds?.cache?.get(player.guild)?.me?.voice?.channel === null) return player.destroy();
                        }, 5000);
                        return;
                    } else if (player.get("pause") === false) {
                        player.pause(true);
                        player.connect();
                        player.pause(false);
                        setTimeout(() => {
                            if (this.container.client.guilds?.cache?.get(player.guild)?.me?.voice?.channel === null) return player.destroy();
                        }, 5000);
                        return;
                    }
                }
                return player.destroy();
            } else if (newChannel && oldChannel) {
                player.voiceChannel = newChannel;

                if (player.paused) return;
                setTimeout(() => {
                    player.pause(true);
                    setTimeout(() => player.pause(false), this.container.client.ws.ping * 2);
                }, this.container.client.ws.ping * 2);
            }
        })
    }
}

