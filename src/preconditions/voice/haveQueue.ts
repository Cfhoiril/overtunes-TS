import { PreconditionOptions, Precondition } from "@sapphire/framework";
import { Message } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";
import { isStageChannel, isVoiceChannel } from "@sapphire/discord.js-utilities";

@ApplyOptions<PreconditionOptions>({
    name: "haveQueue"
})


export abstract class haveQueue extends Precondition {
    public async run(msg: Message) {
        const checkIsAllow = this.shouldRun(msg);
        if (!checkIsAllow) return this.error({ message: "There is no music playing" });
        return this.ok();
    }

    private shouldRun(msg: Message) {
        if (!this.container.client.manager.get(msg.guild?.id!)?.queue.current) return false;
        return true;
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        haveQueue: never;
    }
}