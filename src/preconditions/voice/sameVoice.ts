import { PreconditionOptions, Precondition } from "@sapphire/framework";
import { Message } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";

@ApplyOptions<PreconditionOptions>({
    name: "sameVoice"
})

export abstract class sameVoice extends Precondition {
    public async run(msg: Message) {
        const checkIsAllow = this.shouldRun(msg);
        if (!checkIsAllow) return this.error({ message: "You must be in the same channel as Me" });
        return this.ok();
    }

    private shouldRun(msg: Message) {
        if (msg.guild?.me?.voice.channelId) return false;
        if (this.container.client.manager.get(msg.guildId!) && msg.member?.voice.channelId === msg.guild?.me?.voice.channelId) return false;
        return true;
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        sameVoice: never;
    }
}