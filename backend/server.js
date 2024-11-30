import express from 'express';
import cors from 'cors';

require('dotenv').config();
const bodyParser = require('body-parser');
import audioRoutes from './routes/audioRoutes.js';
import transcribeRoutes from './routes/transcribeRoutes.js';

const app = express();


app.use(cors());
app.use(json());


app.use('/api/audio', audioRoutes);
app.use('/api/transcribe', transcribeRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
