import express from 'express';
import { Telegraf } from 'telegraf';
import { ConfigService } from './src/config.service.js';

const bootstrap = (configService) => {
    const bot = new Telegraf(configService.get(BOT_TOKEN));
    const app = express();

    bot.start((ctx) => ctx.reply('Бот запущен'));

    app.use(express.json());

    const secretPath = `/telegraf/${BOT_TOKEN}`;
    app.use(secretPath, (req, res) => {
        bot.handleUpdate(req.body, res);
    });
    app.get('/', (req, res) => {
        res.send('OK');
    });

    async function start() {
        const webhookUrl = `${RENDER_EXTERNAL_URL}${secretPath}`;

        await bot.telegram.setWebhook(webhookUrl);
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
            console.log(`Webhook: ${webhookUrl}`);
        });
    }

    start()
        .then(() => {
            console.log('bot started succesfully');
        })
        .catch((err) => {
            console.error('Startup error:', err);
            process.exit(1);
        });
};

bootstrap(new ConfigService());
