import { describe, expect, it } from 'bun:test'
import '../src/index'
import { edenTreaty } from '@elysiajs/eden'
import type { App } from '../src/index'
import type { IUser } from '../src/database'

const { api } = edenTreaty<App>('http://localhost:3000')

describe('api/users', async () => {
    const password = 'test-password'
    const username = 'test-username4'
    const displayname = 'Tester'
    const description = `Line 1 \nTesting... \nLine 3 \n`
    const userPostData = (await api.users.post({ password, username })).data as IUser
    it('Post', async () => {
        expect(userPostData).pass()
    })
    it('Put :id', async () => {
        const userPutData = await (await api.users[userPostData.id].put({ displayname, description })).data
        expect(userPutData).pass()
    })
    it('Get :id', async () => {
        const userGetData = await (await api.users[userPostData.id].get()).data
        expect(userGetData).toBeObject()
        expect(userGetData).pass()
    })
    it('Get :id', async () => {
        const userGetAllData = await (await api.users.get()).data
        expect(userGetAllData).toBeArray()
        expect(userGetAllData).pass()
    })
    it('Delete :id', async () => {
        const userDelData = (await api.users[userPostData.id].delete({ password })).data
        expect(userDelData).toContainKey('success')
        expect(userDelData).toContainValue(true)
        expect(userDelData).pass()
    })
})
