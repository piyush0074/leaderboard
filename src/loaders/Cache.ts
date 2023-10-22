import config from "../config";
import { AbstractCache } from "./AbstractCache";
import logger from "./Logger";
import { Redis } from "ioredis"

export class Cache extends AbstractCache{

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

    zAdd(gameName: string, score:number, member: string,): Promise<void> {
        return new Promise(async(resolve, reject) => {
            try {
                await this.redis.zadd(gameName, score, member);
                return resolve();
            } catch(err) {
                return reject(err);
            }
        })
    }

    zScore(gameName: string, member: string): Promise<number>{
        return new Promise(async(resolve, reject) => {
            try {
                let score: number = Number(await this.redis.zscore(gameName, member));
                return resolve(score);
            } catch(err){
                return reject(err);
            }
        })
    }

    zRank(gameName: string, userId: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            try {
                let rank: number = Number(await this.redis.zrank(gameName, userId)) + 1;
                return resolve(rank);
            } catch (err) {
                return reject(err);
            }
        })
    }

    zRangeByScore(key: string, min:number, max: number): Promise<string[]> {
        return new Promise(async(resolve, reject) => {
            try {
                let scoreByRange: string[] = await this.redis.zrangebyscore(
                    key,
                    min,
                    max,
                    'WITHSCORES'
                );
                return resolve(scoreByRange);
            } catch(err){
                return reject(err);
            }
        })
    }
}