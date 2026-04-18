import { FileLoader } from '../utils/fileLoader';
import { Surah, Ayah } from '../types';

export class SurahService {
  private fileLoader: FileLoader;

  constructor() {
    this.fileLoader = FileLoader.getInstance();
  }

  async getAllSurahs(): Promise<Surah[]> {
    const surahsMetadata = await this.fileLoader.loadSurahsMetadata();
    
    return surahsMetadata.map((surah: any) => ({
      id: surah.id,
      name: surah.name,
      englishName: surah.englishName,
      englishNameTranslation: surah.englishNameTranslation,
      revelationType: surah.revelationType,
      numberOfAyahs: surah.ayahCount || surah.numberOfAyahs
    }));
  }

  async getSurahById(id: number, translationLang: string = 'en'): Promise<Surah | null> {
    const surahs = await this.getAllSurahs();
    const surah = surahs.find(s => s.id === id);
    
    if (!surah) return null;

    const arabicData = await this.fileLoader.loadArabicQuran();
    const translationData = await this.fileLoader.loadTranslation(translationLang);
    
    const ayahs: Ayah[] = [];
    const surahAyahs = arabicData[id.toString()] || [];
    
    for (let i = 0; i < surahAyahs.length; i++) {
      const ayah = surahAyahs[i];
      const translation = translationData[id.toString()]?.[i]?.text || '';
      
      ayahs.push({
        chapter: ayah.chapter,
        verse: ayah.verse,
        text: ayah.text,
        translation: translation
      });
    }
    
    return {
      ...surah,
      ayahs
    };
  }
}