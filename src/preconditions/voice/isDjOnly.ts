import { PreconditionOptions, Precondition } from "@sapphire/framework";
import { Message } from "discord.js";
import { ApplyOptions } from "@sapphire/decorators";
import setting from "../../database/Manager/MusicManager";

@ApplyOptions<PreconditionOptions>({
    name: "isDjOnly"
})

export abstract class isDjOnly extends Precondition {

    public async run(msg: Message) {
        const allow = this.shouldRun(msg);
        if (!allow) return this.error({ message: "You need Role named **DJ** or **MANAGE_CHANNELS** permissions to use this commands, Being **ALONE** with the bot also works" })
        return this.ok();
    }

    private async shouldRun(msg: Message) {
        const djOnly = await setting.findOne({ Guild: msg.guild?.id! });
        if (djOnly === true) {
            if (msg.member?.voice?.channel && !msg.member?.permissions.has('MANAGE_CHANNELS') && !msg.member.roles.cache.some(role => role.name === 'DJ')) {
                return false;
            }
        }
        return true;
    }

}

declare module "@sapphire/framework" {
    interface Preconditions {
        isDjOnly: never;
    }
}