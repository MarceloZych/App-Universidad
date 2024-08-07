const express = require('express')
const cors = require('cors')
const app = express()
const db = require('./database/db')
const port = 3000
const estudianteRoutes = require('./routes/estudianteRoutes')
const profesorRoutes = require('./routes/profesorRoutes')

//middlewares
app.use(express.json())
app.use(cors())

app.get('/', (req,res) => {
    res.send('App Universidad')
})

app.use('/estudiantes', estudianteRoutes)
app.use('/profesor', profesorRoutes)

app.listen(port, ()=> {
    console.log(`Servidor escuchando en el puerto ${port}`)    
})