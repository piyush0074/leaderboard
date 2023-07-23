import { Router } from 'express';
import { Leaderboard } from '../../controller/Leaderboard';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
    app.use('/leaderboard', route);

    let leaderboardController = new Leaderboard();

    route.post('/updatescore',
        middlewares.LeaderboardReqValidate.updateScoreRequest,
        (req, res) => {
            leaderboardController.updateScore(req, res);
        }
    );

    route.get('/getplayerrank',
        middlewares.LeaderboardReqValidate.playerRankRequest,
        (req, res) => {
            leaderboardController.getPlayerRank(req, res);
        }
    );

    route.get('/getplayeraroundleaderboard',
        middlewares.LeaderboardReqValidate.playerAroundLeaderboardRequest,
        (req, res) => {
            leaderboardController.getPlayerAroundLeaderboard(req, res);
        }
    )
}