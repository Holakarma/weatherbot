export type QueryParams = Record<string, string | number>;

export type FetchLike = (
    input: string | URL | Request,
    init?: RequestInit,
) => Promise<Response>;

export interface Coordinates {
    lat: number;
    lon: number;
}

export interface GeocodeLocalNames {
    ascii?: string;
    feature_name?: string;
    ar?: string;
    ba?: string;
    be?: string;
    ca?: string;
    cs?: string;
    de?: string;
    en?: string;
    eo?: string;
    es?: string;
    et?: string;
    fa?: string;
    fi?: string;
    fr?: string;
    he?: string;
    hr?: string;
    hy?: string;
    ja?: string;
    ka?: string;
    ko?: string;
    ky?: string;
    lt?: string;
    os?: string;
    pl?: string;
    pt?: string;
    ru?: string;
    sr?: string;
    tt?: string;
    uk?: string;
    uz?: string;
    zh?: string;
    [localeCode: string]: string | undefined;
}

export interface GeocodeApiItem {
    name: string;
    local_names?: GeocodeLocalNames;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}

export type GeocodeApiResponse = GeocodeApiItem[];

export interface WeatherCoord {
    lon: number;
    lat: number;
}

export interface WeatherMainBlock {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
}

export interface WeatherCondition {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface WeatherWind {
    speed: number;
    deg: number;
    gust?: number;
}

export interface WeatherClouds {
    all: number;
}

export interface WeatherSys {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
}

export interface GeocodeLocation {
    name: string;
    nameRu: string | null;
    country: string;
    state: string | null;
    lat: number;
    lon: number;
}

export interface CurrentWeatherResponse {
    coord: WeatherCoord;
    base: string;
    name: string;
    dt: number;
    weather: WeatherCondition[];
    main: WeatherMainBlock;
    visibility: number;
    wind: WeatherWind;
    clouds: WeatherClouds;
    sys: WeatherSys;
    timezone: number;
    id: number;
    cod: number;
}

export interface WeatherApiClientOptions {
    token: string;
    fetchImpl?: FetchLike;
}
