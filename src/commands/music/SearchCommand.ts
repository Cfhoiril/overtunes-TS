import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageSelectMenu } from "discord.js";
import { TrackUtils } from "erela.js";
import * as config from "../../config.json";
import prefix from "../../database/Manager/GuildManager";
// @ts-expect-error
import { toColonNotation } from "colon-notation";

@ApplyOptions<CommandOptions>({
    name: "search",
    aliases: ["find"],
    requiredClientPermissions: ["CONNECT", "SPEAK"],
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");
        let guildPrefix = await prefix.findOne({ id: msg.guild?.id! });

        if (!argument.success) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor('RED')
                .setDescription(`To search a song u need specify the track title, or you can try **${guildPrefix.prefix ?? config.prefix}search everything sucks**`)]
        });

        const player = this.container.client.audioQueue.get(msg.guild?.id);
        const node = this.container.client.audioManager.getNode()

        if (this.checkUrl(argument.value)) {
            const res = await node.rest.resolve(argument.value);
            if (!res || !res.tracks.length) {
                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setDescription("No results matching the query found.")
                        .setColor("RED")
                    ]
                });
            }

            const { type, tracks, playlistName } = res;

            let max = 20;
            if (res.tracks.length < max) max = res.tracks.length;

            let resultFromSearch: any = [];

            res.tracks.slice(0, max).map((track) => {
                resultFromSearch.push({
                    label: `${track.info.title}`,
                    description: `Duration: ${track.info.isStream ? 'LIVE' : toColonNotation(track.info.length)}`,
                    value: `${track.info.uri}`,
                })
            });

            const menus = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setCustomId('select')
                        .setPlaceholder('Please choose what track you want')
                        .addOptions(resultFromSearch),
                );

            let choosenTracks = await msg.channel.send({ content: `Search results for \`${argument.value}\`, please select the track before \`30 seconds\``, components: [menus] })
            const filter = (button: any) => button.user.id === msg.author.id;

            const tracksCollector = choosenTracks.createMessageComponentCollector({ filter, time: 30000 });
            tracksCollector.on('collect', async i => {
                if (i.isSelectMenu()) {
                    await i.deferUpdate();
                    let uriFromCollector = i.values[0];
                    let trackForPlay = await node.rest.resolve(uriFromCollector);

                    let gotTrack = trackForPlay.tracks.shift();

                    // @ts-ignore
                    gotTrack.info.requester = msg.author;
                    const resAfterCollect = await this.container.client.audioQueue.handle(msg, node, gotTrack!);

                    resAfterCollect?.play()
                    i.editReply({
                        content: null,
                        embeds: [new MessageEmbed()
                            // @ts-ignore
                            .setDescription(`Added ${gotTrack.info.title} [${gotTrack.info.requester}]`)
                            .setColor(msg.guild?.me?.displayHexColor!)
                            .setTimestamp()
                        ],
                        components: []
                    })
                }
            })
            tracksCollector.on('end', async i => {
                if (i.size == 0) {
                    choosenTracks.edit({
                        content: null,
                        embeds: [new MessageEmbed()
                            .setDescription(`Search canceled, im waiting too long`)
                            .setColor(msg.guild?.me?.displayHexColor!)
                        ],
                        components: []
                    })
                }
            })
            return;
        }

        const res = await node.rest.resolve(argument.value, "youtube");
        if (!res || !res.tracks.length) {
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription("No results matching the query found.")
                    .setColor("RED")
                ]
            });
        }

        const { type, tracks, playlistName } = res;

        let max = 20;
        if (res.tracks.length < max) max = res.tracks.length;

        let resultFromSearch: any = [];

        res.tracks.slice(0, max).map((track) => {
            resultFromSearch.push({
                label: `${track.info.title}`,
                description: `Duration: ${track.info.isStream ? 'LIVE' : toColonNotation(track.info.length)}`,
                value: `${track.info.uri}`,
            })
        });

        const menus = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setCustomId('select')
                    .setPlaceholder('Please choose what track you want')
                    .addOptions(resultFromSearch),
            );

        let choosenTracks = await msg.channel.send({ content: `Search results for \`${argument.value}\`, please select the track before \`30 seconds\``, components: [menus] })
        const filter = (button: any) => button.user.id === msg.author.id;

        const tracksCollector = choosenTracks.createMessageComponentCollector({ filter, time: 30000 });
        tracksCollector.on('collect', async i => {
            if (i.isSelectMenu()) {
                await i.deferUpdate();
                let uriFromCollector = i.values[0];
                let trackForPlay = await node.rest.resolve(uriFromCollector);

                let gotTrack = trackForPlay.tracks.shift();

                // @ts-ignore
                gotTrack.info.requester = msg.author;
                const resAfterCollect = await this.container.client.audioQueue.handle(msg, node, gotTrack!);

                resAfterCollect?.play()
                i.editReply({
                    content: null,
                    embeds: [new MessageEmbed()
                        // @ts-ignore
                        .setDescription(`Added ${gotTrack.info.title} [${gotTrack.info.requester}]`)
                        .setColor(msg.guild?.me?.displayHexColor!)
                        .setTimestamp()
                    ],
                    components: []
                })
            }
        })
        tracksCollector.on('end', async i => {
            if (i.size == 0) {
                choosenTracks.edit({
                    content: null,
                    embeds: [new MessageEmbed()
                        .setDescription(`Search canceled, im waiting too long`)
                        .setColor(msg.guild?.me?.displayHexColor!)
                    ],
                    components: []
                })
            }
        })

    }
    private checkUrl(url: string) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}