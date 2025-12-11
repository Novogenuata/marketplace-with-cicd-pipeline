import {Order, CartItem} from '../models/order.model'
import errorHandler from './../helpers/dbErrorHandler'
import Product from '../models/product.model' 

const saveTip = async (req, res) => {
  try {
    const { tip } = req.body
    
    res.json({ success: true, tip: Number(tip) || 0 })
  } catch (err) {
    console.error('SAVE TIP ERROR:', err)
    return res.status(400).json({ error: 'Tip save failed' })
  }
}



const getTip = async (req, res) => {
  try {
    const userId = req.auth._id  

    const order = await Order.findOne({
      user: userId,
      status: 'Draft'
    })

    res.json({ tip: order ? order.tip : 0 })
  } catch (err) {
    res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


const create = async (req, res) => {
  try {
    if (!req.body.order) {
      return res.status(400).json({ error: 'Order data missing' })
    }

    const { products } = req.body.order

    if (!products || products.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    const orderData = {
      ...req.body.order,
      user: req.profile,
      tip: Number(req.body.order.tip) || 0,
      status: 'Paid'
    }

    const order = new Order(orderData)
    const result = await order.save()


    for (const item of products) {
      const product = await Product.findById(item.product)
      if (product) {
        product.quantity -= item.quantity
        await product.save()
      }
    }

    res.status(200).json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}



const listByShop = async (req, res) => {
  try {
    let orders = await Order.find({"products.shop": req.shop._id})
      .populate({path: 'products.product', select: '_id name price'})
      .sort('-created')
      .exec()
    res.json(orders)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  try {
    let order = await Order.updateOne({'products._id':req.body.cartItemId}, {
        'products.$.status': req.body.status
    })
    res.json(order)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const getStatusValues = (req, res) => {
  res.json(CartItem.schema.path('status').enumValues)
}

const orderByID = async (req, res, next, id) => {
  try {
    let order = await Order.findById(id)
      .populate('products.product', 'name price')
      .populate('products.shop', 'name')
      .exec()

    if (!order)
      return res.status('400').json({
        error: "Order not found"
      })

    req.order = order
    next()
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listByUser = async (req, res) => {
  try{
    let orders = await Order.find({ "user": req.profile._id })
        .sort('-created')
        .exec()
    res.json(orders)
  } catch (err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const read = (req, res) => {
  return res.json(req.order)
}

export default {
  create,
  listByShop,
  update,
  getStatusValues,
  orderByID,
  listByUser,
  read,
  saveTip,
  getTip       
}
