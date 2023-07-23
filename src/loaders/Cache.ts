import config from "../config";
import { IPlayerAroundLeaderboard } from "../interfaces/IPlayerAroundLeaderboard";
import logger from "./Logger";
import { Redis } from "ioredis"

export class Cache {

    redis: Redis;

    init(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                this.redis = new Redis({
                    host: config.redisURL
                });
                logger.info("Redis initialized")
                return resolve();
            } catch (err) {
                logger.error("Err In redis init : " + err.toString());
                return reject(err);
            }
        })
    }

    updateScore(gameName: string, userId: string, currentScore: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                logger.silly("score updating")
                let score: number = Number(this.redis.zscore(gameName, userId));
                if (currentScore > score || ! score) {
                    await this.redis.zadd(gameName, currentScore, userId);
                }
                return resolve();
            } catch (err) {
                return reject(err);
            }
        })
    }

    getScore(gameName: string, userId: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            try {
                let score: number = Number(this.redis.zscore(gameName, userId));
                return resolve(score);
            } catch (err) {
                return reject(err);
            }
        })
    }

    getRank(gameName: string, userId: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            try {
                logger.silly("getting rank")
                let rank: number = Number(await this.redis.zrank(gameName, userId)) + 1;
                return resolve(rank);
            } catch (err) {
                return reject(err);
            }
        })
    }

    getPlayerAroundLeaderboard(gameName: string, userId: string): Promise<IPlayerAroundLeaderboard[]>{
        return new Promise(async(resolve, reject) => {
            try {
                let score: number = Number(await this.redis.zscore(gameName, userId));
                let min : number = score -50;
                let max: number = score + 50;

                let userdata = await this.redis.zrangebyscore(gameName,min,max,'WITHSCORES');
                let usersId: string [] =[];
                let userScores: {[id:string]: number} = {};
                
                for(let index = 0;index< userdata.length; index++){
                    if(index %2 === 0) {
                        usersId.push(userdata[index]);
                        userScores[userdata[index]] = Number(userdata[index+1]);
                    }
                }
                if(userdata.length > 10) {
                    usersId = await this.removeExcessUserId(usersId,userId);
                }
                
                let playerAroundLeaderboard:IPlayerAroundLeaderboard[] = [];
                for(let id of usersId) {
                    let rank: number = Number(await this.redis.zrank(gameName,id)) + 1;
                    playerAroundLeaderboard.push({
                        userId: id,
                        rank,
                        score: userScores[id]
                    })
                }
                return resolve(playerAroundLeaderboard);
            } catch(err){
                return reject(err);
            }
        })
    }

    removeExcessUserId(usersId: string[], userId: string):Promise<string[]>{
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