import { Elysia, t } from 'elysia'
import { createDb } from './database';
import { passwordHash, passwordVerify } from './utils';

const TUsername = t.String({ pattern:/^([a-z0-9]+(?:[\-\_][a-z0-9]+)*)$/.source, maxLength:32, minLength:2 }) 

export const routes = new Elysia()
    .decorate('db', createDb())
    .group('/api', (app) => (
        app.get('/users', (ctx) => { 
            return ctx.db.user.findMany()
        }).get('/users/:id', (ctx) => {
            return ctx.db.user.findUnique({ where:{ id:ctx.params.id } })
        }, {
            params: t.Object({
                id: t.Numeric(),
            }),
        }).post('/users', async (ctx) => { 
            const body = ctx.body
            return (await ctx.db.user.create({ data:{ description:body.description, displayname:body.displayname, username:body.username, password:await passwordHash(body.password) }, select:{ created_at:true, description:true, displayname:true, id:true, username:true } }))
        }, {
            body: t.Object({
                password: t.String(),
                username: TUsername,
                displayname: t.String(),
                description: t.String(),
            }),
            response: t.Object({
                created_at: t.Date(),
                id: t.Numeric(),
                username: TUsername,
                displayname: t.String(),
                description: t.String(),
            })
        }).put('/users/:id/edit-displayname', async (ctx) => {
                return ctx.db.user.update({ where:{ id:ctx.params.id }, data:{ displayname:ctx.body.newData }, select:{ created_at:true, id:true, displayname:true, description:true } })
        }, {
            params: t.Object({
                id: t.Numeric(),
            }),
            body: t.Object({
                newData: t.String(),
            }),
            response: t.Object({
                created_at: t.Date(),
                id: t.Numeric(),
                displayname: t.String(),
                description: t.String(),
            }),
        }).put('/users/:id/edit-description', async (ctx) => {
            return ctx.db.user.update({ where:{ id:ctx.params.id }, data:{ description:ctx.body.newData }, select:{ created_at:true, id:true, displayname:true, description:true } })
        }, {
            params: t.Object({
                id: t.Numeric(),
            }),
            body: t.Object({
                newData: t.String(),
            }),
            response: t.Object({
                created_at: t.Date(),
                id: t.Numeric(),
                displayname: t.String(),
                description: t.String(),
            }),
        }).put('/users/:id/edit-password', async (ctx) => {
            const user = await ctx.db.user.findUnique({ where:{ id:ctx.params.id }, select:{ password:true } })
            const isMatch = await passwordVerify(ctx.body.oldPassword, user?.password || '')
            if (isMatch) {
                return { success:true, data:await ctx.db.user.update({ where:{ id:ctx.params.id }, data:{ password:await passwordHash(ctx.body.newPassword) }, select:{ created_at:true, id:true, displayname:true, description:true } }) }
            } else return { success:false }
        }, {
            params: t.Object({
                id: t.Numeric(),
            }),
            body: t.Object({
                oldPassword: t.String(),
                newPassword: t.String(),
            }),
            response: t.Object({
                success: t.Boolean(),
                data: t.Optional(t.Object({
                    created_at: t.Date(),
                    id: t.Numeric(),
                    displayname: t.String(),
                    description: t.String(),
                })),
            }),
        }).delete('/users/:id', async (ctx):Promise<{ success:boolean }> => { // Deletes a user by id using password
            const user = await ctx.db.user.findUnique({ where:{ id:ctx.params.id }, select:{ password:true } })
            const isMatch = await passwordVerify(ctx.body.password, user?.password || '')
            if (isMatch) {
                ctx.db.user.delete({ where:{ id:ctx.params.id } }).catch((err) => console.log(err))
                return { success:true }
                // }
            // if (await passwordVerifyByUserId(ctx.db, ctx.body.password, ctx.params.id)) {
            //     ctx.db.query(queryUserDeleteById(ctx.params.id)).run()
            //     return { success:true }
            } else return { success:false }
        }, {
            params: t.Object({
                id: t.Numeric(),
            }), 
            body: t.Object({
                password: t.String(),
            }),
            response: t.Object({
                success: t.Boolean(),
            })
        })
    ))
;
