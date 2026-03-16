import { Markup, Telegraf } from 'telegraf';
import { WEATHER_HANDLER_COPY } from '../handlers/weather.handler.ui';
import { Command } from './register-commands';
import { BotContext } from '../types';

export const START_MESSAGE =
    'Просто отправь название города, а я подскажу, какая сейчас погода';

export class StartCommand implements Command {
    static command = 'start';

    constructor(private readonly bot: Telegraf<BotContext>) { }

    get description() {
        return {
            command: StartCommand.command,
            description: 'Показать кнопку'
        }
    }

    handle() {
        this.bot.start(async (ctx) => {
            await ctx.reply(
                START_MESSAGE,
                Markup.keyboard([[WEATHER_HANDLER_COPY.buttonMyCityWeather]]).resize(),
            )
        })
    };
}
