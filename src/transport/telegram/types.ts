import type { Context, Telegraf } from 'telegraf';
import type { AppSupabaseClient } from '../../integrations/supabase/supabase.client';
import type { WeatherApiClient } from '../../integrations/weather/weather-api.client';

export interface BotContext extends Context {
    weatherApiClient: WeatherApiClient;
    supabaseClient: AppSupabaseClient;
}

export type TelegramBot = Telegraf<BotContext>;

