import Database from 'bun:sqlite'
import { migrate, getMigrations } from 'bun-sqlite-migrations';

export const createDb = ():Database => {
    console.log('Initialising Database')
    const db = new Database('./database/main.sqlite')
    db.exec('PRAGMA journal_mode = WAL;')
    migrate(db, getMigrations('./database/migrations'))
    return db
}

export interface IUser {
    visible:boolean
    created_at:Date
    updated_at:Date
    id:number
    password:string
    username:string
    displayname?:string
    description?:string
}
