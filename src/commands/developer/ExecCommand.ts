import { CommandOptions, Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import exec from "child_process";
import { codeBlock } from "@discordjs/builders";
import petitio from "petitio";

@ApplyOptions<CommandOptions>({
    name: "execute",
    aliases: ["exec"],
    preconditions: ["ownerOnly"],
    flags: true
})

export class ExecCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");
        if (!argument.success) return;

        if (args.getFlags("haste")) {
            try {
                const execute = (command: string) => {
                    exec.exec(command, async (err, stdout, stderr) => {
                        if (stderr) return msg.channel.send({ content: codeBlock("js", stderr) })

                        const { key } = await petitio("https://haste-server.stevanvincent.repl.co/documents", "POST").body(stdout).json();
                        await msg.channel.send(`https://haste-server.stevanvincent.repl.co/${key}.js`);
                    });
                }

                execute(argument.value as string);
            } catch (err) {
                msg.channel.send({
                    content: codeBlock("js", err as string)
                });
            }
        } else {
            try {
                const execute = (command: string) => {
                    exec.exec(command, (err, stdout, stderr) => {
                        if (stderr) return msg.channel.send({ content: codeBlock("js", stderr) })

                        msg.channel.send({
                            content: codeBlock("js", stdout as string)
                        });
                    });
                }

                execute(argument.value as string);
            } catch (err) {
                msg.channel.send({
                    content: codeBlock("js", err as string)
                });
            }
        }

    }
}