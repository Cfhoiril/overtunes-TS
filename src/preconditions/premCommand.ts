import { ApplyOptions } from "@sapphire/decorators";
import { Precondition, PreconditionOptions } from "@sapphire/framework";
import { Message } from "discord.js";
import * as config from "../config/config.json";
import { Api } from "@top-gg/sdk";

@ApplyOptions<PreconditionOptions>({
    name: "premCommand"
})

export class premCommand extends Precondition {
    public async run(msg: Message) {
        const checkIsAllow = await this.shouldRun(msg);
        if (!checkIsAllow) return this.error({ message: "This command need you to vote before using this command, [Click here to vote](https://top.gg/bot/873101608467185684/vote/)" });
        return this.ok();
    }

    private async shouldRun(msg: Message) {
        const api = new Api(config.topgg);
        let vote = await api.hasVoted(msg.author.id)

        if (config.helper.includes(msg.author.id) || vote || config.developer.includes(msg.author.id)) {
            return true;
        } else {
            return false;
        }
    }
}

declare module "@sapphire/framework" {
    export interface Preconditions {
        premCommand: never;
    }
}