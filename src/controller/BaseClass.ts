import config from "../config";


export class BaseClass {
    
    protected getGameName(gameCode: string): string {
        try {
            let gameName: string = config.gameCodeList[gameCode];
            if (!gameName) throw Error('Game name doesnt exit or invalid name.')
            return gameName
        } catch (err) {
            return err;
        }
    }
}