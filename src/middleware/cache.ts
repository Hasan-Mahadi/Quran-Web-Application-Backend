import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

export const cacheMiddleware = (duration: number = 300) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
    
    const originalJson = res.json;
    res.json = function(body) {
      cache.set(key, body, duration);
      return originalJson.call(this, body);
    };
    
    next();
  };
};