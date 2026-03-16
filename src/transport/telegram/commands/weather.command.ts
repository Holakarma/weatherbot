import { Telegraf } from "telegraf";
import { sendWeatherBySavedCity } from "../handlers/weather.handler";
import { BotContext } from "../types";
import { Command } from "./register-commands";

export class WeatherCommand implements Command {
    static commad = 'weather'

    constructor(private readonly bot: Telegraf<BotContext>) { }

    get description() {
        return {
            command: WeatherCommand.commad,
            description: 'Погода в моём городе'
        }
    }

    handle() {
        this.bot.command(WeatherCommand.commad, async (ctx) => {
            await sendWeatherBySavedCity(ctx);
        });
    }
}