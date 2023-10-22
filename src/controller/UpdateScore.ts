import { Request, Response } from "express";
import { BadRequestResponse, SuccessMsgResponse } from "../core/APIresponse";
import { Server } from "../loaders/Server";
import { BaseClass } from "./BaseClass";
import logger from "../loaders/Logger";


export class UpdateScore extends BaseClass {
    
    public async updateScore(req: Request, res: Response) {
        try {
            let gameName: string = this.getGameName(String(req.body.gameCode));
            let previousScore: number = await Server.instance.redis.zScore(gameName,req.body.userId);
            if (req.body.score > previousScore || previousScore === null) {
                await Server.instance.redis.zAdd(gameName,req.body.score, req.body.userId)
            }
            return new SuccessMsgResponse("Score updated").send(res);
        } catch (err) {
            logger.error("Err in updateScore : " + err.toString());
            return new BadRequestResponse(err.toString()).send(res);
        }
    }
}