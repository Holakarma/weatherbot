export const RUNTIME_MODE = Object.freeze({
    POLLING: 'polling',
    WEBHOOK: 'webhook',
});

export type RuntimeMode = (typeof RUNTIME_MODE)[keyof typeof RUNTIME_MODE];

interface ResolveRuntimeModeInput {
    nodeEnv?: string;
    lifecycleEvent?: string;
}

export const resolveRuntimeMode = ({
    nodeEnv = process.env.NODE_ENV,
    lifecycleEvent = process.env.npm_lifecycle_event,
}: ResolveRuntimeModeInput = {}): RuntimeMode => {
    const isProduction = nodeEnv === 'production';
    const isStartCommand = lifecycleEvent === 'start';

    if (isProduction || isStartCommand) {
        return RUNTIME_MODE.WEBHOOK;
    }

    return RUNTIME_MODE.POLLING;
};
