// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import compression from 'compression';
// import rateLimit from 'express-rate-limit';
// import surahRoutes from './routes/surahRoutes';
// import searchRoutes from './routes/searchRoutes';
// import { errorHandler } from './middleware/errorHandler';

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Security middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));

// // Compression
// app.use(compression());

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP'
// });
// app.use('/api/', limiter);

// // Body parsing
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/surahs', surahRoutes);
// app.use('/api/search', searchRoutes);

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// // Error handling
// app.use(errorHandler);

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📖 Quran API ready at http://localhost:${PORT}`);
// });

// export default app;




import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import surahRoutes from './routes/surahRoutes';
import searchRoutes from './routes/searchRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration for Render
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (important for Render)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Quran API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      surahs: '/api/surahs',
      surahById: '/api/surahs/:id',
      search: '/api/search?q=query'
    },
    documentation: 'https://github.com/yourusername/quran-api-backend'
  });
});

// API Routes
app.use('/api/surahs', surahRoutes);
app.use('/api/search', searchRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handling
app.use(errorHandler);

// Start server - Important for Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📖 Quran API ready at http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});

export default app;