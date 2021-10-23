const express = require('express')
const session = require('express-session')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({'secret': 'mysecret',
 saveUninitialized: false,
  resave: false,
    }))

app.get('/', (req, res)=>{
    req.session.cart = []
    if(req.session.cart){
        res.send(req.session.cart)
    }else{
        res.send('null')
    }
})

app.get('/login', (req, res)=>{
    res.send(req.session.cart)
})


app.get('/user/:id', (req, res)=>{
    res.send(req.params.id)
})

app.listen(5000,(err)=>{
    console.log('server is running for session testing')
})