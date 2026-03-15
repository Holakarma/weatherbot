import type { BotContext } from '../types.js';

const isDuplicateKeyError = (error: { code?: string; message: string }): boolean =>
    error.code === '23505' || error.message.includes('duplicate key value');

const isMissingIdError = (error: { code?: string; message: string }): boolean =>
    (error.code === '23502' && error.message.includes('"id"')) ||
    error.message.includes('null value in column "id"');

const fetchUserByTelegramId = async (
    ctx: BotContext,
    telegramId: number,
): Promise<{ city: string | null } | null> => {
    const { data, error } = await ctx.supabaseClient
        .from('users')
        .select('city')
        .eq('telegram_id', telegramId)
        .maybeSingle();

    if (error) {
        throw new Error(`Failed to check user by telegram_id: ${error.message}`);
    }

    return data;
};

export const ensureTelegramUserExists = async (
    ctx: BotContext,
): Promise<string | null> => {
    const telegramId = ctx.from?.id;

    if (!telegramId) {
        return null;
    }

    const existingUser = await fetchUserByTelegramId(ctx, telegramId);

    if (existingUser) {
        return existingUser.city;
    }

    const { error: insertError } = await ctx.supabaseClient
        .from('users')
        .insert({ telegram_id: telegramId });

    if (!insertError) {
        return null;
    }

    if (isDuplicateKeyError(insertError)) {
        const userAfterDuplicate = await fetchUserByTelegramId(ctx, telegramId);
        return userAfterDuplicate?.city ?? null;
    }

    if (!isMissingIdError(insertError)) {
        throw new Error(`Failed to create user: ${insertError.message}`);
    }

    const { error: fallbackInsertError } = await ctx.supabaseClient
        .from('users')
        .insert({ id: telegramId, telegram_id: telegramId });

    if (!fallbackInsertError) {
        return null;
    }

    if (isDuplicateKeyError(fallbackInsertError)) {
        const userAfterFallbackDuplicate = await fetchUserByTelegramId(ctx, telegramId);
        return userAfterFallbackDuplicate?.city ?? null;
    }

    throw new Error(`Failed to create user: ${fallbackInsertError.message}`);
};

export const saveTelegramUserCity = async (
    ctx: BotContext,
    city: string,
): Promise<void> => {
    const telegramId = ctx.from?.id;

    if (!telegramId) {
        return;
    }

    const { error } = await ctx.supabaseClient
        .from('users')
        .update({ city })
        .eq('telegram_id', telegramId);

    if (error) {
        throw new Error(`Failed to save city: ${error.message}`);
    }
};
