const mongodb = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const db = req.app.get('db')
    const result = await db.collection('users').findOne({ _id: mongodb.ObjectID(req.params.id) })
    if (!result) throw { status: '204', message: 'User not found'}
    return res.status('200').send(result)
  } catch (error) {
    next(error)
  }
}
