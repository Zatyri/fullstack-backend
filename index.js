const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :input'))
morgan.token('input', function (req, res) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

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

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id) 
    if(person) {
        res.json(person)
    } else {       
        
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    persons = persons.filter(person => person.id !== id)
    if(person) {
        res.status(204).end()
        res.send()
    } else {       
        
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const person = req.body


    if(checkDataValidity(person)){
        res.status(400).json({
            error: 'Name missing or not unique'
        })
    } else {        
        person.id = idGenerator()
        persons = persons.concat(person)
    res.json(persons)    
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


const idGenerator = () => {
    while(true){
        let id = Math.floor(Math.random() * 100) + 1
        const excists = persons.find(person => person.id === id)
        if(!excists){
            return id
        }
    }
}

const checkDataValidity = (person) => {
    const name = person.name
    const number = person.number
    if(name.length === 0 || number.length === 0){
        return true
    } else if(persons.find(pers => pers.name === name)){
        return true
    } 
    return false
}

