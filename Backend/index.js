const connectToMongo = require("./db");
const express = require('express')
var cors = require('cors') 

connectToMongo();

const app = express()
const port = 5000


app.use(cors())
// Available routes 
app.use(express.json());

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`inotebook App : listening on port at http://localhost:${port}`)
})

// keep in mind that use npx nodemon <fileName.js> to connect the server don't use only nodemon <fileName.js>