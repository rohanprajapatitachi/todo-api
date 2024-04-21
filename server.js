// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


// Initialize express app
const app = express();

// Configure express app
app.use(express.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

// Define port
const port = 3000;


const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);


app.get('/abc', (req, res) => {res.send('Hello World!')})

app.post('/create-todo', async (req, res) => {

    try {
        const todo = new Todo({
            title: req.body.title,
            description: req.body.description,
            completed: req.body.completed
        });

        await todo.save();
        res.status(201).send(todo);
    } catch (err) {
        res.status(400).send(err);
    }
});


// GET API to fetch all todos
app.get('/read-todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.send(todos);
    } catch (err) {
        res.status(500).send(err);
    }
});

// GET API to fetch a specific todo by id
app.get('/single-todo/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).send();
        }
        res.send(todo);
    } catch (err) {
        res.status(500).send(err);
    }
});

// PUT API to update a specific todo by id
app.put('/update-todo/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!todo) {
            return res.status(404).send();
        }
        res.send(todo);
    } catch (err) {
        res.status(400).send(err);
    }
});

// DELETE API to delete a specific todo by id
app.delete('/delete-todo/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).send();
        }
        res.send(todo);
    } catch (err) {
        res.status(500).send(err);
    }
});


async function main() {
    try {
        await mongoose.connect('mongodb+srv://sanjay:12345@cluster0.sa4sbyc.mongodb.net/sg-tech-store?retryWrites=true&w=majority');
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
    }
}

main()


app.listen(port, () => {console.log(`Example app listening on port ${port}`)})