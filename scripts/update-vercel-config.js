import fs from 'node:fs';
import path from 'node:path';

const config_file = '.vercel/output/config.json';
const config = JSON.parse(fs.readFileSync(config_file, 'utf8'));

config.images = {
	sizes: [64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
	domains: ['public.blob.vercel-storage.com'],
	formats: ['image/avif', 'image/webp'],
	minimumCacheTTL: 300
};

fs.writeFileSync(config_file, JSON.stringify(config, null, '\t'));
