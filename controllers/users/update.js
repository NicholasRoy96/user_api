const mongodb = require('mongodb')

// Haven't yet tested if this update user is functional with current API
// May need to change the updateOne db method as determineUpdateParams may or may not work

// UPDATE USER NOT WORKING, need to implement password encryption too? Return to this

module.exports = async (req, res, next) => {
  try {
    const db = req.app.get('db')
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      throw { status: '400', message: 'You must provide information in all the fields.'}
    }
    const result = await db.collection('users').updateOne({ _id: mongodb.ObjectID(req.params.id) }, {
      $set: { ...determineUpdateParams(req.body) }
    })
    if (!result.value) throw { status: '404', message: `Failed to update user: ${req.params.id}` }
    return res.status('201').send({ success: true })
  } catch (error) {
    next(error)
  }
}

determineUpdateParams = user => {
  const updateParams = user
  delete updateParams.id
  return updateParams
}
