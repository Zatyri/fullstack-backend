const express = require('express')
const app = express()

let persons = [  
    {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
    },
    {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
    },
    {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
    },
    {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
    }    
]

let howManyPersons = persons.length
let currentDate = new Date()

const info = `<p>Phonebook has inf for ${howManyPersons}</p> <p>${currentDate}</p>`

app.get('/info', (req, res) => {
    res.send(info)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})


const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`);



