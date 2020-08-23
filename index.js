const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :input'))
morgan.token('input', function (req, res) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.get('/info', (req, res) => {
    let howManyPersons = Person.length   
    
    let currentDate = new Date()
    const info = `<p>Phonebook has info for ${howManyPersons} persons</p> <p>${currentDate}</p>`
    res.send(info)
})

app.get('/api/persons', (req, res) => {    
    Person.find({}).then(persons => {        
        res.json(persons)        
        })   
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.find({id})
        .then(person => { 
            console.log(person)                   
            if(person[0]){
                res.json(person)
            } else {
                console.log('iran');
                
                res.status(404).end()
            }
        })
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
    res.json(person)    
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

