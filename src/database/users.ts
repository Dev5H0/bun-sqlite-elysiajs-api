import { Database } from 'bun:sqlite'
import { passwordHash, passwordVerify } from '../utils'

export interface IUserFull {
    visible:boolean
    created_at:string
    updated_at:string
    id:number
    password:string
    username:string
    displayname?:string
    description?:string
}

export interface IUser {
    created_at:string
    id:number
    username:string
    displayname?:string
    description?:string
}

export const queryUserGetAll = ():string => 'SELECT created_at, id, username, displayname, description FROM users'
const queryUserGetPasswordById = (id:number):string => `SELECT password FROM users WHERE id = ${id}`
export const queryUserGetById = (id:number):string => `SELECT created_at, id, username, displayname, description FROM users WHERE id = ${id}`
export const queryUserPost = async ():Promise<string> => `INSERT INTO users (password, username) VALUES ($password, $username) RETURNING created_at, id, username`
export const queryUserPutDescriptionById = (id:number) => `UPDATE users SET description = $description WHERE id = ${id} RETURNING created_at, id, username, displayname, description`
export const queryUserPutDisplaynameById = (id:number) => `UPDATE users SET displayname = $displayname WHERE id = ${id} RETURNING created_at, id, username, displayname, description`
// export const queryUserPutUsernameById = (id:number) => `UPDATE users SET username = $username WHERE id = ${id} RETURNING created_at, id, username, displayname, description`
export const queryUserPutPasswordById = (id:number) => `UPDATE users SET password = $password WHERE id = ${id} RETURNING created_at, id, username, displayname, description`
export const queryUserDeleteById = (id:number) => `DELETE FROM users WHERE id = ${id}`

export const passwordVerifyByUserId = async (db:Database, password:string, id:number) => await passwordVerify(password, (await db.query(queryUserGetPasswordById(id)).get() as { password:string }).password)

