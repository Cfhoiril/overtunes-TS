// Dependecies
import { SapphireClient } from "@sapphire/framework";
import { Intents, Message } from "discord.js";
import { Manager } from "erela.js";
import { join, resolve } from "path";
import { Shoukaku, Libraries } from "shoukaku";
import { Client } from "discord.js";
import Kazagumo from "kazagumo";
// Config
import * as config from "../config.json";
import privateLavalink from "../config/lavalink";
import publicLavalink from "../config/lavalink2"
import shoukaku from "../config/shoukaku";
import guild from "../database/Manager/GuildManager"

class Overtunes extends SapphireClient {
    public constructor() {
        super({
            fetchPrefix: async (msg: Message) => {
                const guildData = await guild.findOne({ id: msg.guild?.id! });
                if (!guildData) {
                    new guild({
                        id: msg.guildId,
                        prefix: config.prefix
                    }).save()
                    return config.prefix;
                } else {
                    return guildData.prefix;
                }
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
    public musicManager = new Kazagumo(this, privateLavalink, shoukaku, { defaultSearchEngine: "youtube", spotify: { clientSecret: config.spotify_clientSecret, clientId: config.spotify_clientId } });
}

declare module "@sapphire/framework" {
    export interface SapphireClient {
        manager: Manager,
        musicManager: Kazagumo,
    }
}

export = new Overtunes().login(config.token)
