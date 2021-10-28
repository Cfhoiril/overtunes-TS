import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import chalk from "chalk";
import * as config from "../../config.json";
import mongoose, { connect } from "mongoose";

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
        process.on('uncaughtException', error => { }); //well this made for bot not crashing when error 

        this.container.client.manager.init(this.container.client.user!.id);
        this.container.logger.info(chalk.green(`👋 Logged in as ${chalk.white(this.container.client.user?.username)}`));
    }
}

