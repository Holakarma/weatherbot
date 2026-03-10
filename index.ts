import { bootstrap } from './src/app/bootstrap.js';

bootstrap().catch((error: unknown) => {
    console.error('Startup error:', error);
    process.exit(1);
});
