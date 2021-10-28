import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import playlist from "../../database/Manager/PlaylistManager";
// @ts-expect-error
import { toColonNotation } from "colon-notation";

@ApplyOptions<CommandOptions>({
    name: "view",
    preconditions: []
})

export class PlaylistCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");

        if (!argument.success) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setDescription('You need to specify the playlist name you want to view')
                .setColor('RED')
            ]
        });

        const data = await playlist.findOne({ User: msg.author.id, Playlist: argument.value });
        if (!data) {
            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('Playlist not found')
                    .setColor('RED')
                ]
            })
        } if (!data.Song.length) {
            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('That playlist empty')
                    .setColor('RED')
                ]
            })
        } else {
            const sg = data.Song
            let j = 0
            let currentPage = 0;

            const emb = generateQueueEmbed(data.Song)

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

            const b = await msg.channel.send({ content: `Playlist Name: \`${data.Playlist}\`\n\`\`\`js\n${emb[currentPage]}\`\`\``, components: [row] });

            const filter = (button: any) => button.user.id === msg.author.id
            const collector = b.createMessageComponentCollector({ filter });

            collector.on('collect', async i => {
                if (i.customId === 'next') {
                    await i.deferUpdate();

                    if (currentPage < emb.length - 1) {
                        currentPage++;
                        let kk = currentPage
                        const embs = generateQueueEmbed(data.Song)
                        i.editReply({ content: `Playlist Name: \`${data.Playlist}\`\n\`\`\`js\n${embs[kk]}\`\`\``, components: [row] });

                    }
                }

                if (i.customId === 'back') {
                    await i.deferUpdate();

                    if (currentPage !== 0) {
                        --currentPage;
                        let kk = currentPage
                        const embs = generateQueueEmbed(data.Song)
                        i.editReply({ content: `Playlist Name: \`${data.Playlist}\`\n\`\`\`js\n${embs[kk]}\`\`\``, components: [row] });

                    }
                }

                if (i.customId === 'last') {
                    await i.deferUpdate();
                    const embs = generateQueueEmbed(data.Song)
                    currentPage = embs.length - 1
                    let kk = currentPage

                    i.editReply({ content: `Playlist Name: \`${data.Playlist}\`\n\`\`\`js\n${embs[embs.length - 1]}\`\`\``, components: [row] });

                }

                if (i.customId === 'first') {
                    await i.deferUpdate();
                    const embs = generateQueueEmbed(data.Song)
                    currentPage = embs.length - 1
                    let kk = currentPage

                    i.editReply({ content: `Playlist Name: \`${data.Playlist}\`\n\`\`\`js\n${embs[0]}\`\`\``, components: [row] });
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
        const info = current.map((track: any) => `${++j}. ${track.Title} - ${toColonNotation(track.Duration)}`).join("\n");
        emb.push(info);
    }
    return emb;
}