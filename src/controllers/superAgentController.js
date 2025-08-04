const asyncHandler = require('express-async-handler')
const Ticket = require('../models/ticketModel')
const Note = require('../models/noteModel')

const formatMilliseconds = (ms) => {
  if (ms < 0) ms = -ms;
  const time = {
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000) % 24,
    minutes: Math.floor(ms / 60000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
  return time;
};

// @desc    Get all tickets
// @route   GET /api/superagent/tickets
// @access  Private (superAgent)
const getAllTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find().populate('user', 'name email')
  res.status(200).json(tickets)
})

// @desc    Get analytics
// @route   GET /api/superagent/analytics
// @access  Private (superAgent)
const getAnalytics = asyncHandler(async (req, res) => {
  const totalTickets = await Ticket.countDocuments()
  const openTickets = await Ticket.countDocuments({ status: 'open' })
  const newTickets = await Ticket.countDocuments({ status: 'new' })
  const closedTickets = await Ticket.countDocuments({ status: 'close' })

  const tickets = await Ticket.find({ status: 'close' })
  
  let averageResponseTime = 0;
  if (tickets.length > 0) {
      const responseTimes = tickets.map(
        (ticket) => ticket.updatedAt.getTime() - ticket.createdAt.getTime()
      )
      const totalResponseTime = responseTimes.reduce((a, b) => a + b, 0);
      averageResponseTime = totalResponseTime / tickets.length;
  }


  res.status(200).json({
    totalTickets,
    openTickets,
    newTickets,
    closedTickets,
    // Return the formatted object instead of raw milliseconds
    averageResponseTime: formatMilliseconds(averageResponseTime), 
  })
})


// @desc    Add a note to a ticket
// @route   POST /api/superagent/tickets/:id/notes
// @access  Private (superAgent)
const addNoteToTicket = asyncHandler(async (req, res) => {
  const { text } = req.body
  const ticketId = req.params.id
  const userId = req.user.id

  if (!text) {
    res.status(400)
    throw new Error('Please add a note text')
  }

  const ticket = await Ticket.findById(ticketId)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  const note = await Note.create({
    text,
    isStaff: true,
    user: userId,
    ticket: ticketId,
  })

  res.status(201).json(note)
})

// @desc    Close a ticket
// @route   PUT /api/superagent/tickets/:id/close
// @access  Private (superAgent)
const closeTicket = asyncHandler(async (req, res) => {
  const ticketId = req.params.id

  const ticket = await Ticket.findById(ticketId)

  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  ticket.status = 'close'
  const updatedTicket = await ticket.save()

  res.status(200).json(updatedTicket)
})

module.exports = {
  getAllTickets,
  getAnalytics,
  addNoteToTicket,
  closeTicket,
}