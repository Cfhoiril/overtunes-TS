import { CommandOptions, Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import music from "../../database/Manager/MusicManager";

@ApplyOptions<CommandOptions>({
    name: "setup",
    requiredUserPermissions: ["MANAGE_GUILD"],
    cooldownDelay: 30000,
    cooldownLimit: 2,
    requiredClientPermissions: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES', 'VIEW_CHANNEL']
})

export class SetupCommand extends Command {
    async messageRun(msg: Message) {
        const data = await music.findOne({ Guild: msg.guildId });

        const pl = new MessageEmbed()
            .setTitle('No Music currently playing')
            .setColor(msg.guild?.me?.displayHexColor!)
            .setImage('https://cdn.discordapp.com/attachments/843462619158675487/890162871915393024/386720.jpeg')

        let stop = new MessageButton()
            .setStyle('PRIMARY')
            .setCustomId('stop1')
            .setLabel('⏹')
            .setDisabled(true)

        let next = new MessageButton()
            .setStyle('PRIMARY')
            .setCustomId('skip1')
            .setLabel('⏭️')
            .setDisabled(true)

        let pause = new MessageButton()
            .setCustomId('pause1')
            .setLabel('▶')
            .setStyle('PRIMARY')
            .setDisabled(true)

        let loop = new MessageButton()
            .setStyle('PRIMARY')
            .setLabel('🔁')
            .setCustomId('loop1')
            .setDisabled(true)

        let shuffle = new MessageButton()
            .setStyle('PRIMARY')
            .setLabel('🔀')
            .setCustomId('shuffle1')
            .setDisabled(true)

        let row = new MessageActionRow()
            .addComponents(stop)
            .addComponents(shuffle)
            .addComponents(pause)
            .addComponents(next)
            .addComponents(loop)

        msg.guild?.channels.create(`${this.container.client.user?.username}-music-request`, {
            type: "GUILD_TEXT",
        }).then(async (x) => {
            x.setTopic("⏹ Stop, 🔀 Shuffle, ⏸ Pause/Resume, ⏭ Skip, 🔁 Repeat")
            const react = await x.send({ content: 'Join a voice channel then play something', embeds: [pl], components: [row] })
            data.Channel = x.id
            data.Message = react.id
            data.save();

            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Music request channel has been created, Channel <#${x.id}>.\n\nMy [commands](https://overtunes.netlify.app/docs/basic-use/commands/) will only work in <#${x.id}> from now on.`)
                    .setColor(msg.guild?.me?.displayHexColor!)
                ]
            })
        })
    }
}