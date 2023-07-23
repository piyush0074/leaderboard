import { Request, Response } from 'express';
import Joi from 'joi';
import logger from '../../loaders/Logger';

// import { BadRequestResponse } from '../../core/APIresponse';
import { BadRequestError } from '../../core/APIerror';

export class LeaderboardReqValidate{

    public static updateScoreRequest(req: Request, res: Response, next: any) {
        const schemaRules = {
            gameCode: Joi.string().min(2).max(12).required(),
            userId: Joi.string().required(),
            score: Joi.number().required(),
        }
        const schema = Joi.object(schemaRules);
        const { error, value } = schema.validate(req.body);

        if(error) {
            logger.error(error.toString());
            throw new BadRequestError(error.toString());
        } else {
            next();
        }
    }

    public static playerRankRequest(req: Request, res: Response, next: any) {
        const schemaRules = {
            gameCode: Joi.string().min(2).max(12).required(),
            userId: Joi.string().required(),
        }
        const schema = Joi.object(schemaRules);

        const { error, value } = schema.validate(req.query);

        if(error) {
            logger.error(error.toString());
            throw new BadRequestError(error.toString());
        } else {
            next();
        }
    }

    public static playerAroundLeaderboardRequest(req: Request, res: Response, next: any) {
        const schemaRules = {
            gameCode: Joi.string().min(2).max(12).required(),
            userId: Joi.string().required(),
        }
        const schema = Joi.object(schemaRules);

        const { error, value } = schema.validate(req.query);

        if(error) {
            logger.error(error.toString());
            throw new BadRequestError(error.toString());
        } else {
            next();
        }
    }
}