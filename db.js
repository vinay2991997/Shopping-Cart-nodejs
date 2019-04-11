const Sequelize = require('sequelize')
const Op = Sequelize.Op


const db = new Sequelize({
    dialect : 'sqlite',
    storage : __dirname + '/shop.db'
})

const Users = db.define('user',{
    name : {
        type : Sequelize.STRING,
        allowNull : false
    }
})

const Vendors = db.define('vendor',{
    name : {
        type : Sequelize.STRING,
        allowNull : false
    }
})

const Products = db.define('product',{
    name : {
        type : Sequelize.STRING,
        allowNull : false
    },
    vendor_id :{
        type : Sequelize.INTEGER,
        allowNull : false
    },
    price : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    quantity : {
        type : Sequelize.INTEGER,
        allowNull : false
    }
})

const Cart = db.define('cart',{
    product_id : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    uname :{
        type : Sequelize.STRING,
        allowNull : false
    },
    quantity : {
        type : Sequelize.INTEGER,
        allowNull : false
    }
})

module.exports = {
    db, Vendors, Products, Cart, Users
}