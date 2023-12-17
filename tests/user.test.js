const mongoose = require('mongoose');
const User = require('../models/User');

beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/testdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});

beforeEach(async () => {
    await User.deleteMany();
});

describe('User Model', () => {
    test('should create and save a new user successfully', async () => {
        const userData = {
            username: 'testuser',
            password: 'testpassword',
            role: 'alumni',
        };

        const user = new User(userData);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe(userData.username);
        expect(savedUser.password).toBe(userData.password);
        expect(savedUser.role).toBe(userData.role);
    });

    test('should prevent saving a user without required fields', async () => {
        const user = new User({});

        try {
            await user.save();
        } catch (error) {
            const errors = error.errors;
            expect(errors.username).toBeDefined();
            expect(errors.password).toBeDefined();
            expect(errors.role).toBeDefined();
        }
    });

    test('should prevent saving a user with an invalid role', async () => {
        const userData = {
            username: 'invalidroleuser',
            password: 'testpassword',
            role: 'invalidrole',
        };

        const user = new User(userData);

        try {
            await user.save();
        } catch (error) {
            const errors = error.errors;
            expect(errors.role).toBeDefined();
            expect(errors.role.message).toBe('`invalidrole` is not a valid enum value for path `role`.');
        }
    });

    test('should update an existing user successfully', async () => {
        const userData = {
            username: 'updateuser',
            password: 'testpassword',
            role: 'alumni',
        };

        const user = new User(userData);
        await user.save();

        const updatedPassword = 'updatedpassword';
        user.password = updatedPassword;
        const updatedUser = await user.save();

        expect(updatedUser.password).toBe(updatedPassword);
    });

    test('should delete an existing user successfully', async () => {
        const userData = {
            username: 'deleteuser',
            password: 'testpassword',
            role: 'alumni',
        };

        const user = new User(userData);
        await user.save();

        await user.deleteOne();
        const foundUser = await User.findOne({ username: userData.username });

        expect(foundUser).toBeNull();
    });
});
