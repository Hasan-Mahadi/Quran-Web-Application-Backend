import * as fs from "fs";
import * as path from "path";

export class FileLoader {
  private static instance: FileLoader;
  private dataPath: string;
  private cache: Map<string, any> = new Map();

  private constructor() {
    // Different path handling for Vercel
    if (process.env.VERCEL) {
      // In Vercel, files are in the root or .vercel/output
      this.dataPath = path.join(process.cwd(), "src/data");
    } else {
      this.dataPath = path.join(__dirname, "../data");
    }
  }

  public static getInstance(): FileLoader {
    if (!FileLoader.instance) {
      FileLoader.instance = new FileLoader();
    }
    return FileLoader.instance;
  }

  async loadJSON(filename: string): Promise<any> {
    if (this.cache.has(filename)) {
      return this.cache.get(filename);
    }

    try {
      let filePath: string;

      if (filename === "chapters/index.json") {
        filePath = path.join(this.dataPath, filename);
      } else {
        filePath = path.join(this.dataPath, filename);
      }

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        throw new Error(`File not found: ${filename}`);
      }

      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      this.cache.set(filename, data);
      return data;
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      throw new Error(`Failed to load ${filename}`);
    }
  }

  async loadSurahsMetadata(): Promise<any[]> {
    const possiblePaths = [
      "chapters/index.json",
      "chapters.json",
      "surahs.json",
    ];

    for (const filePath of possiblePaths) {
      try {
        const data = await this.loadJSON(filePath);
        if (data && Array.isArray(data)) {
          return data;
        }
      } catch (error) {
        continue;
      }
    }

    throw new Error("Could not find surahs metadata file");
  }

  async loadArabicQuran(): Promise<any> {
    return await this.loadJSON("quran.json");
  }

  async loadTranslation(language: string = "en"): Promise<any> {
    const translationFile =
      language === "bn" ? "quran_bn.json" : "quran_en.json";
    return await this.loadJSON(translationFile);
  }

  clearCache(): void {
    this.cache.clear();
  }
}
