import { Telegraf } from 'telegraf';
import type { WeatherApiClient } from '../../integrations/weather-api.client.js';
import { registerStartHandler } from './handlers/start.handler.js';
import { registerTextMessageHandler } from './handlers/text.message.js';
import type { BotContext, TelegramBot } from './types.js';

interface CreateBotInput {
    token: string;
    weatherApiClient: WeatherApiClient;
}

export const createBot = ({
    token,
    weatherApiClient,
}: CreateBotInput): TelegramBot => {
    const bot = new Telegraf<BotContext>(token);

    bot.context.weatherApiClient = weatherApiClient;

    registerStartHandler(bot);
    registerTextMessageHandler(bot);

    return bot;
};
