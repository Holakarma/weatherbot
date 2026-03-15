import { message } from 'telegraf/filters';
import type { TelegramBot } from '../types.js';
import {
    buildSaveCityKeyboard,
    consumePendingCitySelection,
    SAVE_CITY_ACTION_PATTERN,
} from './text.message.keyboard.js';
import {
    ensureTelegramUserExists,
    saveTelegramUserCity,
} from './text.message.service.js';
import { TEXT_MESSAGE_COPY } from './text.message.ui.js';
import { buildWeatherReplyByLocation } from './weather.reply.js';

export const registerTextMessageHandler = (bot: TelegramBot): void => {
    bot.action(SAVE_CITY_ACTION_PATTERN, async (ctx) => {
        const token = ctx.match[1];
        const pendingSelection = consumePendingCitySelection(token);

        if (!pendingSelection) {
            await ctx.answerCbQuery(TEXT_MESSAGE_COPY.saveCityExpired);
            return;
        }

        if (!ctx.from?.id || ctx.from.id !== pendingSelection.telegramId) {
            await ctx.answerCbQuery(TEXT_MESSAGE_COPY.saveCityForbidden);
            return;
        }

        try {
            await ensureTelegramUserExists(ctx);
            await saveTelegramUserCity(ctx, pendingSelection.city);
            await ctx.answerCbQuery(TEXT_MESSAGE_COPY.saveCitySuccess);
            await ctx.editMessageReplyMarkup(undefined);
        } catch (error) {
            console.error('Failed to save user city', error);
            await ctx.answerCbQuery(TEXT_MESSAGE_COPY.saveCityFailed);
        }
    });

    bot.on(message('text'), async (ctx) => {
        const location = ctx.message.text.trim();

        if (!location) {
            await ctx.reply(TEXT_MESSAGE_COPY.emptyLocation);
            return;
        }

        const waitMsg = await ctx.reply(TEXT_MESSAGE_COPY.loadingWeather);

        try {
            let savedUserCity: string | null = null;

            try {
                savedUserCity = await ensureTelegramUserExists(ctx);
            } catch (error) {
                console.error('Failed to sync telegram user', error);
            }

            const weatherPayload = await buildWeatherReplyByLocation(ctx, location);

            if (!weatherPayload) {
                await ctx.reply(TEXT_MESSAGE_COPY.locationNotFound);
                return;
            }

            const shouldShowSaveCityButton =
                Boolean(ctx.from?.id) && savedUserCity !== weatherPayload.cityName;

            if (shouldShowSaveCityButton) {
                await ctx.reply(weatherPayload.message, {
                    parse_mode: 'MarkdownV2',
                    ...buildSaveCityKeyboard(
                        ctx.from!.id,
                        weatherPayload.cityName,
                        TEXT_MESSAGE_COPY.saveCityButton,
                    ),
                });
                return;
            }

            await ctx.reply(weatherPayload.message, { parse_mode: 'MarkdownV2' });
        } catch (error) {
            console.error('Failed to get weather', error);
            await ctx.reply(TEXT_MESSAGE_COPY.weatherRequestFailed);
        } finally {
            await ctx.deleteMessage(waitMsg.message_id);
        }
    });
};
