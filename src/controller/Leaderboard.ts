import { Request, Response } from "express";
import logger from "../loaders/Logger";
import { BadRequestResponse, SuccessMsgResponse, SuccessResponse } from "../core/APIresponse";
import { Server } from "../loaders/Server";
import { IPlayerAroundLeaderboard } from "../interfaces/IPlayerAroundLeaderboard";
import config from "../config";


export class Leaderboard {

    public async updateScore(req: Request, res: Response) {
        try {
            let gameName: string = this.getGameName(String(req.body.gameCode));
            if (gameName === 'null') return new BadRequestResponse("Invalid gameCode").send(res);
            await Server.instance.redis.updateScore(
                gameName,
                req.body.userId,
                req.body.score
            );
            return new SuccessMsgResponse("Score updated").send(res);
        } catch (err) {
            logger.error("Err in updateScore : " + err.toString());
            return new BadRequestResponse(err.toString()).send(res);
        }
    }

    public async getPlayerRank(req: Request, res: Response) {
        try {
            let gameName: string = this.getGameName(String(req.query.gameCode));
            if (gameName === 'null') return new BadRequestResponse("Invalid gameCode").send(res);
            let rank: number = await Server.instance.redis.getRank(
                gameName,
                String(req.query.userId)
            )

            return new SuccessResponse("OK", { rank }).send(res);
        } catch (err) {
            logger.error("Err in getPlayerRank : " + err.toString());
            return new BadRequestResponse(err.toString()).send(res);
        }
    }

    public async getPlayerAroundLeaderboard(req: Request, res: Response) {
        try {
            let gameName: string = this.getGameName(String(req.query.gameCode));
            if (gameName === 'null') return new BadRequestResponse("Invalid gameCode").send(res);
            
            let playerAroundLeaderboard: IPlayerAroundLeaderboard[] = await Server.instance.redis.getPlayerAroundLeaderboard(
                gameName,
                String(req.query.userId)
            )

            return new SuccessResponse("OK", { playerAroundLeaderboard }).send(res);
        } catch (err) {
            logger.error("Err in getPlayerRank : " + err.toString());
            return new BadRequestResponse(err.toString()).send(res);
        }
    }

    private getGameName(gameCode: string): string {
        try {
            let gameName: string = config.gameCodeList[gameCode];
            if (!gameName) return 'null'
            return gameName
        } catch (err) {
            return 'null';
        }
    }
}