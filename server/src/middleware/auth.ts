import type {FastifyRequest} from "fastify";
export async function requireAuth(request:FastifyRequest){await request.jwtVerify();return (request.user as {sub:string;email:string}).sub;}
