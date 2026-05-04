const express = require('express');
const app = express();
// const morgan = require('morgan');

// app.use(express.json());
// app.use(morgan('tiny'));

// morgan.token('body', (req) => { 
//   return JSON.stringify(req.body); 
// });

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)
app.use(express.static('dist'))
app.use(express.json())


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
})

app.get('/api/persons', (request, response) => {
  response.json(persons);
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.send(person);
  } else {
    res.status(404).send(`Person with id:${id} is NOT FOUND.`);
  }
})

app.get('/info', (req, res) => {
  res.send(`
    <p>
      Phonebook has info for ${persons.length} people.
      <br/>
      ${Date()}
    </p>`
  )
}) 

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.send(`Deleted person with id:${id}.`);
})

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.floor(Math.random() * (200 - 5 + 1)+ 5) : 0;
  return String(maxId + 1)
}

app.post('/api/persons/', (req, res) => {
  const body = req.body;
  if (!body.name || !body.number){
    return res.status(400).json({
      error: 'name or number missing',
    })
  }

  const nameExists = persons.some(
    p => p.name.toLowerCase() === body.name.toLowerCase()
  );

  if (nameExists) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    id: generateId(),
    number: body.number,
    name: body.name
  }

  persons = persons.concat(person);
  res.status(201).send(person);

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server running on port ${PORT}`)
})