import Redis from "ioredis";

export class RediasCacheProvider{
client ;

constructor(config){
    this.client=new Redis({
        host:config.host,
        port:config.port,
        password:config.password,
        lazyConnect:true,
        maxLoadingRetryTime:3
    })
    this.client.on('error',(err)=>console.log('redis server is error',err.message));
    this.client.connect().catch((err)=>console.log('fail connect to rerdis',err.message))
}

 async set(key,value,ttl){
return await this.client.set(key,value,'EX',ttl)
}

async get(key){
return await this.client.get(key)
}


async del(key){
return await this.client.del(key);
}

}