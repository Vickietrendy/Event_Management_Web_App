const mongoose = require('mongoose');
const Event = require('./event');

const alumniSchema = new mongoose.Schema({
    name: {
        type: 'String',
        required: true,
    },
    city: {
        type: 'String',
        required: true,
    },
    classYear: {
        type: 'String', // You can adjust the type as needed (String, Number, etc.)
        required: true,
    },
    admissionNumber: {
        type: 'String', // You can adjust the type as needed (String, Number, etc.)
        required: true,
    },
});

alumniSchema.pre('deleteOne', function (next) {
    Event.find({ alumni: this.id }, (err, events) => {
        if (err) {
            next(err);
        } else if (events.length > 0) {
            next(new Error('This alumni has events'));
        } else {
            next();
        }
    });
});

module.exports = mongoose.model('Alumni', alumniSchema);
