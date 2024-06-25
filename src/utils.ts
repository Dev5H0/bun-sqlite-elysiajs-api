export const passwordHash = (password:string) => Bun.password.hash(password, 'bcrypt')
export const passwordVerify = (password:string, hash:string) => Bun.password.verify(password, hash, 'bcrypt')
