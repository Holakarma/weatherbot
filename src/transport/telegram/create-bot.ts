import { Telegraf } from 'telegraf';
import type { AppSupabaseClient } from '../../integrations/supabase/supabase.client';
import type { WeatherApiClient } from '../../integrations/weather/weather-api.client';
import { registerTextMessageHandler } from './handlers/text.message';
import { registerWeatherHandler } from './handlers/weather.handler';
import type { BotContext, TelegramBot } from './types';
import { StartCommand } from './commands/start.command';
import registerCommands from './commands/register-commands';
import { WeatherCommand } from './commands/weather.command';

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

    const startCommand = new StartCommand(bot);
    const weatherCommand = new WeatherCommand(bot);

    registerCommands(bot, [startCommand, weatherCommand]);

    registerWeatherHandler(bot);
    registerTextMessageHandler(bot);

    return bot;
};
