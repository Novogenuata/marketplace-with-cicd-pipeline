import React, {useState, useEffect} from 'react'
import Card from '@material-ui/core/Card'
import {makeStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import auth from './../auth/auth-helper'
import cart from './cart-helper.js'
import PlaceOrder from './PlaceOrder'
import {Elements} from 'react-stripe-elements'

const useStyles = makeStyles(theme => ({
  card: {
    margin: '24px 0px',
    padding: '16px 40px 90px 40px',
    backgroundColor: '#80808017'
  },
  title: {
    margin: '24px 16px 8px 0px',
    color: theme.palette.openTitle
  },
  subheading: {
    color: 'rgba(88, 114, 128, 0.87)',
    marginTop: "20px",
  },
  addressField: {
    marginTop: "4px",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "45%"
  },
  streetField: {
    marginTop: "4px",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "93%"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "90%"
  }
}))
/**
 * Checkout component
 * 
 * Renders a checkout form for the current user including:
 * - Customer information (name, email, tip)
 * - Delivery address (street, city, state, zipcode, country)
 * - PlaceOrder component wrapped in Stripe Elements
 * 
 * Props:
 * @param {Object} props.checkoutDetails - Optional checkout details passed from parent
 * @param {Array} props.checkoutDetails.products - List of products in cart
 * @param {string} props.checkoutDetails.customer_name - Customer name
 * @param {string} props.checkoutDetails.customer_email - Customer email
 * @param {number} props.checkoutDetails.tip - Optional tip amount
 * @param {Object} props.checkoutDetails.delivery_address - Delivery address object
 * @param {string} props.checkoutDetails.delivery_address.street
 * @param {string} props.checkoutDetails.delivery_address.city
 * @param {string} props.checkoutDetails.delivery_address.state
 * @param {string} props.checkoutDetails.delivery_address.zipcode
 * @param {string} props.checkoutDetails.delivery_address.country
 */

export default function Checkout({ checkoutDetails }) {
  const classes = useStyles()
  const user = auth.isAuthenticated().user

const [values, setValues] = useState({
  checkoutDetails: {
    products: cart.getCart(),
    customer_name: user.name,
    customer_email: user.email,
    tip: Number(localStorage.getItem('checkoutTip')) || 0, 
    delivery_address: { street: '', city: '', state: '', zipcode: '', country: '' }
  },
  error: ''
})




  const handleCustomerChange = name => event => {
    let checkoutDetails = values.checkoutDetails
    checkoutDetails[name] = event.target.value || undefined
    setValues({...values, checkoutDetails: checkoutDetails})
  }

  const handleAddressChange = name => event => {
    let checkoutDetails = values.checkoutDetails
    checkoutDetails.delivery_address[name] = event.target.value || undefined
    setValues({...values, checkoutDetails: checkoutDetails})
  }

    return (
      <Card className={classes.card}>
        <Typography type="title" className={classes.title}>
          Checkout
        </Typography>
        <TextField id="name" label="Name" className={classes.textField} value={values.checkoutDetails.customer_name} onChange={handleCustomerChange('customer_name')} margin="normal"/><br/>
        <TextField id="email" type="email" label="Email" className={classes.textField} value={values.checkoutDetails.customer_email} onChange={handleCustomerChange('customer_email')} margin="normal"/><br/>
        <TextField id="tip" label="Tip the seller ($)" type="number" className={classes.textField} value={values.checkoutDetails.tip} onChange={handleCustomerChange('tip')} margin="normal" InputProps={{ inputProps: { min: 0, step: "0.50" } }}/><br/>
        <Typography type="subheading" component="h3" className={classes.subheading}>
            Delivery Address
        </Typography>
        <TextField id="street" label="Street Address" className={classes.streetField} value={values.checkoutDetails.delivery_address.street} onChange={handleAddressChange('street')} margin="normal"/><br/>
        <TextField id="city" label="City" className={classes.addressField} value={values.checkoutDetails.delivery_address.city} onChange={handleAddressChange('city')} margin="normal"/>
        <TextField id="state" label="State" className={classes.addressField} value={values.checkoutDetails.delivery_address.state} onChange={handleAddressChange('state')} margin="normal"/><br/>
        <TextField id="zipcode" label="Zip Code" className={classes.addressField} value={values.checkoutDetails.delivery_address.zipcode} onChange={handleAddressChange('zipcode')} margin="normal"/>
        <TextField id="country" label="Country" className={classes.addressField} value={values.checkoutDetails.delivery_address.country} onChange={handleAddressChange('country')} margin="normal"/>
        <br/> {
            values.error && (<Typography component="p" color="error">
                <Icon color="error" className={classes.error}>error</Icon>
                {values.error}</Typography>)
          }
        <div>
          <Elements>
            <PlaceOrder checkoutDetails={values.checkoutDetails} />
          </Elements>
        </div>
      </Card>)
}