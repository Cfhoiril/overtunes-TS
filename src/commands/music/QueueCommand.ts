import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js";
// @ts-expect-error
import { toColonNotation } from "colon-notation";

@ApplyOptions<CommandOptions>({
    name: "queue",
    aliases: ["q"],
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const player = this.container.client.audioQueue.get(msg.guild?.id);

        let first = new MessageButton()
            .setStyle('PRIMARY')
            .setCustomId('first')
            .setLabel('First')

        let back = new MessageButton()
            .setStyle('PRIMARY')
            .setCustomId('back')
            .setLabel('Back')

        let next = new MessageButton()
            .setStyle('PRIMARY')
            .setCustomId('next')
            .setLabel('Next')

        let last = new MessageButton()
            .setStyle('PRIMARY')
            .setCustomId('last')
            .setLabel('Last')

        let row = new MessageActionRow()
            .addComponents(first)
            .addComponents(back)
            .addComponents(next)
            .addComponents(last)

        let currentPage = 0;
        let emb;
        if (player) emb = generateQueueEmbed(player?.queue)[currentPage];


        const message = await msg.channel.send({
            content: `${(player?.current && player) ? `**Current Song:** ${player?.current.info.title} - ${player?.current.info.isStream ? "LIVE" : toColonNotation(player?.current.info.length)}` : ""}\`\`\`js\n${player ? `${player?.queue.length ? `${emb}` : "This queue is empty"}` : "This queue is empty"}\`\`\``, components: [row]
        });

        const collector = message.createMessageComponentCollector();
        collector.on('collect', async (i) => {
            await i.deferUpdate();
            var player = this.container.client.audioQueue.get(msg.guild?.id);
            // @ts-ignore
            if (!player || !player.current) {
                message.edit({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                return;
            }

            if (!player.queue.length) {
                // @ts-ignore
                message.edit({ content: `**Current Song: **${player.current.info.title} - ${player?.current.info.isStream ? "LIVE" : toColonNotation(player?.current.info.duration)}\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                return;
            }

            const embs = generateQueueEmbed(player.queue)

            if (i.customId === 'next') {
                if (currentPage === embs.length - 1) {
                    // @ts-ignore
                    message.edit({ content: `**Current Song: **${player?.current.info.title} - ${player?.current.info.isStream ? "LIVE" : toColonNotation(player?.current.info.length)}\`\`\`js\n${embs[currentPage]}\`\`\``, components: [row] });
                    return;
                }

                currentPage++;
                // @ts-ignore
                message.edit({ content: `**Current Song: **${player?.current.info.title} - ${player?.current.info.isStream ? "LIVE" : toColonNotation(player?.current.info.length)}\`\`\`js\n${embs[currentPage]}\`\`\``, components: [row] });
            }

            if (i.customId === 'back') {
                if (currentPage === 0) {
                    // @ts-ignore
                    message.edit({ content: `**Current Song: **${player?.current.info.title} - ${player?.current.info.isStream ? "LIVE" : toColonNotation(player?.current.info.length)}\`\`\`js\n${embs[currentPage]}\`\`\``, components: [row] });
                    return;
                }

                --currentPage;
                // @ts-ignore
                message.edit({ content: `**Current Song: **${player?.current.info.title} - ${player?.current.info.isStream ? "LIVE" : toColonNotation(player?.current.info.length)}\`\`\`js\n${embs[currentPage]}\`\`\``, components: [row] });
            }

            if (i.customId === 'last') {
                currentPage = embs.length - 1
                // @ts-ignore
                message.edit({ content: `**Current Song: **${player?.current.info.title} - ${player?.current.info.isStream ? "LIVE" : toColonNotation(player?.current.info.length)}\`\`\`js\n${embs[embs.length - 1]}\`\`\``, components: [row] });
            }

            if (i.customId === 'first') {
                currentPage = 0
                // @ts-ignore
                message.edit({ content: `**Current Song: **${player?.current.info.title} - ${player?.current.info.isStream ? "LIVE" : toColonNotation(player?.current.info.length)}\`\`\`js\n${embs[0]}\`\`\``, components: [row] });
            }
        })

        function generateQueueEmbed(queue: any) {
            const emb = []
            let k = 10;
            for (let i = 0; i < queue.length; i += 10) {
                const current = queue.slice(i, k);
                let j = i;
                k += 10
                const info = current.map((track: any) => `${++j}. ${track.info.title} - ${track.info.isStream ? "LIVE" : toColonNotation(track.info.length)}`).join("\n");
                emb.push(info);
            }
            return emb;
        }
    }
}
