# Quran API

REST API for Quran application with surahs, ayahs, and search functionality.

## API Endpoints

- `GET /api/surahs` - Get all 114 surahs
- `GET /api/surahs/:id` - Get specific surah with all ayahs
- `GET /api/search?q=query` - Search ayahs by translation

## Local Development

```bash
npm install
npm run dev