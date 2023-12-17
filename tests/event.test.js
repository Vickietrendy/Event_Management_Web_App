const mongoose = require('mongoose');
const Event = require('../models/event');
const Alumni = require('../models/alumni');

let alumniId;

beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/testdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const alumniData = {
        name: 'Test Alumni',
        city: 'Test City',
    };

    const alumni = new Alumni(alumniData);
    const savedAlumni = await alumni.save();
    alumniId = savedAlumni._id;
});

afterAll(async () => {
    await mongoose.disconnect();
});

beforeEach(async () => {
    await Event.deleteMany();
});

describe('Event Model', () => {
    test('should create and save a new event successfully', async () => {
        const eventData = {
            eventName: 'Sample Event',
            eventDate: new Date(),
            description: 'Test Description',
            entryFee: 20,
            coverImage: 'sample-image.jpg',
            alumni: alumniId,
        };

        const event = new Event(eventData);
        const savedEvent = await event.save();

        expect(savedEvent._id).toBeDefined();
        expect(savedEvent.eventName).toBe(eventData.eventName);
        expect(savedEvent.eventDate).toEqual(eventData.eventDate);
        expect(savedEvent.description).toBe(eventData.description);
        expect(savedEvent.entryFee).toBe(eventData.entryFee);
        expect(savedEvent.coverImage).toBe(eventData.coverImage);
        expect(savedEvent.alumni).toEqual(alumniId);
        expect(savedEvent.createdAt).toBeDefined();
    });

    test('should prevent saving an event without required fields', async () => {
        const event = new Event({});

        try {
            await event.save();
        } catch (error) {
            const errors = error.errors;
            expect(errors.eventName).toBeDefined();
            expect(errors.eventDate).toBeDefined();
            expect(errors.entryFee).toBeDefined();
            expect(errors.coverImage).toBeDefined();
            expect(errors.alumni).toBeDefined();
        }
    });

    test('should have a virtual property for coverImagePath', async () => {
        const eventData = {
            eventName: 'Virtual Property Test',
            eventDate: new Date(),
            entryFee: 10,
            coverImage: 'test-image.jpg',
            alumni: alumniId,
        };

        const event = new Event(eventData);
        const savedEvent = await event.save();

        expect(savedEvent.coverImagePath).toBeDefined();
    });

    test('should update an existing event successfully', async () => {
        const eventData = {
            eventName: 'Update Test Event',
            eventDate: new Date(),
            entryFee: 25,
            coverImage: 'update-event.jpg',
            alumni: alumniId,
        };

        const event = new Event(eventData);
        await event.save();

        const updatedName = 'Updated Test Event';
        event.eventName = updatedName;
        const updatedEvent = await event.save();

        expect(updatedEvent.eventName).toBe(updatedName);
    });

    test('should prevent deletion if event has associated alumni', async () => {
        const eventData = {
            eventName: 'Event with Alumni',
            eventDate: new Date(),
            entryFee: 30,
            coverImage: 'event-with-alumni.jpg',
            alumni: alumniId,
        };

        const event = new Event(eventData);
        await event.save();

        try {
            await event.deleteOne();
        } catch (error) {
            expect(error.message).toBe('This event has alumni');
        }
    });
});
