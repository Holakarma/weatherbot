import { config } from 'dotenv';
import 'dotenv/config';

export class ConfigService {
    constructor() {
        if (process.env.RENDER === 'true') {
            console.log('render.com deployment');
            this.config = process.env;
            this.config.DOMAIN = process.env.RENDER_EXTERNAL_URL;
        } else {
            const { error, parsed } = config();
            if (error) {
                throw new Error(
                    `Failed to load .env variables: ${error.message}`,
                );
            }
            if (!parsed) {
                throw new Error(`Failed to load .env variables`);
            }
            this.config = parsed;
        }
        this.validateConfig(this.config);
    }

    validateConfig(config) {
        if (!config.BOT_TOKEN) throw Error('BOT_TOKEN is required');
        if (!config.DOMAIN) throw new Error('DOMAIN is required');
    }

    get(key) {
        const res = this.config[key];
        if (!res) {
            throw new Error(`Failed to get .env variable: ${key}`);
        }
        return res;
    }
}
