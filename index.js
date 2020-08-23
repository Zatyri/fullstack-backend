const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :input'))
morgan.token('input', function (req, res) { return JSON.stringify(req.body) })

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

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.find({id})
        .then(person => { 
            console.log(person)                   
            if(person[0]){
                res.json(person)
            } else {           
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {    
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const person = req.body
    
    person.id = idGenerator()
    const newPerson = new Person({
        name: person.name,
        number: person.number,
        id: person.id            
    })
    newPerson.save().then(addedPerson => {
        res.json(addedPerson)
    })
    .catch(error => next(error))
    
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const newPerson = {
        name: body.name,
        number: body.number,        
    }

    Person.findByIdAndUpdate(body.id, newPerson, {new: true})
        .then(updatedPerson => {
            res.json(updatedPerson)
        }) 
        .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


const idGenerator = () => {
    while(true){
        let id = Math.floor(Math.random() * 100) + 1
        return id
    }
}

const errorHandler = (error, request, response, next) => {
    console.log(error.message);
    
    if(error.name === 'CastError'){
        return response.status(400).send({error:'malformatted id'})
    } else if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
    next(error)
}

app.use(errorHandler)

