import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkConnection } from './src/config/db.js';
import { createTables } from './src/utils/dbUtils.js';
import userRoutes from './src/routes/userRoutes.js';
import jobRoutes from './src/routes/jobRoutes.js';
import applyRoutes from './src/routes/applyRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/apply', applyRoutes);

const PORT = process.env.PORT || 3005;

const startServer = async () => {
    await checkConnection();
    await createTables();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
};

startServer();
