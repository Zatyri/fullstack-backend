const mongoose = require('mongoose')
require('dotenv').config()

if(process.env.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

//const password = process.env.PASSWORD

const url = process.env

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number,
})

const Person = mongoose.model('Person', phonebookSchema)

const addPerson = () => {

    const person = new Person({
        name: process.argv[2],
        number: process.argv[3],   
    })

    person.save().then(res => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close()
    })
}

const find = () => {
    Person.find({}).then(res => {
    res.forEach(person => {
        console.log(person);
        
    })
    mongoose.connection.close()
    })
}

const numOfArgs = process.argv.length

if(numOfArgs === 2){
    find()
} else if(numOfArgs === 4){
    addPerson()
} else {
    console.log('invalid request');
    
}