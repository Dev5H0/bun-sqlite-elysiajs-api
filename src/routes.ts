import { Elysia, t } from 'elysia'
import { createDb } from './database';
import { queryUserPost, queryUserPutDescriptionById, queryUserPutDisplaynameById, queryUserGetAll, queryUserGetById, type IUser, queryUserPutPasswordById, queryUserDeleteById, passwordVerifyByUserId } from './database/users';
import { passwordHash } from './utils';

const TUsername = t.String({ pattern:/^([a-z0-9]+(?:[\-\_][a-z0-9]+)*)$/.source, maxLength:32, minLength:2 }) 

export const routes = new Elysia()
    .decorate('db', createDb())
    .group('/api', (app) => (
        app.get('/users', (ctx) => { 
            return ctx.db.query(queryUserGetAll()).all()
        }).get('/users/:id', (ctx) => {
            return ctx.db.query(queryUserGetById(ctx.params.id)).get()
        }, {
            params: t.Object({
                id: t.Numeric(),
            }),
        }).post('/users', async (ctx) => { 
            return await ctx.db.query(await queryUserPost()).get({ $username:ctx.body.username, $password:await passwordHash(ctx.body.password) }) as IUser
        }, {
            body: t.Object({
                password: t.String(),
                username: TUsername,
            }),
            response: t.Object({
                created_at: t.String(),
                id: t.Numeric(),
                username: TUsername,
            })
        }).put('/users/:id/edit/description', (ctx) => {
            return ctx.db.query(queryUserPutDescriptionById(ctx.params.id)).get({ $description:ctx.body.newData })
        }, {
            params: t.Object({
                id: t.Numeric(),
            }),
            body: t.Object({
                newData: t.String(),
            })
        }).put('/users/:id/edit/displayname', (ctx) => {
            return ctx.db.query(queryUserPutDisplaynameById(ctx.params.id)).get({ $displayname:ctx.body.newData })
        }, {
            params: t.Object({
                id: t.Numeric(),
            }),
            body: t.Object({
                newData: t.String(),
            })
        })
        // .put('/users/:id/edit/username', (ctx) => {
        //     return ctx.db.query(queryUserPutUsernameById(ctx.params.id)).get({ $username:ctx.body.newData })
        // }, {
        //     params: t.Object({
        //         id: t.Numeric(),
        //     }),
        //     body: t.Object({
        //         newData: t.String(),
        //     })
        // })
        .put('/users/:id/edit/password', async (ctx) => {
            if (await passwordVerifyByUserId(ctx.db, ctx.body.oldPassword, ctx.params.id)) return await ctx.db.query(queryUserPutPasswordById(ctx.params.id)).get({ $password:await passwordHash(ctx.body.newPassword) })
        }, {
            params: t.Object({
                id: t.Numeric()
            }),
            body: t.Object({
                oldPassword: t.String(),
                newPassword: t.String(),
            })
        }).delete('/users/:id', async (ctx):Promise<{ success:boolean }> => { // Deletes a user by id using password
            if (await passwordVerifyByUserId(ctx.db, ctx.body.password, ctx.params.id)) {
                ctx.db.query(queryUserDeleteById(ctx.params.id)).run()
                return { success:true }
            } else return { success:false }
        }, {
            params: t.Object({
                id: t.Numeric(),
            }), 
            body: t.Object({
                password: t.String(),
            }),
            response: t.Object({
                success: t.Boolean()
            })
        })
    ))
;
