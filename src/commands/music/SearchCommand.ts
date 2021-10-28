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
    preconditions: ["inVoice", "canConnect", "sameVoice", "isSpecialChannel"]
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");
        let player = this.container.client.manager.get(msg.guild?.id!);
        let guildPrefix = await prefix.findOne({ id: msg.guild?.id! })

        if (!argument.success) return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor('RED')
                .setDescription(`To play song u need specify the track title, or you can try **${guildPrefix.prefix ?? config.prefix}search everything sucks**`)]
        });

        if (!player) {
            player = this.container.client.manager.create({
                guild: msg.guildId as string,
                voiceChannel: msg.member?.voice.channelId as string,
                textChannel: msg.channelId as string,
                volume: 75,
                selfDeafen: false,
            })
        }

        if (player.state !== "CONNECTED") {
            player.connect();
            player.set("autoplay", false);
        }

        let res;
        const search = argument.value;

        try {
            res = await player.search(search, msg.author)
            if (res.loadType === 'LOAD_FAILED') {
                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setAuthor("Something wrong when searching the track", undefined, "https://discord.gg/hM8U8cHtwu")
                        .setDescription(`\`\`\`${res.exception?.message!}\`\`\``)
                        .setColor("RED")
                    ]
                })
            }

        } catch (err) {
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setAuthor("Something wrong when searching the track", undefined, "https://discord.gg/hM8U8cHtwu")
                    .setDescription(`\`\`\`${err}\`\`\``)
                    .setColor("RED")
                ]
            })
        }

        if (res.loadType == 'NO_MATCHES') {
            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription('There were no results found.')
                    .setColor('RED')]
            });
        }

        else {
            let max = 20;
            if (res.tracks.length < max) max = res.tracks.length;

            let resultFromSearch: any = [];

            res.tracks.slice(0, max).map((track) => {
                resultFromSearch.push({
                    label: `${track.title}`,
                    description: `Duration: ${track.isStream ? 'LIVE' : toColonNotation(track.duration)}`,
                    value: `${track.uri}`,
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
                    let trackForPlay;

                    trackForPlay = await player?.search(uriFromCollector, msg.author);
                    player?.queue?.add(trackForPlay?.tracks[0]!);
                    if (!player?.playing && !player?.paused && !player?.queue?.size) player?.play();
                    i.editReply({
                        content: null,
                        embeds: [new MessageEmbed()
                            .setDescription(`Added ${trackForPlay?.tracks[0]?.title} [${trackForPlay?.tracks[0]?.requester}]`)
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
    }
}