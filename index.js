import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

const secretKey = '3eaf50158d956cef59f00c45a42cabb143a8c6e8e26492ab8bac12dd6a2a2221';

app.post('/enviar-token', (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const tokenValue = token.replace('Bearer ', '');

    jwt.verify(tokenValue, secretKey, (err, decoded) => {
        if (err) {
            console.error('Error al verificar el token:', err);
            return res.status(401).json({ message: 'Token inválido' });
        }
        const userID = decoded.user_id;
        const {id_carta, price} = req.body;
        const postURL = 'http://127.0.0.1:8000/api/cart/';
        console.log(userID)
        const cartItem = {
            id_carta: id_carta,
            price: price,
            user: userID
        }
        //console.log('id_carta:', id_carta);
        //console.log('price:', price);
        axios.post(postURL, cartItem)
    });

});

app.get('/obtener-carrito', async(req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const tokenValue = token.replace('Bearer ', '');

    jwt.verify(tokenValue, secretKey, async(err, decoded) => {
        if (err) {
            console.error('Error al verificar el token:', err);
            return res.status(401).json({ message: 'Token inválido' });
        }
        const userID = decoded.user_id;
        const postURL = `http://127.0.0.1:8000/api/cart/${userID}`;
        console.log("usuario",userID)
        try{
            const response = await axios.get(postURL);
            res.json(response.data);
        }catch(error){
            console.log('Error al obtener los datos',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        }
    });

});


app.listen(port, () => {
    console.log('Servidor escuchando en el puerto', port);
});




