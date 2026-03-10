import type { TelegramBot } from '../types.js';

export const START_MESSAGE =
    'Просто отправь название города, а я подскажу, какая сейчас погода';

export const registerStartHandler = (bot: TelegramBot): void => {
    bot.start((ctx) => ctx.reply(START_MESSAGE));
};
