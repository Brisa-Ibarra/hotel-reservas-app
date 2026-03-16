import express from 'express';
import './database';
import userRoutes from './routes/userRoutes'
import roomRoutes from './routes/roomRoutes'
import reservationRoutes from './routes/reservationRoutes'

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/users', userRoutes);
app.use('/rooms', roomRoutes);
app.use('/reservations', reservationRoutes)

app.get('/', (req, res) => {
    res.json({message: 'Hotel Reservas API'});
})

app.listen(PORT, ()=> {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

export default app;