import { RESTJSONErrorCodes as DiscordApiErrors } from 'discord-api-types/v9';
import {
    Interaction,
    DiscordAPIError,
    InteractionReplyOptions,
    InteractionUpdateOptions,
    Message,
    MessageComponentInteraction,
    EmbedBuilder,
    WebhookEditMessageOptions,
    InteractionType,
} from 'discord.js';

const IGNORED_ERRORS = [
    DiscordApiErrors.UnknownMessage,
    DiscordApiErrors.UnknownChannel,
    DiscordApiErrors.UnknownGuild,
    DiscordApiErrors.UnknownUser,
    DiscordApiErrors.UnknownInteraction,
    DiscordApiErrors.CannotSendMessagesToThisUser, // User blocked bot or DM disabled
    DiscordApiErrors.ReactionWasBlocked, // User blocked bot or DM disabled
    DiscordApiErrors.MaximumActiveThreads,
];

export class InteractionUtils {
    public static async deferReply(
        intr: Interaction | MessageComponentInteraction,
        hidden: boolean = false
    ): Promise<void> {
        try {
            if (intr.type === InteractionType.ApplicationCommandAutocomplete) return;
            await intr.deferReply({
                ephemeral: hidden,
            }).then(() => { return; });
        } catch (error) {
            if (error instanceof DiscordAPIError && IGNORED_ERRORS.includes(+error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async deferUpdate(intr: MessageComponentInteraction): Promise<void> {
        try {
            return await intr.deferUpdate().then(() => { return; });
        } catch (error) {
            if (error instanceof DiscordAPIError && IGNORED_ERRORS.includes(+error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async send(
        intr: Interaction | MessageComponentInteraction,
        content: string | EmbedBuilder | InteractionReplyOptions,
        hidden: boolean = false
    ): Promise<Message> {
        try {
            if (intr.type === InteractionType.ApplicationCommandAutocomplete) return;
            let options: InteractionReplyOptions =
                typeof content === 'string'
                    ? { content }
                    : content instanceof EmbedBuilder
                    ? { embeds: [content] }
                    : content;
            if (intr.deferred || intr.replied) {
                return (await intr.followUp({
                    ...options,
                    ephemeral: hidden,
                })) as Message;
            } else {
                return (await intr.reply({
                    ...options,
                    ephemeral: hidden,
                    fetchReply: true,
                })) as Message;
            }
        } catch (error) {
            if (error instanceof DiscordAPIError && IGNORED_ERRORS.includes(+error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async editReply(
        intr: Interaction | MessageComponentInteraction,
        content: string | EmbedBuilder | WebhookEditMessageOptions
    ): Promise<Message> {
        try {
            if (intr.type === InteractionType.ApplicationCommandAutocomplete) return;
            let options: WebhookEditMessageOptions =
                typeof content === 'string'
                    ? { content }
                    : content instanceof EmbedBuilder
                    ? { embeds: [content] }
                    : content;
            return (await intr.editReply(options)) as Message;
        } catch (error) {
            if (error instanceof DiscordAPIError && IGNORED_ERRORS.includes(+error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }

    public static async update(
        intr: MessageComponentInteraction,
        content: string | EmbedBuilder | InteractionUpdateOptions
    ): Promise<Message> {
        try {
            let options: InteractionUpdateOptions =
                typeof content === 'string'
                    ? { content }
                    : content instanceof EmbedBuilder
                    ? { embeds: [content] }
                    : content;
            return (await intr.update({
                ...options,
                fetchReply: true,
            })) as Message;
        } catch (error) {
            if (error instanceof DiscordAPIError && IGNORED_ERRORS.includes(+error.code)) {
                return;
            } else {
                throw error;
            }
        }
    }
}
