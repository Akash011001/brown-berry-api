const bcrypt = require('bcrypt')

const password = 'akas'
let hpass = ''

async function hashing(){
    const salt = await bcrypt.genSalt(10)
    await console.log(salt)
    const en = await bcrypt.hash(password, salt)
    const r = await bcrypt.compare('akash', en)
    await console.log(r)

}

hashing()


