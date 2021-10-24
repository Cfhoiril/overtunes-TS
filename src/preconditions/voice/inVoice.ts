import { PreconditionOptions, Precondition } from "@sapphire/framework";
import { Message } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";

@ApplyOptions<PreconditionOptions>({
    name: "inVoice"
})

export abstract class inVoice extends Precondition {
    public async run(msg: Message) {
        const allow = this.shouldRun(msg);
        if (!allow) return this.error({ message: "You are not in the **Voice Channel**" })
        return this.ok();
    }

    private shouldRun(msg: Message) {
        return Boolean(msg.member?.voice.channel?.id);
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        inVoice: never;
    }
}