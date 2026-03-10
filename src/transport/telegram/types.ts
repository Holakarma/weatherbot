import type { Context, Telegraf } from 'telegraf';
import type { WeatherApiClient } from '../../integrations/weather-api.client.js';

export interface BotContext extends Context {
    weatherApiClient: WeatherApiClient;
}

export type TelegramBot = Telegraf<BotContext>;
