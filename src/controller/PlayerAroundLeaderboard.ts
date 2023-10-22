import { Request, Response } from "express";
import { BaseClass } from "./BaseClass";
import { BadRequestResponse } from "../core/APIresponse";
import { IPlayerAroundLeaderboard } from "../interfaces/IPlayerAroundLeaderboard";
import { SuccessResponse } from "../core/APIresponse";
import logger from "../loaders/Logger";
import { Server } from "../loaders/Server";

export class PlayerAroundLeaderboard extends BaseClass {

    public async playerAroundLeaderboard(req: Request, res: Response) {
        try {
            let gameName: string = this.getGameName(String(req.query.gameCode));


            let score: number = Number(await Server.instance.redis.zScore(gameName, String(req.query.userId)));
            let min: number = score - 50;
            let max: number = score + 50;

            let userData: string[] = await Server.instance.redis.zRangeByScore(gameName,min, max);

            let usersId: string [] =[];
            let userScores: {[id:string]: number} = {};
            
            for(let index = 0;index< userData.length; index++){
                if(index %2 === 0) {
                    usersId.push(userData[index]);
                    userScores[userData[index]] = Number(userData[index+1]);
                }
            }
            if(userData.length > 10) {
                usersId = await this.removeExcessUserId(usersId,String(req.query.userId));
            }
            
            let playerAroundLeaderboard:IPlayerAroundLeaderboard[] = [];
            for(let id of usersId) {
                let rank: number = Number(await Server.instance.redis.zRank(gameName,id)) + 1;
                playerAroundLeaderboard.push({
                    userId: id,
                    rank,
                    score: userScores[id]
                })
            }

            return new SuccessResponse("OK", { playerAroundLeaderboard }).send(res);
        } catch (err) {
            logger.error("Err in getPlayerRank : " + err.toString());
            return new BadRequestResponse(err.toString()).send(res);
        }
    }

    private removeExcessUserId(usersId: string[], userId: string):Promise<string[]>{
        return new Promise(async(resolve, reject) => {
            try {
                let start: number = 0;
                let end: number  = 0;
                
                let size: number = usersId.length;
                let userIdIndex = usersId.indexOf(userId);

                let leaderboardUsersId: string[] = [];
                
                start = userIdIndex - 4;
                if(start < 0) start = 0;
                
                end = userIdIndex + 6;
                if(end > size) end =size;

                if(userIdIndex - start < 4) end = end + (4 - (userIdIndex - start));

                if(end - userIdIndex < 6) start = start + (end - userIdIndex - 6);

                for(let index = start; index< end; index++) {
                    leaderboardUsersId.push(usersId[index]);
                }
                return resolve(leaderboardUsersId);
            } catch(err){
                return reject(err);
            }
        })
    }
}