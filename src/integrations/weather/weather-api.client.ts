import type {
    Coordinates,
    CurrentWeatherResponse,
    FetchLike,
    GeocodeApiResponse,
    GeocodeLocation,
    QueryParams,
    WeatherApiClientOptions,
} from './weather-api.types';
export type {
    Coordinates,
    CurrentWeatherResponse,
    FetchLike,
    GeocodeApiItem,
    GeocodeApiResponse,
    GeocodeLocalNames,
    GeocodeLocation,
    QueryParams,
    WeatherApiClientOptions,
    WeatherClouds,
    WeatherCondition,
    WeatherCoord,
    WeatherMainBlock,
    WeatherSys,
    WeatherWind,
} from './weather-api.types';

const GEO_API_URL = 'http://api.openweathermap.org/geo/1.0/direct';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const buildUrl = (baseUrl: string, params: QueryParams): string => {
    const url = new URL(baseUrl);

    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
    }

    return url.toString();
};

const assertCoordinates = ({ lat, lon }: Coordinates): void => {
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        throw new Error('lat and lon are required numeric values');
    }
};

export class WeatherApiClient {
    token: string;
    fetchImpl: FetchLike;

    constructor({ token, fetchImpl = fetch }: WeatherApiClientOptions) {
        if (!token) {
            throw new Error('WEATHER_API_TOKEN is required');
        }

        if (typeof fetchImpl !== 'function') {
            throw new Error('A valid fetch implementation is required');
        }

        this.token = token;
        this.fetchImpl = fetchImpl;
    }

    async geocode(location: string): Promise<GeocodeLocation | null> {
        if (!location || !location.trim()) {
            throw new Error('location is required for geocoding');
        }

        const url = buildUrl(GEO_API_URL, {
            appid: this.token,
            q: location.trim(),
        });
        const response = await this.fetchImpl(url);

        if (!response.ok) {
            throw new Error(
                `Geocoding request failed: ${response.status} ${response.statusText}`,
            );
        }

        const result = (await response.json()) as GeocodeApiResponse;

        if (!Array.isArray(result) || result.length === 0) {
            return null;
        }

        const [firstMatch] = result;

        return {
            name: firstMatch.name,
            nameRu: firstMatch.local_names?.ru ?? null,
            country: firstMatch.country,
            state: firstMatch.state ?? null,
            lat: firstMatch.lat,
            lon: firstMatch.lon,
        };
    }

    async getWeather({ lat, lon }: Coordinates): Promise<CurrentWeatherResponse> {
        assertCoordinates({ lat, lon });

        const url = buildUrl(WEATHER_API_URL, {
            lat,
            lon,
            appid: this.token,
            units: 'metric',
            lang: 'ru',
        });
        const response = await this.fetchImpl(url);

        if (!response.ok) {
            throw new Error(
                `Weather request failed: ${response.status} ${response.statusText}`,
            );
        }

        return (await response.json()) as CurrentWeatherResponse;
    }
}

export const createWeatherApiClient = ({ token, fetchImpl }: WeatherApiClientOptions) =>
    new WeatherApiClient({ token, fetchImpl });
