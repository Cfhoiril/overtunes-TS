import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import setting from "../../database/Manager/MusicManager";
import prefix from "../../database/Manager/GuildManager";
import { MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import * as config from "../../config.json";

@ApplyOptions<ListenerOptions>({
    name: "guildCreate"
})

export class rawEvent extends Listener {
    async run(guild: any) {
        let channel = guild.channels.cache.find(
            (channel: any) =>
                channel.type === "GUILD_TEXT" &&
                channel.permissionsFor(guild.me).has("SEND_MESSAGES")
        );
        const emb = new MessageEmbed()
            .setTitle('Greetings!')
            .setDescription(`Thanks for adding me to your server\nMy prefix in here is \`${config.prefix}\`\nYou can start using me by typing \`${config.prefix}play\`\nYou also can change my prefix using \`${config.prefix}prefix < new prefix >\``)
            .setFooter('For more help you can use button below')

        let button = new MessageButton()
            .setStyle('LINK')
            .setLabel('Commands')
            .setURL('https://overtunes.netlify.app/docs/basic-use/commands')
        let support = new MessageButton()
            .setStyle('LINK')
            .setURL('https://overtunes.netlify.app/docs/get-started/playing-music')
            .setLabel('Get Started')
        let button2 = new MessageButton()
            .setStyle('LINK')
            .setLabel('FAQ')
            .setURL('https://overtunes.netlify.app/docs/basic-use/faq')

        const ab = new MessageActionRow()
            .addComponents(button)
            .addComponents(support)
            .addComponents(button2)

        new setting({
            Guild: guild.id,
            Stay: false,
            Announce: true,
            Dj: false
        }).save()

        new prefix({
            id: guild.id,
            prefix: config.prefix
        }).save()

        try {
            channel.send({ embeds: [emb], components: [ab] })
        } catch {
            console.log(`❌ Cannot send message to ${guild.id}`)
        }
    }
}
