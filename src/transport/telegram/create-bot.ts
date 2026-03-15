import { Telegraf } from 'telegraf';
import type { AppSupabaseClient } from '../../integrations/supabase/supabase.client.js';
import type { WeatherApiClient } from '../../integrations/weather/weather-api.client.js';
import { registerStartHandler } from './handlers/start.handler.js';
import { registerTextMessageHandler } from './handlers/text.message.js';
import { registerWeatherHandler } from './handlers/weather.handler.js';
import type { BotContext, TelegramBot } from './types.js';

interface CreateBotInput {
    token: string;
    weatherApiClient: WeatherApiClient;
    supabaseClient: AppSupabaseClient;
}

export const createBot = ({
    token,
    weatherApiClient,
    supabaseClient,
}: CreateBotInput): TelegramBot => {
    const bot = new Telegraf<BotContext>(token);

    bot.context.weatherApiClient = weatherApiClient;
    bot.context.supabaseClient = supabaseClient;

    registerStartHandler(bot);
    registerWeatherHandler(bot);
    registerTextMessageHandler(bot);

    return bot;
};
