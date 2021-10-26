import { CommandOptions, Command, Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import exec from "child_process";

@ApplyOptions<CommandOptions>({
    name: "execute",
    aliases: ["exec"],
    preconditions: ["ownerOnly"],
})

export class ExecCommand extends Command {
    async messageRun(msg: Message, args: Args) {
        const argument = await args.restResult("string");

        try {
            const execute = (command: string) => {
                exec.exec(command, (err, stdout, stderr) => {
                    const m = new MessageEmbed()
                        .setDescription(`\`\`\`${stdout.substr(0, 2000)}\`\`\``)

                    if (stderr) {
                        const ma = new MessageEmbed()
                            .addField('Input', '```' + argument.value + '```')
                            .addField('Output', `\`\`\`${stderr}\`\`\``)
                        msg.channel.send({ embeds: [ma] })
                    } else {
                        return msg.channel.send({ embeds: [m] })
                    }
                });
            }

            execute(argument.value as string);
        } catch (err) {
            msg.channel.send('Their was an error!\n' + err).catch();
        }

    }
}