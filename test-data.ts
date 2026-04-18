import { FileLoader } from './src/utils/fileLoader';

async function testData() {
  const loader = FileLoader.getInstance();
  
  try {
    const surahs = await loader.loadSurahsMetadata();
    console.log('✅ Loaded', surahs.length, 'surahs');
   console.log('First surah:', surahs[0].translation);
    
    const arabic = await loader.loadArabicQuran();
    console.log('✅ Loaded Arabic Quran with', Object.keys(arabic).length, 'surahs');
    
    const translation = await loader.loadTranslation('en');
    console.log('✅ Loaded English translation');
    
    console.log('\n🎉 Data files are correctly configured!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testData();