import { randomBytes } from 'node:crypto';
import { Markup } from 'telegraf';

export const SAVE_CITY_ACTION_PATTERN = /^save_city:([a-f0-9]{16})$/;

const SAVE_CITY_CALLBACK_PREFIX = 'save_city:';
const SAVE_CITY_CALLBACK_TTL_MS = 30 * 60 * 1000;

export interface PendingCitySelection {
    telegramId: number;
    city: string;
    createdAt: number;
}

const pendingCitySelections = new Map<string, PendingCitySelection>();

const pruneExpiredPendingCitySelections = (): void => {
    const now = Date.now();

    for (const [token, selection] of pendingCitySelections.entries()) {
        if (now - selection.createdAt > SAVE_CITY_CALLBACK_TTL_MS) {
            pendingCitySelections.delete(token);
        }
    }
};

const buildSaveCityCallbackData = (telegramId: number, city: string): string => {
    pruneExpiredPendingCitySelections();

    const token = randomBytes(8).toString('hex');

    pendingCitySelections.set(token, {
        telegramId,
        city,
        createdAt: Date.now(),
    });

    return `${SAVE_CITY_CALLBACK_PREFIX}${token}`;
};

export const buildSaveCityKeyboard = (
    telegramId: number,
    city: string,
    buttonText: string,
) =>
    Markup.inlineKeyboard([
        [Markup.button.callback(buttonText, buildSaveCityCallbackData(telegramId, city))],
    ]);

export const consumePendingCitySelection = (token: string): PendingCitySelection | null => {
    const selection = pendingCitySelections.get(token);

    if (!selection) {
        return null;
    }

    pendingCitySelections.delete(token);

    if (Date.now() - selection.createdAt > SAVE_CITY_CALLBACK_TTL_MS) {
        return null;
    }

    return selection;
};
