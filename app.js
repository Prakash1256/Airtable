const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const userModel = require('./models/user');

// Set the view engine to EJS
app.set("view engine", "ejs");

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up a static folder for serving static files like CSS, JS, images
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection with error handling
mongoose.connect("mongodb://127.0.0.1:27017/testapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected successfully!");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Route to render the index.ejs file
app.get('/', (req, res) => {
    res.render("index");
});

// Route to read users
app.get('/read', async (req, res) => {
    try {
        let users = await userModel.find();
        res.render("read", { users });
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Create user route
// Example for handling unique email constraint
app.post('/create', async (req, res) => {
    try {
        let { name, email, image } = req.body;

        let existingUser = await userModel.findOne({ email });
        if (existingUser) {
            throw new Error("Email already exists");
        }

        let newUser = await userModel.create({ name, email, image });
        console.log("User created:", newUser);

        res.redirect("/read");
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).send(error.message);
    }
});



// Delete user route
app.get('/delete/:id', async (req, res) => {
    try {
        await userModel.findOneAndDelete({ _id: req.params.id });
        res.redirect("/read");
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Route to edit user form
app.get('/edit/:id', async (req, res) => {
    try {
        let user = await userModel.findOne({ _id: req.params.id });
        res.render("edit", { user });
    } catch (error) {
        console.error('Error fetching user for edit:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Update user route
app.post('/update/:id', async (req, res) => {
    try {
        let { name, email, image } = req.body;
        await userModel.findOneAndUpdate({ _id: req.params.id }, { name, email, image }, { new: true });
        res.redirect("/read"); // Corrected to redirect instead of rendering directly
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
