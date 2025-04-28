import express from 'express';
import adminRoutes from './routes/admin';

const app = express();

app.use(express.json());

// Admin routes
app.use('/api/admin', adminRoutes);

// ... existing code ...

export default app; 