import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import { Message, MessageEmbed } from "discord.js";
import { Client } from "discord.js";
import { ShoukakuPlayer } from "shoukaku";

@ApplyOptions<ListenerOptions>({
    name: "playerException",
    emitter: "audioManager" as keyof Client,
    event: "playerException"
})

export class playerException extends Listener {
    async run(shoukakuPlayer: ShoukakuPlayer) {
        const player = this.container.client.audioQueue.get(shoukakuPlayer.connection.guildId);

        player.message.delete().catch(() => { });

        player.text.send({
            embeds: [new MessageEmbed()
                .setColor("RED")
                .setDescription("Track is error, Skipping to next tracks")]
        }).then((ms: Message) => setTimeout(function () { ms.delete() }, 10000))
    }
}
