import { ApplyOptions } from "@sapphire/decorators";
import { Precondition, PreconditionOptions } from "@sapphire/framework";
import { Message } from "discord.js";
import * as config from "../config/config.json";

@ApplyOptions<PreconditionOptions>({
    name: "ownerOnly"
})

export class ownerOnly extends Precondition {
    run(message: Message) {
        return config.developer.includes(message.author.id) ? this.ok() : this.error({ message: "Only my developer can use this" });
    }
}

declare module "@sapphire/framework" {
    export interface Preconditions {
        ownerOnly: never;
    }
}