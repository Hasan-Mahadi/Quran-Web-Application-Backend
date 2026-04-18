import { Request, Response } from 'express';
import { SearchService } from '../services/searchService';
import { ApiResponse } from '../types';

const searchService = new SearchService();

export class SearchController {
  async search(req: Request, res: Response) {
    try {
      const query = req.query.q as string;
      const language = (req.query.lang as string) || 'en';
      
      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }
      
      const results = await searchService.searchTranslation(query, language);
      
      const response: ApiResponse<typeof results> = {
        success: true,
        data: results,
        total: results.length
      };
      
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Search failed'
      });
    }
  }
}