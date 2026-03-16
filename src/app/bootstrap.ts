import type { Server } from 'node:http';
import { loadConfig } from '../config/env';
import { createWeatherApiClient } from '../integrations/weather/weather-api.client';
import { runPolling } from '../transport/polling/runner';
import { createBot } from '../transport/telegram/create-bot';
import { runWebhookServer } from '../transport/webhook/server';
import { createLogger } from '../shared/logger';
import { RUNTIME_MODE, resolveRuntimeMode } from './runtime-mode';
import { createSupabaseClient } from '../integrations/supabase/supabase.client';

export const bootstrap = async (): Promise<void> => {
    const logger = createLogger();
    const config = loadConfig();
    const mode = resolveRuntimeMode();
    const weatherApiClient = createWeatherApiClient({
        token: config.weatherApiToken,
    });
    const supabaseClient = createSupabaseClient({
        url: config.supabaseUrl,
        anonKey: config.supabaseAnonKey,
    });
    const bot = createBot({
        token: config.botToken,
        weatherApiClient,
        supabaseClient,
    });

    let webhookServer: Server | null = null;

    if (mode === RUNTIME_MODE.WEBHOOK) {
        webhookServer = await runWebhookServer({
            bot,
            domain: config.domain,
            token: config.botToken,
            port: config.port,
            logger,
        });
    } else {
        await runPolling({ bot, logger });
    }

    logger.info(`Bot started successfully (${mode})`);

    const shutdown = (signal: NodeJS.Signals): void => {
        logger.info(`Received ${signal}. Shutting down`);

        if (webhookServer) {
            webhookServer.close(() => {
                logger.info('Webhook server stopped');
            });
        }

        bot.stop(signal);
    };

    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
};

