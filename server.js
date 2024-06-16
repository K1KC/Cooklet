const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const IngredientModel = require('./models/ingredient.model');
const RecipeModel = require('./models/recipe.model');
const UserModel = require('./models/user.model');
const connectDB = require('./connectdb');
const auth = require('./auth');

connectDB();

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use('/result', express.static(path.join(__dirname, 'result')));
app.use('/resources', express.static(path.join(__dirname, 'resources')));

app.get('/test', (req, res) => {
    res.send('Server is running');
});

app.get('/api/ingredients', async (req, res) => {
    try {
        const ingredients = await IngredientModel.find({}, 'ingredient_name');
        res.json(ingredients);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/searchIngredient', async (req, res) => {
    const { ingredientIds } = req.body;

    if (!ingredientIds || !Array.isArray(ingredientIds) || ingredientIds.length === 0) {
        return res.status(400).json({ error: 'No search parameters provided or invalid parameters' });
    }

    try {
        const recipes = await RecipeModel.find({ ingredient_ids: { $all: ingredientIds } }).populate('recipe_maker', 'username');
        console.log('Recipes with populated makers:', recipes);  // Log the recipes
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/searchName', async (req, res) => {
    const { name } = req.body;
    console.log('Search request received with parameters:', req.body);

    try {
        let recipes;
        if (name) {
            recipes = await RecipeModel.find({ recipe_name: new RegExp(name, 'i') })
                .populate('recipe_maker', 'username');
            console.log('Found recipes:', recipes);
        } else {
            return res.status(400).json({ error: 'No search parameters provided' });
        }

        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/users', async (req, res) => {
    try {
        const users = await UserModel.find({}, 'username');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new UserModel({
            username,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, 'IniCeritanyaToken', {
            expiresIn: 360000
        }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true }).json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login User
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, 'IniCeritanyaToken', {
            expiresIn: 360000
        }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true }).json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Protected Route Example
app.get('/api/profile', auth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Logout User
app.get('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.send('Logged out successfully');
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
