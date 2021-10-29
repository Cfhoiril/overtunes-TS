import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
// @ts-expect-error
import { toColonNotation } from "colon-notation";

@ApplyOptions<CommandOptions>({
    name: "queue",
    aliases: ["q"],
    preconditions: ["havePlayer", "haveQueue"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const player = this.container.client.manager.get(msg.guildId!);

        let currentPage = 0;
        const emb = generateQueueEmbed(player?.queue)

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

        if (player?.queue.length === 0) {
            var b = await msg.channel.send({ content: `**Current Song: ${player?.queue?.current?.title}** - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\nThis queue is empty\`\`\``, components: [row] });

            const collector = b.createMessageComponentCollector();

            collector.on('collect', async (i: any) => {
                if (i.customId === 'next') {
                    await i.deferUpdate();
                    var player = this.container.client.manager.get(msg.guild?.id!);

                    if (!player) {
                        return i.editReply({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }
                    if (!player.queue.current) {
                        return i.editReply({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }


                    if (player.queue.length === 0) {
                        return i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    const embs = generateQueueEmbed(player.queue)
                    var kk = currentPage

                    if (currentPage === embs.length - 1) {
                        return i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[kk]}\`\`\``, components: [row] });
                    }
                    currentPage++;
                    var kk = currentPage
                    i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[kk]}\`\`\``, components: [row] });


                }

                if (i.customId === 'back') {
                    await i.deferUpdate();
                    var player = this.container.client.manager.get(msg.guild?.id!);

                    if (!player) {
                        return i.editReply({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    if (!player.queue.current) {
                        return i.editReply({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    if (player.queue.length === 0) {
                        return i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    const embs = generateQueueEmbed(player.queue)
                    var kk = currentPage

                    if (currentPage === 0) {
                        return i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[kk]}\`\`\``, components: [row] });
                    }
                    --currentPage;
                    var kk = currentPage

                    i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[kk]}\`\`\``, components: [row] });


                }

                if (i.customId === 'last') {
                    await i.deferUpdate();
                    var player = this.container.client.manager.get(msg.guild?.id!);

                    if (!player) {
                        return i.editReply({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    if (!player.queue.current) {
                        return i.editReply({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    if (player.queue.length === 0) {
                        return i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    const embs = generateQueueEmbed(player.queue)
                    var kk = currentPage

                    if (currentPage === 0) {
                        return i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[embs.length - 1]}\`\`\``, components: [row] });
                    }
                    currentPage = embs.length - 1
                    var kk = currentPage

                    i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[embs.length - 1]}\`\`\``, components: [row] });

                }

                if (i.customId === 'first') {
                    await i.deferUpdate();
                    var player = this.container.client.manager.get(msg.guild?.id!);

                    if (!player) {
                        return i.editReply({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    if (!player.queue.current) {
                        return i.editReply({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    if (player.queue.length === 0) {
                        return i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    const embs = generateQueueEmbed(player.queue)
                    var kk = currentPage

                    if (currentPage === 0) {
                        return i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[kk]}\`\`\``, components: [row] });
                    }

                    currentPage = 0
                    var kk = currentPage

                    i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[0]}\`\`\``, components: [row] });
                }
            })
        } else if (player?.queue.length! > 0) {
            var b = await msg.channel.send({ content: `**Current Song: **${player?.queue?.current?.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${emb[currentPage]}\`\`\``, components: [row] });

            const collector = b.createMessageComponentCollector();

            collector.on('collect', async (i: any) => {
                if (i.customId === 'next') {
                    await i.deferUpdate();
                    var player = this.container.client.manager.get(msg.guild?.id!);

                    if (!player) {
                        return i.editReply({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }
                    if (!player.queue.current) {
                        return i.editReply({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }


                    if (player.queue.length === 0) {
                        return i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    const embs = generateQueueEmbed(player.queue)
                    var kk = currentPage

                    if (currentPage === embs.length - 1) {
                        return i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[kk]}\`\`\``, components: [row] });
                    }
                    currentPage++;
                    var kk = currentPage
                    i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[kk]}\`\`\``, components: [row] });


                }

                if (i.customId === 'back') {
                    await i.deferUpdate();
                    var player = this.container.client.manager.get(msg.guild?.id!);

                    if (!player) {
                        return i.editReply({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    if (!player.queue.current) {
                        return i.editReply({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    if (player.queue.length === 0) {
                        return i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    const embs = generateQueueEmbed(player.queue)
                    var kk = currentPage

                    if (currentPage === 0) {
                        return i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[kk]}\`\`\``, components: [row] });
                    }
                    --currentPage;
                    var kk = currentPage

                    i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[kk]}\`\`\``, components: [row] });


                }

                if (i.customId === 'last') {
                    await i.deferUpdate();
                    var player = this.container.client.manager.get(msg.guild?.id!);

                    if (!player) {
                        return i.editReply({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    if (!player.queue.current) {
                        return i.editReply({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    if (player.queue.length === 0) {
                        return i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    const embs = generateQueueEmbed(player.queue)
                    var kk = currentPage

                    if (currentPage === 0) {
                        return i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[embs.length - 1]}\`\`\``, components: [row] });
                    }
                    currentPage = embs.length - 1
                    var kk = currentPage

                    i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[embs.length - 1]}\`\`\``, components: [row] });

                }

                if (i.customId === 'first') {
                    await i.deferUpdate();
                    var player = this.container.client.manager.get(msg.guild?.id!);

                    if (!player) {
                        return i.editReply({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    if (!player.queue.current) {
                        return i.editReply({ content: `\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    if (player.queue.length === 0) {
                        return i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\nThis queue is empty\`\`\``, components: [row] });
                    }

                    const embs = generateQueueEmbed(player.queue)
                    var kk = currentPage

                    if (currentPage === 0) {
                        return i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[kk]}\`\`\``, components: [row] });
                    }

                    currentPage = 0
                    var kk = currentPage

                    i.editReply({ content: `**Current Song: **${player.queue.current.title} - ${player?.queue?.current?.isStream ? "LIVE" : toColonNotation(player?.queue.current?.duration)}\`\`\`js\n${embs[0]}\`\`\``, components: [row] });
                }
            })
        }
    }
}

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