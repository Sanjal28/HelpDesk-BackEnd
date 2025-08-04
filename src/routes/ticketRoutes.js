const express = require('express')
const router = express.Router()
const {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
} = require('../controllers/ticketController')

const { protect } = require('../middleware/authMiddleware')

// NOTE: We no longer import noteController here.
// Instead, we will re-route to a dedicated note router.

router.route('/').get(protect, getTickets).post(protect, createTicket)

router
  .route('/:id')
  .get(protect, getTicket)
  .delete(protect, deleteTicket)
  .put(protect, updateTicket)
  
// Re-route requests for /:ticketId/notes into noteRouter
router.use('/:ticketId/notes', require('./noteRoutes'))

module.exports = router