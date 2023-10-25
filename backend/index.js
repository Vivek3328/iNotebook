const express = require('express')
var cors = require('cors')
const app = express()
const port = 5000
const connectToMongo = require('./db');

connectToMongo();

app.use(cors())

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`iNotebook app listening on port ${port}`)
})