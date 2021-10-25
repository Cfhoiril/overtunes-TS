import { PreconditionOptions, Precondition } from "@sapphire/framework";
import { Message } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";
import { isStageChannel, isVoiceChannel } from "@sapphire/discord.js-utilities";

@ApplyOptions<PreconditionOptions>({
    name: "havePlayer"
})


export abstract class havePlayer extends Precondition {
    public async run(msg: Message) {
        const checkIsAllow = this.shouldRun(msg);
        if (!checkIsAllow) return this.error({ message: "No **player** in this guild" });
        return this.ok();
    }

    private shouldRun(msg: Message) {
        if (!this.container.client.manager.get(msg.guild?.id!)) return false;
        return true;
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        havePlayer: never;
    }
}