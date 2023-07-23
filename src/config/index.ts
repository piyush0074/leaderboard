const gameCodeList:{[id: string]: string} =  {
    "01": "test_01",
    "02": "test_02"
}
export default {

    port: process.env.PORT || 15156,
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
    api: {
        prefix: '/api',
    },
    redisURL:  "localhost",

    gameCodeList
}