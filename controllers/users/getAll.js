module.exports = async (req, res, next) => {
  try {
    const db = req.app.get('db')
    const result = await db.collection('users').find().toArray()
    if (!result.length) throw { status: '204', message: 'No users exist'}
    return res.status('200').send(result)
  } catch (error) {
    next(error)
  }
}
