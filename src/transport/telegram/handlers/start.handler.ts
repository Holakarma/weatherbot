import { Markup } from 'telegraf';
import type { TelegramBot } from '../types.js';
import { WEATHER_HANDLER_COPY } from './weather.handler.ui.js';

export const START_MESSAGE =
    'Просто отправь название города, а я подскажу, какая сейчас погода';

export const registerStartHandler = (bot: TelegramBot): void => {
    bot.start((ctx) =>
        ctx.reply(
            START_MESSAGE,
            Markup.keyboard([[WEATHER_HANDLER_COPY.buttonMyCityWeather]]).resize(),
        ),
    );
};
