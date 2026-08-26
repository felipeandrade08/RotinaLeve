import Fastify from "fastify";
import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import {Pool} from "pg";

dotenv.config();
const app=Fastify({logger:true});
const port=Number(process.env.PORT||3001);
const databaseUrl=process.env.DATABASE_URL;
const pool=databaseUrl?new Pool({connectionString:databaseUrl,ssl:process.env.NODE_ENV==="production"?{rejectUnauthorized:false}:undefined}):null;
await app.register(cors,{origin:true});
await app.register(sensible);
await app.register(jwt,{secret:process.env.JWT_SECRET||"change-me-in-railway"});
app.get("/health",async()=>({ok:true,service:"rotinaleve-api",version:"0.2.0",database:Boolean(pool)}));
app.get("/api/v1/status",async()=>({ok:true,message:"RotinaLeve API online"}));
app.addHook("onClose",async()=>{await pool?.end()});
app.listen({port,host:"0.0.0.0"});
