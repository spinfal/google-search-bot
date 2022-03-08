import { BaseCommand } from "../../base/BaseCommand.js";
import { makeEmbed } from "../../utils/makeEmbed.js";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { config } from "../../config.js";
import google_images from "free-google-images";

export class ImageSearchCommand extends BaseCommand {
    constructor(client) {
        super(client, {
            slash: {
                name: "images",
                description: "Search the internet's images using Google Images",
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
            //googleIt({'query': query, 'limit': 'searchLimit', 'disableConsole': true }).then(results => {
            google_images.search(query).then(results => {
                results = results.slice(0, 10);
                results = results.map(result => `${result.title}\n[*View Image*](${result.image.url}) - [*View Website*](${result.link})\n`).join("\n");
                ctx.send({
                    embeds: [
                        makeEmbed("info", results)
                    ],
                    components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setStyle("LINK")
                                    .setURL(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&sclient=img`)
                                    .setLabel("View more results on Google Images")
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
