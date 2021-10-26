import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { VoicePacket } from "erela.js";

@ApplyOptions<ListenerOptions>({
    name: "raw"
})

export class rawEvent extends Listener {
    async run(d: VoicePacket) {
        this.container.client.manager.updateVoiceState(d)
    }
}
