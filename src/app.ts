import express from 'express';
const app = express();
import 'dotenv/config';
import moduleRoutes from './modules/index';

// Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// All routes her...
app.use('/api/v1', moduleRoutes);

export default app;
