//task import express
import express from 'express';

//task import router
import moviesRouter from './routers/movieRouter.js';
import cors from 'cors'

//task import middleware gestioneIMG
import imagePathMiddleware from './middlewares/handleImagePath.js';

//task impostazione express e porta server
const app = express();
const port = process.env.SERVER_PORT || 3000;
const frontend = process.env.FRONTEND_PORT

//task middleware cors
app.use(cors({
    origin: frontend //porta standard react nascosta dal .env
}))

//task middleware gestionePathIMG
app.use(imagePathMiddleware)

//task middleware asset statico
app.use(express.static('public'))

//task middleware bodyParse
app.use(express.json())

//task monto il router
app.use('/movies', moviesRouter)


//task attivazione server
app.listen(port, () => {
    console.log(`server in ascolto sulla porta ${port}`)
})