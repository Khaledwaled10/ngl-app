import { cacheProvider } from "../cache/init.js"

export function idEmpotency(ttl=3600){

    return async function(req,res,next){
const idEmpotency=req.headers['idempotency-key']
const key=`${req.method}:${req.originalUrL}:${idEmpotency}`

const cache=await cacheProvider.get(key)


if(cache){
        res.setHeader('X-Cache','HIT')

    return res.json( JSON.parse( cache))
}

const originalJson=res.json.bind(res)


res.json=(
   async (body)=>{

    if(res.statusCode>=200&&res.statusCode<300){
await cacheProvider.set(key,JSON.stringify(body),ttl)

        res.setHeader('X-Cache','MISS')
        
    }
        
        return originalJson(body)
    }
)

        next();




    }


}