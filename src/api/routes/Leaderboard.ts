import { Router } from 'express';
import middlewares from '../middlewares';
import { UpdateScore } from '../../controller/UpdateScore';
import { PlayerRank } from '../../controller/PlayerRank';
import { PlayerAroundLeaderboard } from '../../controller/PlayerAroundLeaderboard';

const route = Router();

export default (app: Router) => {
    app.use('/leaderboard', route);

    let updateScoreController = new UpdateScore();
    let playerRankController = new PlayerRank();
    let playerAroundLeaderboardController = new PlayerAroundLeaderboard();

    route.post('/updatescore',
        middlewares.LeaderboardReqValidate.updateScoreRequest,
        (req, res) => {
            updateScoreController.updateScore(req, res);
        }
    );

    route.get('/playerrank',
        middlewares.LeaderboardReqValidate.playerRankRequest,
        (req, res) => {
            playerRankController.playerRank(req, res);
        }
    );

    route.get('/playeraroundleaderboard',
        middlewares.LeaderboardReqValidate.playerAroundLeaderboardRequest,
        (req, res) => {
            playerAroundLeaderboardController.playerAroundLeaderboard(req, res);
        }
    )
}