const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const userModel = require('./UserDb')
const productModel = require('./ProductDb')
const bcrypt = require('bcrypt')
const orderModel = require('./OrderDb')

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({'secret': 'mysecret',
 saveUninitialized: false,
  resave: false,
  cookie: {maxAge: 60000}
    }))
 

app.use(cookieParser())

app.get('/', (req, res)=>{
  res.sendFile(__dirname+'/page/home.html')
  console.log(req.sessionID)
})

app.get('/login', (req, res)=>{
  res.sendFile(__dirname+'/page/login.html')
 console.log(req.body)
})

app.get('/signup', (req, res)=>{
    res.sendFile(__dirname+'/page/signup.html')
    console.log('sign up page opened')
    console.log(req.sessionID)
})

app.get('/user', (req, res )=>{
    res.sendFile(__dirname+'/page/user.html')
})


app.post('/login', (req, res)=>{

    if(req.session){
        if(req.session.email){
            userModel.findOne({email: req.session.email}, (err, data)=>{
                if(err){
                    res.send(err)
                }else{
                    if(data){
                        res.send('already login')
                    }else{
                        res.send('session exired login again')
                    }
                }
            })
        }else{
            if(req.body.email&& req.body.password){

                userModel.findOne({email: req.body.email.trim()}, async (err, data)=>{
                    if(err){
                        res.send(err)
                    }else{
                        if(data){
                            const t = await bcrypt.compare(req.body.password.trim(), data.password)
                            if(t){
                                req.session.email = req.body.email.trim()
                                req.session.cart = []
                                res.send('login succesfull')
                             } else{
                                res.send('password incorrect')
                            }}}})
            
        
            }else{
                res.send('field can not be empty')
            }
        }
    }

    
})

app.get('/admin', (req, res)=>{
    res.sendFile(__dirname+'/page/product.html')
})

//add product by admin
app.post('/admin', (req, res)=>{
    let product = new productModel(req.body)
 
    product.save((err)=>{
        if(err){
            res.send(err)
        }else{
            res.send('product saved')
        }
    })
})




app.post('/signup', validate, (req, res )=>{
   // check user email/phone exists- middleware
   res.status(201).send({message: 'signup successful'})
    })

//delete user
app.post('/user/delete', (req, res)=>{
    
    if(req.session){
        if(req.session.email){
            if(req.body.password){
            userModel.findOne({email: req.session.email}, async (err, data)=>{
                if(err){
                    res.send(err)
                }else{
                    if(data){
                        let t = await bcrypt.compare(req.body.password.trim(), data.password)
                        if(t){
                            userModel.deleteOne({email: req.session.email}, (err)=>{
                                if(err){
                                    res.send({message: err})
                                }else{
                                    res.send({message: 'account deleted'})
                                }
                            })
                        }else{
                            res.send({message: 'password incorrect'})
                        }
                    }else{
                        res.send({message: 'user does not exists'})
                    }
                }
            })
        }else{
            res.send({message: 'confirm password'})
        }
    }else{
        res.send({message: 'access denied'})
    }
    }else{
        res.send({message: 'session not found'})
    }
})

//cart data to user
app.get('/user/cart', (req, res)=>{
    if(req.session){
        if(req.session.cart){
            res.send(req.session.cart)
        }else{
            res.send('access denied')
        }
    }
})

//cart data from user ?pid=djld & unit=2
app.get('/user/cart/add', (req, res)=>{
    
    if(req.session){
        if(req.session.cart){
            if(req.query.pid && req.query.unit){
                productModel.findOne({productId: req.query.pid}, (err, data)=>{
                    if(err){
                        res.send(err)
                    }else{
                        if(data){
                            req.session.cart.push({productId: data._id, unit: req.query.unit})
                        }else{
                            res.send('no such product')
                        }
                    }
                })
                  req.session.cart.push({productId: req.query.pid, unit: req.query.unit})
            }else{
                res.send('params can not be empty')
            }
        }else{
            res.send('access denied')
        }
    }

})
//place order
app.get('user/cart/order', (req, res)=>{
    if(req.session){
        if(req.session.email){
            userModel.findOne({email: req.session.email}, async (err, data)=>{
                if(err){
                    res.send(err)
                }else{
                    if(data){
                        if(req.session.cart.length > 0){
                        
                                    let orders = new orderModel()
                                    orders.products = req.session.cart
                                    orders.userId = data._id
                                    orders.placedAt = new Date()
                                    
                                    await orders.save((err)=>{
                                        if(err){
                                            res.send(err)
                                        }else{
                                            data.orderIds.push(orders._id)
                                            await data.save((err)=>{
                                                if(err){
                                                    res.send(err)
                                                }else{
                                                    res.send('order placed')
                                                }
                                            })
                                           
                                        }
                                    })
                                    
                        
                            }
                    
                        
                    }else{
                        res.send('email does not exists')
                    }
                
                }
            })
        }
        }else{
            res.send('access denied')
        }
    
    
})

app.get('/user/cart/order/info/:id', (req, res)=>{
    if(req.session){
        if(req.session.email){
            userModel.findOne({email: req.session.email}, (err, data)=>{
                if(err){
                    res.send(err)
                }else{
                    if(data){
                        orderModel.findOne({_id: req.params.id}, (err, data)=>{
                            if(err){
                                res.send(err)
                            }else{
                                if(data){
                                     res.send(data)
                                }else{
                                    res.send('order not found')
                                }
                            }
                        })
                    }else{
                        res.send('user not exists')
                    }
                }
            })
        }else{
            res.send('access denied')
        }
    }
})

app.get('/product', (req, res)=>{
    if(req.query.index && req.query.limit){
        productModel.find({index: {$gte: req.query.index}}).limit(req.query.limit).sort({index: 1}).exec((err, data)=>{
            if(data){
                res.send(data)
            }
        })
    }
})



app.listen(4000, ()=>{
    console.log('server is running')
})


function validate(req, res, next){
    //name addr landmark phone email password cnfpassword
    if(req.body.name && req.body.addr && req.body.landmark &&req.body.phone && req.body.email && req.body.password){
        let emailValidate = req.body.email.toLowerCase().trim().split('@')
        if(emailValidate.length>0){
            if(emailValidate[1]==='gmail.com' || emailValidate[1]==='gmail.co'){
                if(req.body.phone.trim().length=== 10){

                    userModel.findOne({email: req.body.email.trim()}, async (err, data)=>{
                        if(!err){
                            if(!data){
                                if(req.body.password.trim().length>8 && req.body.password.trim().length<16){
                                    if(req.body.password.trim() === req.body.confpass.trim()){
                                        const salt = await bcrypt.genSalt(10)
                                        const hpass = await bcrypt.hash(req.body.password.trim(), salt)

                                        let user = new userModel()
                                         user.userName = req.body.name.trim();
                                         user.address = req.body.addr.trim();
                                         user.landmark = req.body.landmark.trim();
                                         user.phone = req.body.phone.trim();
                                         user.email = req.body.email.trim();
                                         user.password = hpass;
                                         user.registeredAt = new Date()

                                         await user.save((err)=>{
                                            if(err){
                                                res.send(err)
                                                
                                            }else{
                                                next()
                                                
                                            }
                                        })

                                    }else{
                                        res.send('password not matched')
                                    }
                                }else{
                                    res.send('password length should be between 8 and 16')
                                }
                            }else{
                                res.send('email already taken')
                            }
                        }else{
                            res.send(err)
                        }
                    })
                }else{
                    res.send('invalid phone no')
                }
            }else{
                res.send('invalid email')
            }
        }else{
            res.send('invalid email')            
        }
    }else{
        res.send('field can not be empty')
    }
    
}
