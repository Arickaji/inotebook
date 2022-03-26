const connectToMongo = require("./db");
const express = require('express')
connectToMongo();

const app = express()
const port = 3000

// Available routes 
app.use(express.json());

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port at http://localhost:${port}`)
})

// keep in mind that use npx nodemon <fileName.js> to connect the server don't use only nodemon <fileName.js>