import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import http from 'http';
import cors from 'cors';
import https from 'https';
import fs from "fs";

const app = express();
const port = 3000;

/*
const server = https.createServer({
    key: fs.readFileSync('privkey.pem'),
    cert: fs.readFileSync('fullchain.pem')
}, app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET","POST"],
    }
});*/

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

const secretKey = '3eaf50158d956cef59f00c45a42cabb143a8c6e8e26492ab8bac12dd6a2a2221';

/*
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
}*/

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
        const postURL = `https://api.thenexusbattles2.cloud/carrito/api/cartshop/`;
        //const postURL = 'http://127.0.0.1:8001/api/cartshop/';
        console.log(userID)
        console.log(id_carta,price,nombre_carta)
        const cartItem = {
            id_carta: id_carta,
            nombre_carta:nombre_carta,
            price: price,
            user: userID
        }
        axios.post(postURL, cartItem).then((response) =>{
            //sendCartUpdateToClients(io,response.data);
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
        const postURL = `https://api.thenexusbattles2.cloud/carrito/api/cart/remove/`;
        //const postURL = 'http://127.0.0.1:8001/api/cart/remove/';
        console.log(userID)
        const cartItem = {
            id_carta: id_carta,
            user: userID
        }
        axios.post(postURL, cartItem).then((response) =>{
            //sendCartUpdateToClients(io,response.data);
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
        const postURL = `https://api.thenexusbattles2.cloud/carrito/api/cart/delete/`;
        //const postURL = 'http://127.0.0.1:8001/api/cart/delete/';
        console.log(userID)
        const cartItem = {
            id_carta: id_carta,
            user: userID
        }
        axios.post(postURL, cartItem).then((response) =>{
            //sendCartUpdateToClients(io,response.data);
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
        const postURL = `https://api.thenexusbattles2.cloud/carrito/api/cart/`;
        //const postURL = `http://127.0.0.1:8001/api/cart/`;
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

//borrar carrito
app.post('/vaciar-carrito', (req, res) => {
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
        const postURL = `https://api.thenexusbattles2.cloud/carrito/api/cart/vaciar/`;
        //const postURL = `http://127.0.0.1:8001/api/cart/vaciar/`;
        console.log(userID)
        const payment = {
            'user':userID,
        }
        axios.post(postURL,payment).then((response) =>{
            res.json(response.data)
        }).catch((error)=>{
            console.log('Error al crear orden',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        })
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
        const postURL = `https://api.thenexusbattles2.cloud/pagos/api/order/`;
        //const postURL = 'http://127.0.0.1:8003/api/order/';
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

//ver orden
app.get('/obtener-orden/:orderId', async(req, res) => {
    const orderId = req.params.orderId;
    const postURL = `https://api.thenexusbattles2.cloud/pagos/api/order/${orderId}/`;
    //const postURL = `http://127.0.0.1:8003/api/order/${orderId}/`;
    try{
        const response = await axios.get(postURL);
        res.json(response.data);
    }catch(error){
        console.log('Error al obtener los datos',error);
        res.status(500).json({ message: 'Error en el servidor web' });
    }


});

//pagar orden de compra
app.post('/pagar-orden', async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const tokenValue = token.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(tokenValue, secretKey);
        const userID = decoded.user_id;
        const { paymentID, status, order_id, order_total } = req.body;

        //const postURL = 'http://127.0.0.1:8003/api/payment/';
        const postURL = 'https://api.thenexusbattles2.cloud/pagos/api/payment/'
        //const postURL2 = 'http://127.0.0.1:8004/api/agg_inventario/';
        const postURL2 = 'https://api.thenexusbattles2.cloud/perfil/api/agg_inventario/'

        const payment = {
            'user': userID,
            'paymentID': paymentID,
            'status': status,
            'order_id': order_id,
            'order_total': order_total
        };

        const inventary = {
            'user': userID,
            'order_id': order_id
        };

        // Esperar a que ambas solicitudes se completen
        const [paymentResponse, inventoryResponse] = await Promise.all([
            axios.post(postURL, payment),
            axios.post(postURL2, inventary)
        ]);
        res.json({
            paymentResponse: paymentResponse.data,
            inventoryResponse: inventoryResponse.data
        });
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(401).json({ message: 'Token inválido' });
    }
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
        const postURL = `https://api.thenexusbattles2.cloud/perfil/api/perfil/${userID}/`;
        //const postURL = `http://127.0.0.1:8004/api/perfil/${userID}`;
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
        const postURL = `https://api.thenexusbattles2.cloud/ldap/api/getuser/`;
        //const postURL = `http://127.0.0.1:8000/api/getuser/`;
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
        const postURL = `https://api.thenexusbattles2.cloud/perfil/api/inventario/${userID}/`;
        //const postURL = `http://127.0.0.1:8004/api/inventario/${userID}`;
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

//comprar partidas
app.post('/comprar-membresia', (req, res) => {
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
        const { games } = req.body;
        const postURL = `https://api.thenexusbattles2.cloud/perfil/api/perfil/${userID}/`;
        //const postURL = `http://127.0.0.1:8004/api/perfil/${userID}/`;
        console.log(userID)
        const cartItem = {
            'games':games
        }
        axios.post(postURL,cartItem).then((response) =>{
            res.json(response.data)
        }).catch((error)=>{
            console.log('Error al crear orden',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        })
    });

});


//externos//

//crear comentarios
app.post('/crear-comentarios', (req, res) => {
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
        const {comentariosTexto,comentariosImg,id_carta,} = req.body;
        const postURL = ``;
        console.log(userID)
        const payment = {
            'comentariosUserName':userID,
            'comentariosTexto':comentariosTexto,
            'comentariosImg':comentariosImg,
            'idCarta':id_carta
        }
        axios.post(postURL,payment).then((response) =>{
            res.json(response.data)
        }).catch((error)=>{
            console.log('Error al crear orden',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        })
    });

});

//ver comentarios
app.get('/ver-comentarios', (req, res) => {

        const {id_carta,} = req.body;
        const postURL = `http://alpha.bucaramanga.upb.edu.co:3000/api/comentariosCartas`;
        console.log(userID)
        const payment = {
            'idCarta':id_carta,
        }
        axios.get(postURL,payment).then((response) =>{
            res.json(response.data)
        }).catch((error)=>{
            console.log('Error al crear orden',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        })
});

//Login de Gestion cartas
app.post('/login-gestion', (req, res) => {
try{
    const {username,password,} = req.body;
    
    const loginURL ='https://api.thenexusbattles2.cloud/ldap/api/token/'
    const payment = {
        username:username,
        password:password,
    }
    axios.post(loginURL,payment).then((response) =>{
        const accessToken = response.data.access;
        jwt.verify(accessToken,secretKey, (err, decoded) =>{
            const rol = decoded.is_admin
            res.json({'access':accessToken,'admin':rol})
        })
        
    }).catch((error)=>{
        console.log('Error en el servidor web',error);
        res.status(500).json({ message: 'Error en el servidor web' });
    })
}catch(e){
    console.log(e)
}
});

//Lista de deseo agregar
app.post('/lista-deseo', (req, res) => {
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
        //const postURL = `https://api.thenexusbattles2.cloud/carrito/api/cartshop/`;
        const postURL = 'http://localhost:9000/api/lista/insertar';
        const cartItem = {
            idproducto: id_carta,
            idcliente: userID
        }
        axios.post(postURL, cartItem).then((response) =>{
            res.json(response.data)
        }).catch((error)=>{
            console.log('Error al agregar',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        })
    });

});

//ver lista de deseo
app.get('/ver-lista-deseo', (req, res) => {
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
        //const postURL = `https://api.thenexusbattles2.cloud/carrito/api/cartshop/`;
        const postURL = `http://localhost:9000/api/lista/${userID}`;
        axios.get(postURL).then((response) =>{
            res.json(response.data)
        }).catch((error)=>{
            console.log('Error al agregar',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        })
    });

});

//borrar item de lista de deseo
app.post('/borrar-deseo', (req, res) => {
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
        //const postURL = `https://api.thenexusbattles2.cloud/carrito/api/cartshop/`;
        const postURL = `http://localhost:9000/api/lista/eliminar/${id_carta}`;
        axios.delete(postURL).then((response) =>{
            res.json(response.data)
        }).catch((error)=>{
            console.log('Error al agregar',error);
            res.status(500).json({ message: 'Error en el servidor web' });
        })
    });

});


app.listen(port, () => {
    console.log('Servidor escuchando en el puerto', port);
});

