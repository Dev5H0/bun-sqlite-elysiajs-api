import { Elysia, t } from 'elysia'
import { createDb } from './database';

const TUsername = t.String({ pattern:/^([a-z0-9]+(?:[\-\_][a-z0-9]+)*)$/.source, maxLength:32, minLength:2 }) // t.RegExp(/^([a-z0-9]+(?:[\-\_][a-z0-9]+)*){2,32}$/)

export const routes = new Elysia()
    .decorate('db', createDb())
    .group('/api', (app) => (
        app.get('/users', (ctx) => { // Returns all users
            console.log('Getting all users')
            return ctx.db.query('SELECT * FROM users').all()
        }).get('/users/:id', (ctx) => { // Returns a user by id
            const id = ctx.params.id
            console.log(`Getting a user by id ${id}`)
            return ctx.db.query(`SELECT * FROM users WHERE id = $id`).get({ $id:id })
        }, {
            params: t.Object({
                id: t.Numeric(),
            })
        }).post('/users', async (ctx) => { // Creates a user
            console.log(`Creating a user`)
            return ctx.db.query(`INSERT INTO users (password, username) VALUES ($password, lower($username)) RETURNING *`).get({ $password:await Bun.password.hash(ctx.body.password, 'bcrypt'), $username:ctx.body.username })
        }, {
            body: t.Object({
                password: t.String(),
                username: TUsername,
            })
        }).put('/users/:id', (ctx) => { // Edits a user by id
            const id = ctx.params.id
            console.log(`Editing user by id ${id}`)
            return ctx.db.query(`UPDATE users SET displayname = $displayname, description = $description WHERE id = $id RETURNING *`).get({ $id:id, $displayname:ctx.body.displayname, $description:ctx.body.description })
        }, {
            params: t.Object({
                id: t.Numeric(),
            }),
            body: t.Object({
                displayname: t.String(),
                description: t.String(),
            })
        }).delete('/users/:id', async (ctx):Promise<{ success:boolean }> => { // Deletes a user by id using password
            const id = ctx.params.id
            console.log(`Deleting user by id ${id}`)
            const user_password = ctx.db.query(`SELECT password FROM users WHERE id = $id`).get({ $id:id }) as { password:string }
            const isMatch = await Bun.password.verify(ctx.body.password, user_password.password, 'bcrypt')
            if (isMatch) {
                ctx.db.query(`DELETE FROM users WHERE id = $id`).run({ $id:id })
                return { success:true }
            }
            return { success:false }
        }, {
            params: t.Object({
                id: t.Numeric(),
            }), 
            body: t.Object({
                password: t.String(),
            })
        })
    ))
;
