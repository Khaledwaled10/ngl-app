import http from'http'
import { createApp } from './main.js'
import mongoose from 'mongoose'
import { logger } from './pkj/logger/logger.js';

const app = createApp();

const server=http.createServer(app)

server.listen(3030, () => {
  logger.info("Server start in port 3030");
});

async function shutDown(){
    server.close(
async ()=>{

    await mongoose.disconnect()
    process.exit(0)


}

    )
    
}

process.on('SIGINT',shutDown)



process.on("SIGTERM",shutDown)