const asyncHandler = require('express-async-handler')

const protectSuperAgent = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'superAgent') {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as a super agent')
  }
})

module.exports = { protectSuperAgent }