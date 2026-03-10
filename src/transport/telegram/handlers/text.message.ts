import { message } from 'telegraf/filters';
import { escapeMarkdownV2 } from '../../../shared/escape-markdown-v2.js';
import type { TelegramBot } from '../types.js';

const formatWeatherMessage = (
    locationName: string,
    description: string,
    temp: number,
    feelsLike: number,
): string =>
    `*${escapeMarkdownV2(locationName)}*\n` +
    `_${escapeMarkdownV2(description)}_\n` +
    `Температура: _${escapeMarkdownV2(temp.toFixed(1))}°C_\n` +
    `Ощущается как: _${escapeMarkdownV2(feelsLike.toFixed(1))}°C_`;

export const registerTextMessageHandler = (bot: TelegramBot): void => {
    bot.on(message('text'), async (ctx) => {
        const location = ctx.message.text.trim();

        if (!location) {
            await ctx.reply('Отправь название города');
            return;
        }

        const waitMsg = await ctx.reply('Узнаю погоду...');

        try {
            const geocodedLocation = await ctx.weatherApiClient.geocode(location);

            if (!geocodedLocation) {
                await ctx.reply(
                    'Не нашёл такой город. Попробуй уточнить название.',
                );
                return;
            }

            const weather = await ctx.weatherApiClient.getWeather({
                lat: geocodedLocation.lat,
                lon: geocodedLocation.lon,
            });

            const weatherDescription =
                weather.weather[0]?.description ?? 'нет данных';

            await ctx.reply(
                formatWeatherMessage(
                    `${geocodedLocation.name}, ${geocodedLocation.country}`,
                    weatherDescription,
                    weather.main.temp,
                    weather.main.feels_like,
                ),
                { parse_mode: 'MarkdownV2' },
            );
        } catch (error) {
            console.error('Failed to get weather', error);
            await ctx.reply('Не получилось получить погоду. Попробуй позже.');
        } finally {
            await ctx.deleteMessage(waitMsg.message_id);
        }
    });
};
