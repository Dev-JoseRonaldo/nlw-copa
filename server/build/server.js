"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const prisma = new client_1.PrismaClient({
    log: ['query'],
});
async function bootstrap() {
    const fastify = (0, fastify_1.default)({
        logger: true,
    });
    await fastify.register(cors_1.default, {
        origin: true,
        // em produção colocar o domínio ex:"https://www.bolaojoseronaldo.vercel.app"
    });
    fastify.get('/pools/count', async () => {
        const count = await prisma.pool.count();
        return { count };
    });
    fastify.get('/users/count', async () => {
        const count = await prisma.user.count();
        return { count };
    });
    fastify.get('/guesses/count', async () => {
        const count = await prisma.guess.count();
        return { count };
    });
    fastify.post('/pools', async (request, reply) => {
        const createPollBody = zod_1.z.object({
            title: zod_1.z.string(),
        });
        const { title } = createPollBody.parse(request.body);
        const generate = new short_unique_id_1.default({ length: 6 });
        const code = String(generate()).toUpperCase();
        await prisma.pool.create({
            data: {
                title,
                code
            }
        });
        return reply.status(201).send({ code });
    });
    await fastify.listen({ port: 3333, /*host: '0.0.0.0'*/ });
}
bootstrap();
