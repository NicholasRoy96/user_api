const crypto = require('crypto')
const validator = require('email-validator')

module.exports = async (req, res, next) => {
  try {
    const db = req.app.get('db')
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      throw { status: '400', message: 'You must provide information in all the fields.' }
    }
    if (!validator.validate(email)) {
      throw { status: '400', message: 'You must provide a valid email'}
    }
    const existingUser = await db.collection('users').findOne(
        { email }
    )
    if (existingUser) {
      throw { status: '409', message:`A user already exists with the email: ${email}`}
    }
    const formattedUser = formatUser(req.body)
    await db.collection('users').insertOne(formattedUser)
    return res.status('201').send({success: true})
  } catch (error) {
    next(error)
  }
}

// Sanitizes data, formats password to encryption, and adds new variables before DB insertion.

const formatUser = user => {
  const { name, email, password } = user
  return {
    name: name.trim(),
    email,
    password: encryptPassword(password),
    userType: 'member',
    created: new Date().toString()
  }
}

const encryptPassword = password => {
  let iv = crypto.randomBytes(16)
  let key = '47936587352298539546994676557718'
  let secretMessage = password

  let cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  let encrypted = cipher.update(secretMessage, 'utf-8', 'hex')
  encrypted += cipher.final('hex')

  return { encrypted, iv }
}