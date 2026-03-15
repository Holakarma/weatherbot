import type { Context, Telegraf } from 'telegraf';
import type { AppSupabaseClient } from '../../integrations/supabase/supabase.client.js';
import type { WeatherApiClient } from '../../integrations/weather/weather-api.client.js';

export interface BotContext extends Context {
    weatherApiClient: WeatherApiClient;
    supabaseClient: AppSupabaseClient;
}

export type TelegramBot = Telegraf<BotContext>;

