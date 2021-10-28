import { ApplyOptions } from "@sapphire/decorators";
import { Args, Command, CommandOptions } from "@sapphire/framework";
import { Message, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
// @ts-expect-error
import { getLyrics } from "genius-lyrics-api";
import Genius from "genius-lyrics";
import { genius } from "../../config/config.json"
const Client = new Genius.Client(genius);;

@ApplyOptions<CommandOptions>({
    name: "lyrics",
    aliases: ["ly", "lyric"],
    preconditions: []
})

export class MusicCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");

        if (!argument.success) {
            const player = this.container.client.manager.get(msg.guildId!);
            if (!player) return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription("Please give tracks title")
                    .setColor('RED')
                ]
            });

            if (!player.queue.current) return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription("Please give tracks title")
                    .setColor('RED')
                ]
            });

            let title = player.queue.current.title;
            let author = player.queue.current.author;

            const options = {
                apiKey: genius,
                title: title,
                artist: author,
                optimizeQuery: true
            };

            getLyrics(options).then(async (lyrics: any) => {
                if (!lyrics || lyrics === null || lyrics === "null") return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setDescription(`No lyrics found`)
                        .setFooter('<> Require')
                        .setColor('RED')
                    ]
                })
                const lyr1 = new MessageEmbed()
                    .setTitle(`${title}`)
                    .setDescription(`${author}\n\n${lyrics}`)
                    .setColor(msg.guild?.me?.displayHexColor!)

                if (lyr1.description!.length > 2048) {
                    lyr1.description = `${lyrics.substr(0, 2048)}`;
                    const lyr2 = new MessageEmbed()
                        .setDescription(`${lyrics.substr(2048)}`)
                        .setFooter('Lyrics provided by Genius')
                        .setColor(msg.guild?.me?.displayHexColor!)
                    return msg.channel.send({ embeds: [lyr1, lyr2] })
                } else {
                    lyr1.setFooter('Lyrics provided by Genius')
                    return msg.channel.send({ embeds: [lyr1] })
                }
            })
        } else {
            try {
                const value = argument.value
                const searches = await Client.songs.search(value);
                const firstSong = searches[0];
                const artist = firstSong.artist;
                const options = {
                    apiKey: genius,
                    title: value,
                    artist: artist,
                    optimizeQuery: true
                };

                getLyrics(options).then(async (lyrics: any) => {
                    if (!lyrics || lyrics === null || lyrics === "null") return msg.channel.send({
                        embeds: [new MessageEmbed()
                            .setDescription('No lyrics found')
                            .setColor('RED')
                        ]
                    })
                    const lyr1 = new MessageEmbed()
                        .setTitle(`${value}`)
                        .setDescription(`${lyrics}`)
                        .setColor(msg.guild?.me?.displayHexColor!)

                    if (lyr1.description!.length > 2048) {
                        lyr1.description = `${lyrics.substr(0, 2048)}`;

                        const lyr2 = new MessageEmbed()
                            .setDescription(`${lyrics.substr(2048, 4056)}`)
                            .setFooter('Lyrics provided by Genius')
                            .setColor(msg.guild?.me?.displayHexColor!)

                        return msg.channel.send({ embeds: [lyr1, lyr2] })

                    } else {
                        lyr1.setFooter('Lyrics provided by Genius')
                        return msg.channel.send({ embeds: [lyr1] })
                    }
                })
            } catch {
                const lyr13 = new MessageEmbed()
                    .setDescription(`No lyrics found`)
                    .setColor('RED')
                return msg.channel.send({ embeds: [lyr13] })
            }
        }
    }
}