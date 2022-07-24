import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { CommandInteraction, EmbedBuilder, Interaction, PermissionsString } from 'discord.js';

import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class HelpCommand implements Command {
    public metadata: RESTPostAPIChatInputApplicationCommandsJSONBody = {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getCom('chatCommands.help'),
        description: Lang.getRef('commandDescs.help', Lang.Default),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                name: Lang.getCom('arguments.option'),
                description: 'Option.',
                required: true,
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: 'commands',
                        value: 'commands',
                    },
                    {
                        name: 'permissions',
                        value: 'permissions',
                    },
                ],
            },
        ],
    };
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];
    public async execute(intr: Interaction, data: EventData): Promise<void> {
        if (!intr.isChatInputCommand()) return;
        let option = intr.options.getString(Lang.getCom('arguments.option'));

        let embed: EmbedBuilder;
        switch (option) {
            case 'commands': {
                embed = Lang.getEmbed('displayEmbeds.commands', data.lang());
                break;
            }
            case 'permissions': {
                embed = Lang.getEmbed('displayEmbeds.permissions', data.lang());
                break;
            }
            default: {
                return;
            }
        }

        await InteractionUtils.send(intr, embed);
    }
}
