const Sequelize = require('sequelize')
const Op = Sequelize.Op


const db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/shoppingCart.db'
})

const Users = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

const Vendors = db.define('vendor', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

const Products = db.define('product', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

const Cart = db.define('cart', {
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

Products.belongsTo(Vendors, {onDelete: 'cascade'})
Vendors.hasMany(Products, { onDelete: 'cascade' })

Cart.belongsTo(Products, {onDelete: 'cascade'})
Cart.belongsTo(Users, {onDelete: 'cascade'})
Users.hasMany(Cart, {onDelete: 'cascade'})
Products.hasMany(Cart, {onDelete: 'cascade'})

module.exports = {
    db, Vendors, Products, Cart, Users
}