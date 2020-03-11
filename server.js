const express = require('express')
const app = express()
const routes = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(routes)

// Handle Invalid Route
app.use('*', (req, res) => res.sendStatus(404))

// Error Handling
app.use((err, req, res, next) => {
    const status = err.status || 500
    const error = err.message || 'Internal Server Error'
    // Set the error status and content
    res.status(status).send(error)
})

module.exports = app
