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
        const player = this.container.client.manager.get(msg.guildId!);

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
            content: `${(player?.queue.current && player) ? `**Current Song:** ${player?.queue?.current?.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}` : ""}
            \`\`\`js\n${player ? `${player?.queue.length ? `${emb}` : "This queue is empty"}` : "This queue is empty"}\`\`\``,
            components: [row]
        });

        const collector = message.createMessageComponentCollector();
        collector.on('collect', async (i) => {
            await i.deferUpdate();
            var player = this.container.client.manager.get(msg.guild?.id!);
            if (!player || !player.queue.current) {
                message.edit({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                return;
            }

            if (!player.queue.length) {
                message.edit({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                return;
            }

            const embs = generateQueueEmbed(player.queue)

            if (i.customId === 'next') {
                if (currentPage === embs.length - 1) {
                    message.edit({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[currentPage]}\`\`\``, components: [row] });
                    return;
                }

                currentPage++;
                message.edit({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[currentPage]}\`\`\``, components: [row] });
            }

            if (i.customId === 'back') {
                if (currentPage === 0) {
                    message.edit({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[currentPage]}\`\`\``, components: [row] });
                    return;
                }

                --currentPage;
                message.edit({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[currentPage]}\`\`\``, components: [row] });
            }

            if (i.customId === 'last') {
                currentPage = embs.length - 1
                message.edit({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[embs.length - 1]}\`\`\``, components: [row] });
            }

            if (i.customId === 'first') {
                currentPage = 0
                message.edit({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[0]}\`\`\``, components: [row] });
            }
        })

        function generateQueueEmbed(queue: any) {
            const emb = []
            let k = 10;
            for (let i = 0; i < queue.length; i += 10) {
                const current = queue.slice(i, k);
                let j = i;
                k += 10
                const info = current.map((track: any) => `${++j}. ${track.title} - ${track.isStream ? "LIVE" : toColonNotation(track.duration)}`).join("\n");
                emb.push(info);
            }
            return emb;
        }
    }
}
