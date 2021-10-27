// @ts-nocheck idk why all this code throw err

import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import channel from "../../database/Manager/MusicManager";
import guild from "../../database/Manager/GuildManager";
import { Message, MessageEmbed, Interaction } from "discord.js";
import * as config from "../../config.json";

@ApplyOptions<ListenerOptions>({
    name: "interactionCreate",
})

export class interactionCreate extends Listener {
    async run(interaction: Interaction) {
        if (interaction.isButton) {
            const data = await channel.findOne({ Channel: interaction.channelId })
            if (data) {
                const player = this.container.client.manager.get(interaction.guildId!);

                // Stop
                if (interaction.customId === "stop1") {
                    if (!player) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setDescription('No **Player** in this guild')
                            .setColor('RED')
                        ]
                    });

                    if (!interaction.member?.voice?.channel) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setDescription("You are not in the **Voice Channel**")
                            .setColor('RED')
                        ]
                    });

                    if (player && interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor("RED")
                            .setDescription("You must be in the same channel as Me")]
                    });

                    if (!player.queue.current) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor("RED")
                            .setDescription("There is no music playing")]
                    });

                    player.queue.clear();
                    player.stop()
                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(interaction.guild.me.displayHexColor)
                            .setDescription("Player stopped")]
                    });
                }

                //shuffle
                if (interaction.customId === "shuffle1") {
                    if (!player) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setDescription('No **Player** in this guild')
                            .setColor('RED')
                        ]
                    });

                    if (!interaction.member?.voice?.channel) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setDescription("You are not in the **Voice Channel**")
                            .setColor('RED')
                        ]
                    });

                    if (player && interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor("RED")
                            .setDescription("You must be in the same channel as Me")]
                    });

                    if (!player.queue.current) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor("RED")
                            .setDescription("There is no music playing")]
                    });

                    player.queue.shuffle()
                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(interaction.guild.me.displayHexColor)
                            .setDescription("Player shuffled")]
                    });
                }

                //pause
                if (interaction.customId === "pause1") {
                    if (!player) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setDescription('No **Player** in this guild')
                            .setColor('RED')
                        ]
                    });

                    if (!interaction.member?.voice?.channel) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setDescription("You are not in the **Voice Channel**")
                            .setColor('RED')
                        ]
                    });

                    if (player && interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor("RED")
                            .setDescription("You must be in the same channel as Me")]
                    });

                    if (!player.queue.current) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor("RED")
                            .setDescription("There is no music playing")]
                    });


                    if (player.paused) {
                        player.pause(false);
                        player.set("pause", false)
                        interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(interaction.guild.me.displayHexColor)
                                .setDescription('Player resumed')
                            ]
                        })
                    } else {
                        player.pause(true);
                        player.set("pause", true)
                        interaction.reply({
                            embeds: [new MessageEmbed()
                                .setColor(interaction.guild.me.displayHexColor)
                                .setDescription('Player paused')
                            ]
                        })
                    }
                }

                // skip 
                if (interaction.customId === "skip1") {
                    if (!player) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setDescription('No **Player** in this guild')
                            .setColor('RED')
                        ]
                    });

                    if (!interaction.member?.voice?.channel) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setDescription("You are not in the **Voice Channel**")
                            .setColor('RED')
                        ]
                    });

                    if (player && interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor("RED")
                            .setDescription("You must be in the same channel as Me")]
                    });

                    if (!player.queue.current) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor("RED")
                            .setDescription("There is no music playing")]
                    });

                    player.stop()
                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(interaction.guild.me.displayHexColor)
                            .setDescription("Player skipped")]
                    });
                }

                // loop
                if (interaction.customId === "loop1") {
                    if (!player) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setDescription('No **Player** in this guild')
                            .setColor('RED')
                        ]
                    });

                    if (!interaction.member?.voice?.channel) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setDescription("You are not in the **Voice Channel**")
                            .setColor('RED')
                        ]
                    });

                    if (player && interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor("RED")
                            .setDescription("You must be in the same channel as Me")]
                    });

                    if (!player.queue.current) return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor("RED")
                            .setDescription("There is no music playing")]
                    });

                    !player.queueRepeat && !player.trackRepeat ? player.setQueueRepeat(true) : !player.trackRepeat ? player.setTrackRepeat(true) : player.setQueueRepeat(false).setTrackRepeat(false)
                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setColor(interaction.guild.me.displayHexColor)
                            .setDescription(`${player.queueRepeat ? 'Looping Current Queue' : player.trackRepeat ? 'Looping Current Track' : 'Looping now disabled'}`)
                        ]
                    });
                }
            }
        }
    }
}


