import express from 'express';
import { Telegraf } from 'telegraf';
import { ConfigService } from './src/config.service.js';

const bootstrap = (configService) => {
    const botToken = configService.get('BOT_TOKEN');
    const bot = new Telegraf(botToken);
    const app = express();

    const port = Number(configService.getOptional('PORT', 3000));
    const domain = configService.getOptional('DOMAIN');
    const isProductionStart =
        process.env.NODE_ENV === 'production' ||
        process.env.npm_lifecycle_event === 'start';

    bot.start((ctx) => ctx.reply('Bot started'));

    async function startPolling() {
        await bot.telegram.deleteWebhook();
        await bot.launch();
        console.log('Bot started in polling mode');
    }

    async function startWebhook() {
        if (!domain) {
            throw new Error('DOMAIN is required for webhook mode');
        }

        app.use(express.json());

        const secretPath = `/telegraf/${botToken}`;
        app.use(secretPath, (req, res) => {
            bot.handleUpdate(req.body, res);
        });
        app.get('/', (_req, res) => {
            res.send('OK');
        });

        const normalizedDomain = domain.endsWith('/')
            ? domain.slice(0, -1)
            : domain;
        const webhookUrl = `${normalizedDomain}${secretPath}`;
        await bot.telegram.setWebhook(webhookUrl);

        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
            console.log(`Webhook mode enabled: ${webhookUrl}`);
        });
    }

    async function start() {
        if (isProductionStart) {
            await startWebhook();
            return;
        }

        await startPolling();
    }

    start()
        .then(() => {
            console.log('Bot started successfully');
        })
        .catch((err) => {
            console.error('Startup error:', err);
            process.exit(1);
        });

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
};

bootstrap(new ConfigService());
