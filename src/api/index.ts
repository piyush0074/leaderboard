import { Router } from 'express';
import Leaderboard from './routes/Leaderboard';

export default () => {
    const app = Router();

    Leaderboard(app);

    return app;
}