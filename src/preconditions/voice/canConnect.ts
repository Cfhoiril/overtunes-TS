import { PreconditionOptions, Precondition } from "@sapphire/framework";
import { Message } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";
import { isStageChannel, isVoiceChannel } from "@sapphire/discord.js-utilities";
@ApplyOptions<PreconditionOptions>({
    name: "canConnect"
})


export abstract class canConnect extends Precondition {
    public async run(msg: Message) {
        const checkIsAllow = this.shouldRun(msg);
        if (!checkIsAllow) return this.error({ message: "" });
        return this.ok();
    }

    private shouldRun(msg: Message) {
        if (msg.guild?.me?.permissions.has("ADMINISTRATOR")) return true;
        if (msg.guild?.me?.voice.channel) return true;
        if (msg.member?.voice.channel?.full && !msg.member.voice.channel.permissionsFor(this.container.client.user!)?.has("MOVE_MEMBERS")) return false;
        if (isStageChannel(msg.member?.voice.channel) && !msg.guild?.me?.voice.channel && msg.member?.voice.channel?.joinable) return true;
        if (isVoiceChannel(msg.member?.voice.channel) && !msg.guild?.me?.voice.channel && msg.member?.voice.channel?.joinable && msg.member?.voice.channel?.speakable) return true;
        return false;
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        canConnect: never;
    }
}