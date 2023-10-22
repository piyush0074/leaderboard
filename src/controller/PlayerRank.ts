import { Request, Response } from "express";
import { BaseClass } from "./BaseClass";
import { BadRequestResponse } from "../core/APIresponse";
import { Server } from "../loaders/Server";
import { SuccessResponse } from "../core/APIresponse";
import logger from "../loaders/Logger";


export class PlayerRank extends BaseClass {

    public async playerRank(req: Request, res: Response) {
        try {
            let gameName: string = this.getGameName(String(req.query.gameCode));

            let rank: number = await Server.instance.redis.zRank(
                gameName,
                String(req.query.userId)
            )

            return new SuccessResponse("OK", { rank }).send(res);
        } catch (err) {
            logger.error("Err in getPlayerRank : " + err.toString());
            return new BadRequestResponse(err.toString()).send(res);
        }
    }
}