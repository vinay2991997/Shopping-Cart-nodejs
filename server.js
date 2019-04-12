const exp = require('express')
const {
    db,
    Vendors,
    Products,
    Cart,
    Users
} = require('./db')

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


// User
app.get('/users', async (req, res) => {
    const allUsers = await Users.findAll()
    res.send(allUsers)
})

app.get('/logout', async (req, res) => {
    currentUser = null
    res.send("you have been loggedOut!!")
})

app.get('/login', async (req, res) => {
    try {
        let username = currentUser
        if (currentUser == null) {
            username = 'Anonymous'
            throw new Error()
        }
        res.send({success : true, message : `Hi ${username}`, user:username})
    } catch (e) {
        res.send({success : false, message : `Hi Anonymous`, user:'Anonymous'})
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
    res.send({success : true, message : `Hi ${currentUser}`, user:currentUser})
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
        const result = await Cart.findAll({where : {uname : currentUser}})
        let total = 0
        let tempProduct = null
        for(let product of result ) {
            tempProduct = await Products.findOne({where : {id : product.product_id}})
            total += tempProduct.price * product.quantity
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

        const productCnt = await Cart.count({where : {product_id : req.body.product_id, uname : currentUser}})
        if (productCnt == 0) {
            const result = await Cart.create({
                product_id : req.body.product_id,
                quantity : 1,
                uname : currentUser
            })
        }
        else {
            await Cart.increment('quantity',{where : {product_id : req.body.product_id, uname : currentUser}})
        }
        res.send({success:true, message:"Added to cart Successfully"})
    } catch (e) {
        res.send({success:false, error:e.message})
    }
})



db.sync()
    .then(() => {
        app.listen(5678)
    })