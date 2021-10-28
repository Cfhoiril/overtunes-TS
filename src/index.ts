import chalk from "chalk";
import { Shard, ShardingManager } from "discord.js";
import { join } from "path";
import * as config from "./config.json";

const shardClient = new ShardingManager(join(__dirname, "structures", "overtunes.js"), {
    respawn: true,
    token: config.token,
    totalShards: "auto"
});

shardClient.on("shardCreate", (Shard: Shard) => {
    console.log(chalk.greenBright(`🏡 Shard spawned: ${chalk.white(Shard.id)}`));
})

shardClient.spawn().catch((error: Error) => console.log(chalk.redBright(`❌ Something error when spawning Shard: ${error.message}`)));