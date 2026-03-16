import type { BotContext } from '../types';
import { formatWeatherMessage, TEXT_MESSAGE_COPY } from './text.message.ui';

export interface WeatherReplyPayload {
    cityName: string;
    message: string;
}

export const buildWeatherReplyByLocation = async (
    ctx: BotContext,
    location: string,
): Promise<WeatherReplyPayload | null> => {
    const geocodedLocation = await ctx.weatherApiClient.geocode(location);

    if (!geocodedLocation) {
        return null;
    }

    const weather = await ctx.weatherApiClient.getWeather({
        lat: geocodedLocation.lat,
        lon: geocodedLocation.lon,
    });

    const weatherDescription =
        weather.weather[0]?.description ?? TEXT_MESSAGE_COPY.noData;

    return {
        cityName: geocodedLocation.name,
        message: formatWeatherMessage(
            `${geocodedLocation.name}, ${geocodedLocation.country}`,
            weatherDescription,
            weather.main.temp,
            weather.main.feels_like,
        ),
    };
};
