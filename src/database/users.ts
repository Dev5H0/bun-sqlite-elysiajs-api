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

// export const queryUserPutUsernameById = (id:number) => `UPDATE users SET username = $username WHERE id = ${id} RETURNING created_at, id, username, displayname, description`
