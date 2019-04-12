
const express = require('express')
const product = express.Router()

const {
    Vendors,
    Products
} = require('../db')


product.get('/', async (req, res) => {

    // List all the products
    const products = await Products.findAll()
    res.send(products)
})

product.post('/', async (req, res) => {

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

product.delete('/:pid', async (req, res) => {

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

module.exports = product