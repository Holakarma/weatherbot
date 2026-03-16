import { escapeMarkdownV2 } from '../../../shared/escape-markdown-v2';

export const TEXT_MESSAGE_COPY = {
    emptyLocation: 'Отправь название города',
    loadingWeather: 'Узнаю погоду...',
    locationNotFound: 'Не нашёл такой город. Попробуй уточнить название.',
    weatherRequestFailed: 'Не получилось получить погоду. Попробуй позже.',
    cityNotSaved: 'Город не сохранён. Отправь название города и нажми «Сохранить город».',
    saveCityButton: 'Сохранить город',
    saveCitySuccess: 'Город сохранён',
    saveCityFailed: 'Ошибка при сохранении города.',
    saveCityExpired: 'Истёк срок кнопки.',
    saveCityForbidden: 'Эта кнопка не для тебя.',
    weatherLabel: 'Температура',
    feelsLikeLabel: 'Ощущается как',
    noData: 'Нет данных',
} as const;

export const formatWeatherMessage = (
    locationName: string,
    description: string,
    temp: number,
    feelsLike: number,
): string =>
    `*${escapeMarkdownV2(locationName)}*\n` +
    `_${escapeMarkdownV2(description)}_\n` +
    `${TEXT_MESSAGE_COPY.weatherLabel}: _${escapeMarkdownV2(temp.toFixed(1))}°C_\n` +
    `${TEXT_MESSAGE_COPY.feelsLikeLabel}: _${escapeMarkdownV2(feelsLike.toFixed(1))}°C_`;
