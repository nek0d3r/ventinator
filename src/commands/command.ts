import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { Interaction, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { EventData } from '../models/internal-models.js';

export interface Command {
    metadata: RESTPostAPIApplicationCommandsJSONBody;
    cooldown?: RateLimiter;
    deferType: CommandDeferType;
    requireClientPerms: PermissionsString[];
    execute(intr: Interaction, data: EventData): Promise<void>;
}

export enum CommandDeferType {
    PUBLIC = 'PUBLIC',
    HIDDEN = 'HIDDEN',
    NONE = 'NONE',
}
