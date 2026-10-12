class Logger{
    constructor(){
        if(!Logger.instance){
            Logger.instance=this;
        } 
        return Logger.instance

    }

log(level,message,metaData={}){
let messageObj={
    level:level,
    message:message,
    timeStamp:new Date(),
    ...metaData
}
console.log(messageObj);

}
error(message,metaData){
this.log('error',message,metaData)
}

info(message,metaData){
this.log('info',message,metaData)

}

warn(message,metaData){
this.log('warn',message,metaData)

}

}


export const logger=new Logger()