import express from 'express'
const router = express.Router();
import {
    getEvents,
    createEvent,
    deleteEvent,
    updateEvent,
} from './event.controller.js'
import handleUpload from './../../middlewares/uploadEvent.js'
// Fetch all events
router.get('/events', getEvents);

// Create a new event
router.post('/events',handleUpload, createEvent);

// Delete an event
router.delete('/events/:id', deleteEvent);

// Update an event
router.put('/events/:id',handleUpload, updateEvent);

export default router;
