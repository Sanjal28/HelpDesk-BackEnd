const express = require('express')
const router = express.Router()
const {
  getAllTickets,
  getAnalytics,
  addNoteToTicket,
  closeTicket,
} = require('../controllers/superAgentController')
const { protect } = require('../middleware/authMiddleware')
const { protectSuperAgent } = require('../middleware/superAgentMiddleware')

router.get('/tickets', protect, protectSuperAgent, getAllTickets)
router.get('/analytics', protect, protectSuperAgent, getAnalytics)
router.post('/tickets/:id/notes', protect, protectSuperAgent, addNoteToTicket)
router.put('/tickets/:id/close', protect, protectSuperAgent, closeTicket)

module.exports = router