const exp = require('express')
const {
    db,
    Vendors,
    Products,
    Cart,
    Users
} = require('./db')

const PORT = process.env.PORT || 5678

const app = exp()
const vendorRoute = require('./routes/vendorRoute')
const productRoute = require('./routes/productRoute')

app.use(exp.json())
app.use(exp.urlencoded({
    extended: true
}))

app.use('/',
    exp.static(__dirname + '/public'))

let currentUser = null
let currentUserId = null

// User
app.get('/users', async (req, res) => {
    const allUsers = await Users.findAll()
    res.send(allUsers)
})

app.get('/logout', async (req, res) => {
    currentUser = null
    currentUserId = null
    res.send("you have been loggedOut!!")
})

app.get('/login', async (req, res) => {
    try {
        let username = currentUser
        if (currentUser == null) {
            username = 'Anonymous'
            throw new Error()
        }
        res.send({success : true, message : `Hi ${username}`, user:username, userId:currentUserId})
    } catch (e) {
        res.send({success : false, message : `Hi Anonymous`, user:'Anonymous' , userId:-1})
    }
})

app.post('/login', async (req, res) => {
    const usrcnt = await Users.count({where : {name : req.body.name}})
    if (usrcnt == 0) {
        Users.create( {
            name : req.body.name
        })
    }
    currentUser = req.body.name
    currentUserId = (await Users.findOne({where : {name : req.body.name}})).id
    res.send({success : true, message : `Hi ${currentUser}`, user:currentUser, userId : currentUserId})
})


// Vendor
app.use('/vendor',vendorRoute)

// Product
app.use('/product', productRoute)

// Cart
app.get('/cart', async (req, res) => {

    // Display the list of products in cart
    try {
        if(currentUser == null){
            throw new Error('Please Login First')
        }
        const result = await Cart.findAll({
            where : {userId : currentUserId},
            include : [Products]
        })
        let total = 0
        for(let item of result ) {
            total += item.product.price * item.quantity
        }
        result.push({total : total})
        console.log(`Final Total : ${total}`)
        res.send(result)

    } catch (e) {
        res.send({success:false, error:e.message})
    }
})

app.post('/cart', async (req, res) => {

    try {

        if(currentUser == null){
            throw new Error('Please Login First')
        }

        const productCnt = await Cart.count({where : {productId : req.body.productId, userId : currentUserId}})
        if (productCnt == 0) {
            const result = await Cart.create({
                productId : req.body.productId,
                quantity : 1,
                userId : currentUserId
            })
        }
        else {
            await Cart.increment('quantity',{where : {productId : req.body.productId, userId : currentUserId}})
        }
        res.send({success:true, message:"Added to cart Successfully"})
    } catch (e) {
        res.send({success:false, error:e.message})
    }
})



db.sync()
    .then(() => {
        app.listen(PORT)
    })