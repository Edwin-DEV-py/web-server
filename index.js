import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import http from 'http';
import cors from 'cors';

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET","POST"],
    }
});

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

const secretKey = '3eaf50158d956cef59f00c45a42cabb143a8c6e8e26492ab8bac12dd6a2a2221';

//configuracion del socket
io.on('connection', (socket) => {
    console.log('Cliente conectado a WebSocket');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado de WebSocket');
    });
});

//socket
function sendCartUpdateToClients(socket, updatedCartData) {
    socket.emit('cartUpdated', updatedCartData);
}

//agregar al carrito
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
        const {id_carta, price,nombre_carta} = req.body;
        //const postURL = `http://104.40.30.239:8001/api/cartshop/`;
        const postURL = 'http://127.0.0.1:8001/api/cartshop/';
        console.log(userID)
        const cartItem = {
            id_carta: id_carta,
            nombre_carta:nombre_carta,
            price: price,
            user: userID
        }
        axios.post(postURL, cartItem).then((response) =>{
            sendCartUpdateToClients(io,response.data);
            res.json(response.data)
        }).catch((error)=>{
            console.log('Error al agregar',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        })
    });

});

//remover del carrito
app.post('/remover-carta', (req, res) => {
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
        const {id_carta} = req.body;
        //const postURL = `http://104.40.30.239:8001/api/cart/remove/`;
        const postURL = 'http://127.0.0.1:8001/api/cart/remove/';
        console.log(userID)
        const cartItem = {
            id_carta: id_carta,
            user: userID
        }
        axios.post(postURL, cartItem).then((response) =>{
            sendCartUpdateToClients(io,response.data);
            res.json(response.data)
        }).catch((error)=>{
            console.log('Error al agregar',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        })
    });

});

//borrar del carrito
app.post('/borrar-carta', (req, res) => {
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
        const {id_carta} = req.body;
        //const postURL = `http://104.40.30.239:8001/api/cart/delete/`;
        const postURL = 'http://127.0.0.1:8001/api/cart/delete/';
        console.log(userID)
        const cartItem = {
            id_carta: id_carta,
            user: userID
        }
        axios.post(postURL, cartItem).then((response) =>{
            sendCartUpdateToClients(io,response.data);
            res.json(response.data)
        }).catch((error)=>{
            console.log('Error al agregar',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        })
    });

});

//ver el carrito
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
        //const postURL = `http://104.40.30.239:8001/api/cart/`;
        const postURL = `http://127.0.0.1:8001/api/cart/`;
        const cartItem = {
            user: userID
        }
        try{
            const response = await axios.get(postURL,{data: cartItem});
            res.json(response.data);
        }catch(error){
            console.log('Error al obtener los datos',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        }
    });

});

//crear orden de compra
app.post('/crear-orden', (req, res) => {
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
        //const postURL = `http://104.40.30.239:8001/api/cart/remove/`;
        const postURL = 'http://127.0.0.1:8003/api/order/';
        console.log(userID)
        const cartItem = {
            'user':userID
        }
        axios.post(postURL,cartItem).then((response) =>{
            res.json(response.data)
        }).catch((error)=>{
            console.log('Error al crear orden',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        })
    });

});

//pagar orden de compra
app.post('/pagar-orden', (req, res) => {
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
        const {paymentID,status,order_id,order_total} = req.body;
        //const postURL = `/api/payment/`;
        const postURL = 'http://127.0.0.1:8003/api/payment/';
        console.log(userID)
        const payment = {
            'user':userID,
            'paymentID':paymentID,
            'status':status,
            'order_id':order_id,
            'order_total':order_total
        }
        axios.post(postURL,payment).then((response) =>{
            res.json(response.data)
        }).catch((error)=>{
            console.log('Error al crear orden',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        })
    });

});


//ver mi perfil
app.get('/ver-perfil', async(req, res) => {
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
        //const postURL = `http://104.40.30.239:8001/api/cart/`;
        const postURL = `http://127.0.0.1:8004/api/perfil/${userID}`;
        const cartItem = {
            user: userID
        }
        try{
            const response = await axios.get(postURL,{data: cartItem});
            res.json(response.data);
        }catch(error){
            console.log('Error al obtener los datos',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        }
    });

});

//ver informacion de usuario
app.get('/ver-informacion-perfil', async(req, res) => {
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
        //const postURL = `http://104.40.30.239:8001/api/cart/`;
        const postURL = `http://127.0.0.1:8002/api/getuser/`;
        const userItem = {
            user: userID
        }
        try{
            const response = await axios.get(postURL,{data: userItem});
            res.json(response.data);
        }catch(error){
            console.log('Error al obtener los datos',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        }
    });

});

//Obetener inventario
app.get('/ver-inventario', async(req, res) => {
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
        //const postURL = `http://104.40.30.239:8001/api/cart/`;
        const postURL = `http://127.0.0.1:8004/api/inventario/${userID}`;
        const cartItem = {
            user: userID
        }
        try{
            const response = await axios.get(postURL,{data: cartItem});
            res.json(response.data);
        }catch(error){
            console.log('Error al obtener los datos',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        }
    });

});


server.listen(port, () => {
    console.log('Servidor escuchando en el puerto', port);
});




