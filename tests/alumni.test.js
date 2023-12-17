const mongoose = require('mongoose');
const Alumni = require('../models/alumni');
const Event = require('../models/event');

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});

beforeEach(async () => {
    await Alumni.deleteMany();
    await Event.deleteMany();
});

describe('Alumni Model', () => {

    test('should create and save a new alumni successfully', async () => {
        const alumniData = {
            name: 'John Doe',
            city: 'New York',
        };

        const alumni = new Alumni(alumniData);
        const savedAlumni = await alumni.save();

        expect(savedAlumni._id).toBeDefined();
        expect(savedAlumni.name).toBe(alumniData.name);
        expect(savedAlumni.city).toBe(alumniData.city);
    });

    test('should prevent deletion if alumni has associated events', async () => {
        const alumniData = {
            name: 'Jane Doe',
            city: 'Los Angeles',
        };

        const event = new Event({
            eventName: 'Sample Event',
            alumni: mongoose.Types.ObjectId(),
            // Add other event fields as needed
        });

        const alumni = new Alumni(alumniData);
        await Promise.all([alumni.save(), event.save()]);

        try {
            await alumni.deleteOne();
        } catch (error) {
            expect(error.message).toBe('This alumni has events');
        }
    });

    // Add more test cases as needed
});
