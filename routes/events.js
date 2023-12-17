const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Event = require('../models/event')
const uploadPath = path.join('public', Event.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const Alumni = require('../models/alumni')
const { membersOnly } = require('../middleware/auth');
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})
// all events
router.get('/', membersOnly, async (req, res) => {
    let query = Event.find()
    if (req.query.eventName != null && req.query.eventName !== '') {
        query = query.regex('eventName', new RegExp(req.query.eventName, 'i'))
    }
    if (req.query.eventDateBefore != null && req.query.eventDateBefore !== '') {
        query = query.lte('eventDate', req.query.eventDateBefore)
    }
    if (req.query.eventDateAfter != null && req.query.eventDateAfter !== '') {
        query = query.gte('eventDate', req.query.eventDateAfter)
    }
    try {
        const events = await query.exec()
        res.render('events/index', {
            events: events,
            searchOptions: req.query
        })

    }
    catch {
        res.render('/')
    }


})
// new event
router.get('/new', membersOnly, async (req, res) => {
    renderFormPage(res, new Event(), 'new')

})
//create new event
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const event = new Event({
        eventName: req.body.name,
        alumni: req.body.alumni,
        eventDate: new Date(req.body.eventDate),
        entryFee: req.body.entryFee,
        coverImage: fileName,
        description: req.body.description,
        eventType: req.body.eventType
    })
    try {
        const newEvent = await event.save()
        res.redirect(`events/${newEvent.id}`)

    } catch {
        if (event.coverImage != null) {
            removeEventCover(event.coverImage)
        }
        renderFormPage(res, event, 'new', true)
    }
})
function removeEventCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

//show book route
router.get('/:id', membersOnly, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('alumni').exec();
        res.render('events/show', { event: event });
    }
    catch {
        res.redirect('/');
    }
})
// edit event route
router.get('/:id/edit', membersOnly, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            const alumni = await Alumni.find(); // Fetch alumni data
            res.render('events/edit', { event: event, alumni: alumni }); // Pass both event and alumni to the template
        } else {
            // Handle the case where the event with the specified ID is not found
            res.redirect('/events');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});


//Update event
router.put('/:id', upload.single('cover'), async (req, res) => {
    let event
    try {
        event = await Event.findById(req.params.id)
        const fileName = req.file != null ? req.file.filename : null
        event.eventName = req.body.name,
            event.alumni = req.body.alumni,
            event.eventDate = new Date(req.body.eventDate),
            event.entryFee - req.body.entryFee,

            event.description = req.body.description
        if (req.body.cover != null && req.body.cover !== '') {
            removeEventCover(event.coverImage)
        }
        event.coverImage = fileName,
            await event.save()
        res.redirect(`${event.id}`)
    } catch {
        if (event==null) {
            res.redirect('/')
        }
        else {
            res.render('events/show', { event: event });
        }
    }
})

router.get('/:id/delete', membersOnly, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            const alumni = await Alumni.find(); // Fetch alumni data
            res.render('events/delete', { event: event, alumni: alumni }); // Pass both event and alumni to the template
        } else {
            // Handle the case where the event with the specified ID is not found
            res.redirect('/events');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.delete('/:id', membersOnly, async (req, res) => {
    let event
    try {
        event = Event.findById(req.params.id);
        await event.deleteOne()
        res.redirect('/events')
    } catch {
        if (event != null) {
            res.render('/events', {
                event: event,
                errorMessage: 'Could not delete event'
            })
        }
        else
            res.redirect('/')
    }
})
async function renderFormPage(res, event, form, hasError = false) {
    try {
        const alumni = await Alumni.find({})
        const params = {
            alumni: alumni,
            event: event
        }
        if (hasError) {
            if (form === 'edit')
                params.errorMessage = 'Error updating Event'
            else
                params.errorMessage = 'Error creating Event'
        }
        res.render(`events/${form}`, params)
    }
    catch {
        res.redirect('/events')
    }
}
module.exports = router;