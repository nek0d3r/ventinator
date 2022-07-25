import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import djs, { EmbedBuilder, Interaction, PermissionsString } from 'discord.js';
import fileSize from 'filesize';
import { createRequire } from 'node:module';
import os from 'node:os';
import typescript from 'typescript';

import { LangCode } from '../../enums/index.js';
import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang, Logger } from '../../services/index.js';
import { InteractionUtils, ShardUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

const require = createRequire(import.meta.url);
let Config = require('../../../config/config.json');
let TsConfig = require('../../../tsconfig.json');

export class VentCommand implements Command {
    public metadata: RESTPostAPIChatInputApplicationCommandsJSONBody = {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getCom('chatCommands.vent'),
        description: Lang.getRef('commandDescs.vent', Lang.Default),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                name: Lang.getCom('arguments.message'),
                description: 'Message.',
                required: true,
                type: ApplicationCommandOptionType.String
            }
        ]
    };
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: Interaction, data: EventData): Promise<void> {
        if (!intr.isChatInputCommand()) return;
        
        // TODO: Response for non-DM usage
        if (!!intr.guildId) return;

        console.log(intr);
        
        let message = intr.options.getString(Lang.getCom('arguments.message'));

        await InteractionUtils.send(intr, message);
    }
}
