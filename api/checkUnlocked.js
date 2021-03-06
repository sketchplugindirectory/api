const storage = require('../storage')()
const cleanBody = require('./_cleanBody')

module.exports.handler = (event, context, callback) => {
  let parsedBody
  try {
    parsedBody = JSON.parse(event.body || {})
  } catch (e) {
    callback(new Error('[400] Could not parse the body'))
    return
  }

  const body = cleanBody(parsedBody)
  if (!body.githubId) {
    callback(new Error('[400] Missing github ID'))
    return
  }

  storage
    .findOne(body.githubId)
    .then(found => {
      if (found) {
        return storage.update(found).then(() => found)
      }
      return storage.create(body).then(() => body)
    })
    .then((user) => {
      return callback(null, {
        ok: true,
        user: user
      })
    })
    .catch(callback)
}
