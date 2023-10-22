import { Redis } from "ioredis";

export abstract class AbstractCache {
    redis: Redis;

    abstract init(): void;

    abstract zAdd(gameName: string, score: number, member: string): Promise<void>;

    abstract zScore(gameName: string, member: string): Promise<number>;

    abstract zRank(gameName: string, userId: string): Promise<number>;

    abstract zRangeByScore(key: string, min: number, max:number): Promise<string[]>;
}