import { Request, Response } from 'express';
import { SurahService } from '../services/surahService';
import { ApiResponse } from '../types';

const surahService = new SurahService();

export class SurahController {
  async getAllSurahs(req: Request, res: Response) {
    try {
      const surahs = await surahService.getAllSurahs();
      
      const response: ApiResponse<typeof surahs> = {
        success: true,
        data: surahs,
        total: surahs.length
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch surahs'
      });
    }
  }

  async getSurahById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const translationLang = (req.query.lang as string) || 'en';
      
      if (isNaN(id) || id < 1 || id > 114) {
        return res.status(400).json({
          success: false,
          error: 'Invalid surah ID'
        });
      }
      
      const surah = await surahService.getSurahById(id, translationLang);
      
      if (!surah) {
        return res.status(404).json({
          success: false,
          error: 'Surah not found'
        });
      }
      
      const response: ApiResponse<typeof surah> = {
        success: true,
        data: surah
      };
      
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch surah'
      });
    }
  }
}