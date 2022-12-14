import Fastify from "fastify";
import cors from '@fastify/cors'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import ShortUniqueId from 'short-unique-id'

const prisma = new PrismaClient({
  log: ['query'],
})

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: true,
    // em produção colocar o domínio ex:"https://www.bolaojoseronaldo.vercel.app"
  })

  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count()

    return { count }  
  })

  fastify.get('/users/count', async () => {
    const count = await prisma.user.count()

    return { count }  
  })

  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count()

    return { count }  
  })

  
  fastify.post('/pools', async (request, reply) => {
    const createPollBody = z.object({
      title: z.string(),
    })

    const { title } = createPollBody.parse(request.body)

    const generate = new ShortUniqueId({ length: 6 })
    const code = String(generate()).toUpperCase()

    await prisma.pool.create({
      data: {
        title,
        code
      }
    })

    return reply.status(201).send({ code })  
  })

  const PORT = 6237

  await fastify.listen({ port: PORT })
}

bootstrap()