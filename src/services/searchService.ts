import { FileLoader } from '../utils/fileLoader';
import { SearchResult } from '../types';

export class SearchService {
  private fileLoader: FileLoader;
  private searchCache: Map<string, SearchResult[]> = new Map();

  constructor() {
    this.fileLoader = FileLoader.getInstance();
  }

  async searchTranslation(query: string, language: string = 'en'): Promise<SearchResult[]> {
    const cacheKey = `${query}_${language}`;
    
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey)!;
    }

    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const translationData = await this.fileLoader.loadTranslation(language);
    const surahsMetadata = await this.fileLoader.loadSurahsMetadata();
    
    const results: SearchResult[] = [];
    
    for (const [surahId, ayahs] of Object.entries(translationData)) {
      const surah = surahsMetadata.find((s: any) => s.id === parseInt(surahId));
      if (!surah) continue;
      
      const ayahArray = ayahs as any[];
      
      for (let i = 0; i < ayahArray.length; i++) {
        const ayah = ayahArray[i];
        if (ayah.text && ayah.text.toLowerCase().includes(searchTerm)) {
          results.push({
            surahId: parseInt(surahId),
            surahName: surah.englishName,
            verseNumber: ayah.verse,
            text: '', // Arabic text not included in search results for performance
            translation: ayah.text
          });
          
          if (results.length >= 100) break;
        }
      }
      
      if (results.length >= 100) break;
    }
    
    // Cache results for 5 minutes
    this.searchCache.set(cacheKey, results);
    setTimeout(() => this.searchCache.delete(cacheKey), 5 * 60 * 1000);
    
    return results;
  }
}