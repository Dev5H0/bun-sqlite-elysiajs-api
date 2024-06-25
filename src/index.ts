import { Elysia } from 'elysia'
import { routes } from './routes'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
    .use(swagger())
    .use(routes)
    .listen(3000)
;

export type App = typeof app
