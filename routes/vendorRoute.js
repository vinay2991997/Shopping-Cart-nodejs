
const express = require('express')
const vendor = express.Router()

const {
    Vendors,
    Products
} = require('../db')

vendor.get('/', async (req, res) => {

    // returns the list of vendors
    const vendors = await Vendors.findAll()
    res.send(vendors)
})

vendor.post('/', async (req, res) => {

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

vendor.delete('/:id', async (req, res) => {

    // delete the vendor
    try {
        let vendorCnt = await Vendors.count({ where: { id: req.params.id } })
        if (vendorCnt == 0) {
            throw new Error('Vendor Does not Exist!')
        }
        await Vendors.destroy({where:{id:req.params.id}})

        res.send({success:true})

    } catch (e) {
        res.send({ success: false, error: e.message })
    }
})

module.exports = vendor