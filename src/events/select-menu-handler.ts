import { Message, SelectMenuInteraction } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { createRequire } from 'node:module';

import { SelectMenu, SelectMenuDeferType } from '../actions/select-menu.js';
import { EventData } from '../models/internal-models.js';
import { InteractionUtils } from '../utils/index.js';
import { EventHandler } from './index.js';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

export class SelectMenuHandler implements EventHandler {
    private rateLimiter = new RateLimiter(
        Config.rateLimiting.buttons.amount,
        Config.rateLimiting.buttons.interval * 1000
    );

    constructor(private selectMenus: SelectMenu[]) {}

    public async process(intr: SelectMenuInteraction, msg: Message): Promise<void> {
        // Don't respond to self, or other bots
        if (intr.user.id === intr.client.user?.id || intr.user.bot) {
            return;
        }

        // Check if user is rate limited
        let limited = this.rateLimiter.take(intr.user.id);
        if (limited) {
            return;
        }

        // Try to find the select menu the user wants
        let selectMenu = this.findSelectMenu(intr.customId);
        if (!selectMenu) {
            return;
        }

        if (selectMenu.requireGuild && !intr.guild) {
            return;
        }

        // Check if the embeds author equals the users tag
        if (selectMenu.requireEmbedAuthorTag && msg.embeds[0]?.author?.name !== intr.user.tag) {
            return;
        }

        // Defer interaction
        // NOTE: Anything after this point we should be responding to the interaction
        switch (selectMenu.deferType) {
            case SelectMenuDeferType.REPLY: {
                await InteractionUtils.deferReply(intr);
                break;
            }
            case SelectMenuDeferType.UPDATE: {
                await InteractionUtils.deferUpdate(intr);
                break;
            }
        }

        // Return if defer was unsuccessful
        if (selectMenu.deferType !== SelectMenuDeferType.NONE && !intr.deferred) {
            return;
        }

        // TODO: Get data from database
        let data = new EventData();

        // Execute the button
        await selectMenu.execute(intr, msg, data);
    }

    private findSelectMenu(id: string): SelectMenu {
        return this.selectMenus.find(button => button.ids.includes(id));
    }
}
