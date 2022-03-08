import { BaseCommand } from "../../base/BaseCommand.js";
import { makeEmbed } from "../../utils/makeEmbed.js";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { config } from "../../config.js";
import googleIt from "google-it";

export class SearchCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "search",
                description: "Search the internet using Google",
                options: [
                    {
                        type: "STRING",
                        name: "query",
                        description: "The query to search for",
                        required: true
                    },
                    {
                        type: "STRING",
                        name: "url",
                        description: "Specific website to get results from"
                    }
                ]
            },
            category: "General",
        });
    }

    async execute(ctx) {
        let query = ctx.options.getString("query");
        const url = ctx.options.getString("url");
        query = (url) ? `site:${url} ${query}` : query;

        if (query) {
            googleIt({'query': query, 'limit': 'searchLimit', 'disableConsole': true }).then(results => {
                results = results.map(result => `[${result.title}](${result.link})\n${result.snippet}\n`).join("\n");
                ctx.send({
                    embeds: [
                        makeEmbed("info", results)
                    ],
                    components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setStyle("LINK")
                                    .setURL(`https://www.google.com/search?q=${encodeURIComponent(query)}`)
                                    .setLabel("View more results on Google")
                            )
                    ]
                });
            }).catch(e => {
                const errorEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle('An error has occurred')
                    .setDescription(`${e}`);

                ctx.send({
                    embeds: [errorEmbed]
                });
            })
        }
    }
}
