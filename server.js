const exp = require('express')
const {
    db,
    Vendors,
    Products,
    Cart,
    Users
} = require('./db')

const app = exp()

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
app.get('/vendor', async (req, res) => {

    // returns the list of vendors
    const vendors = await Vendors.findAll()
    res.send(vendors)
})

app.post('/vendor', async (req, res) => {

    try {

        // check if name already exist
        let vendorCnt = await Vendors.count({ where: { name: req.body.name } })
        if (vendorCnt > 0) {
            throw new Error('Vendor Already Exist!')
        }

        const result = await Vendors.create({
            name: req.body.name
        })
        res.send({ success: true })
    } catch (e) {
        res.send({ success: false, error: e.message })
    }
})

app.delete('/vendor/:id', async (req, res) => {

    // delete the vendor
    try {
        let vendorCnt = await Vendors.count({ where: { id: req.params.id } })
        if (vendorCnt == 0) {
            throw new Error('Vendor Does not Exist!')
        }
        await Vendors.destroy({where:{id:req.params.id}})

        // delete all products related to this vendor
        await Products.destroy({where:{vendor_id : req.params.id}})
        
        // TODO : remove products from all the carts for this vendor
        // Cart.destroy({where : {}})

        res.send({success:true})

    } catch (e) {
        res.send({ success: false, error: e.message })
    }
})


// Product
app.get('/product', async (req, res) => {

    // List all the products
    const products = await Products.findAll()
    res.send(products)
})

app.post('/product', async (req, res) => {

    // check if product name already exist
    try {

        // check if name already exist
        let productCnt = await Products.count({ where: { name: req.body.name, vendor_id : req.body.vendor_id } })
        if (productCnt > 0) {
            throw new Error('Product Already Exist for this vendor!')
        }

        let vendorCnt = await Vendors.count({ where: { id : req.body.vendor_id } })
        if (vendorCnt == 0) {
            throw new Error('vendor doesnot exist!')
        }

        if (req.body.price < 0) {
            throw new Error('Price can not be negative')
        }

        if (req.body.quantity == 0) {
            throw new Error('Quantity can not be negative')
        }


        const result = await Products.create({
            name: req.body.name,
            price : req.body.price,
            vendor_id : req.body.vendor_id,
            quantity : req.body.quantity,
        })

        res.send({ success: true })
    } catch (e) {
        res.send({ success: false, error: e.message })
    }
})

app.delete('/product/:pid', async (req, res) => {

    // remove the product
    // remove that product from the cart

    try {
        let productCnt = await Products.count({ where: { id:req.params.pid } })
        if (productCnt == 0) {
            throw new Error('Product does not exist!')
        }

        Products.destroy({where:{id:req.params.pid}})
        res.send({success:true})

    } catch (e) {
        res.send({ success: false, error: e.message })
    }
})


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