import type { BotContext, TelegramBot } from '../types';
import { ensureTelegramUserExists } from './text.message.service';
import { TEXT_MESSAGE_COPY } from './text.message.ui';
import { WEATHER_HANDLER_COPY } from './weather.handler.ui';
import { buildWeatherReplyByLocation } from './weather.reply';

export const sendWeatherBySavedCity = async (ctx: BotContext): Promise<void> => {
    let savedCity: string | null = null;

    try {
        savedCity = await ensureTelegramUserExists(ctx);
    } catch (error) {
        console.error('Failed to sync telegram user', error);
        await ctx.reply(TEXT_MESSAGE_COPY.weatherRequestFailed);
        return;
    }

    if (!savedCity) {
        await ctx.reply(TEXT_MESSAGE_COPY.cityNotSaved);
        return;
    }

    const waitMsg = await ctx.reply(TEXT_MESSAGE_COPY.loadingWeather);

    try {
        const weatherPayload = await buildWeatherReplyByLocation(ctx, savedCity);

        if (!weatherPayload) {
            await ctx.reply(TEXT_MESSAGE_COPY.locationNotFound);
            return;
        }

        await ctx.reply(weatherPayload.message, {
            parse_mode: 'MarkdownV2',
        });
    } catch (error) {
        console.error('Failed to get weather by saved city', error);
        await ctx.reply(TEXT_MESSAGE_COPY.weatherRequestFailed);
    } finally {
        await ctx.deleteMessage(waitMsg.message_id);
    }
};

export const registerWeatherHandler = (bot: TelegramBot): void => {
    bot.hears(WEATHER_HANDLER_COPY.buttonMyCityWeather, async (ctx) => {
        await sendWeatherBySavedCity(ctx);
    });
};
