import * as fs from 'fs';
import * as path from 'path';

const dataPath = path.join(__dirname, '../data');

function verifyFile(filename: string): boolean {
  const filePath = path.join(dataPath, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing: ${filename}`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    console.log(`✅ Valid JSON: ${filename}`);
    
    // Show basic stats
    const surahCount = Object.keys(data).length;
    console.log(`   - Contains ${surahCount} surahs`);
    
    // Show first surah example
    const firstSurah = Object.keys(data)[0];
    const ayahCount = data[firstSurah].length;
    console.log(`   - First surah has ${ayahCount} verses`);
    
    return true;
  } catch (error) {
    console.error(`❌ Invalid JSON: ${filename}`, error);
    return false;
  }
}

function verifyChaptersFile(): boolean {
  const filePath = path.join(dataPath, 'chapters/index.json');
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing: chapters/index.json`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    console.log(`✅ Valid JSON: chapters/index.json`);
    console.log(`   - Contains ${data.length} surahs`);
    console.log(`   - Example: ${data[0].englishName} (${data[0].name})`);
    return true;
  } catch (error) {
    console.error(`❌ Invalid JSON: chapters/index.json`, error);
    return false;
  }
}

console.log('\n📖 Verifying Quran Data Files...\n');

const files = ['quran.json', 'quran_en.json'];
const allValid = files.every(verifyFile);
const chaptersValid = verifyChaptersFile();

if (allValid && chaptersValid) {
  console.log('\n✅ All data files are valid!\n');
} else {
  console.log('\n❌ Some files are missing or invalid!\n');
}