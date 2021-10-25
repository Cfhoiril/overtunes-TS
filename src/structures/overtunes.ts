// Dependecies
import { SapphireClient } from "@sapphire/framework";
import { Intents, Message } from "discord.js";
import { Manager } from "erela.js";
import { join, resolve } from "path";
// Config
import * as config from "../config.json";
import lavalink from "../lavalink";
import guild from "../database/Manager/GuildManager"

class Overtunes extends SapphireClient {
    public constructor() {
        super({
            fetchPrefix: async (msg: Message) => {
                const guildData = await guild.findOne({ id: msg.guild?.id! });
                return guildData?.prefix ?? config.prefix;
            },
            allowedMentions: {
                users: [],
                repliedUser: false,
                roles: [],
            },
            intents: [
                Intents.FLAGS.GUILD_VOICE_STATES,
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
            ],
            partials: [
                'MESSAGE',
                'REACTION',
                'CHANNEL',
            ],
            shards: "auto",
            defaultCooldown: {
                delay: 5000,
                limit: 2
            },
            typing: false,
            failIfNotExists: true,
            baseUserDirectory: resolve(join(__dirname, "..")),
            caseInsensitivePrefixes: true,
            caseInsensitiveCommands: true
        });
    }

    public manager = new Manager({
        nodes: lavalink,
        send: (id, payload) => {
            const guild = this.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        },
        autoPlay: true,
        plugins: []
    });
}

declare module "@sapphire/framework" {
    export interface SapphireClient {
        manager: Manager,
    }
}

export = new Overtunes().login(config.token)
