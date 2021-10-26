import { PreconditionOptions, Precondition } from "@sapphire/framework";
import { Message } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";
import setting from "../../database/Manager/MusicManager";

@ApplyOptions<PreconditionOptions>({
    name: "isSpecialChannel"
})

export abstract class isSpecialChannel extends Precondition {

    public async run(msg: Message) {
        const notAllow = await this.shouldRun(msg);
        if (notAllow) return this.error({ message: `${notAllow}` });
        return this.ok();
    }

    private async shouldRun(msg: Message) {
        const only = await setting.findOne({ Guild: msg.guild?.id! });
        if (only.Channel !== null) {
            await msg.guild?.channels.fetch(only.Channel).catch(e => {
                only.Channel = null
                only.Message = null
                only.save();

                return "Special text channel not found, back to normal mode";
            })

            if (msg.channel.id !== only.Channel) {
                return `This Commands only can used at <#${only.Channel}>`;
            }
        } else {
            return false;
        }
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        isSpecialChannel: never;
    }
}