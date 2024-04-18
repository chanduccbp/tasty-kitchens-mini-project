import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const getCartItems = () => {
  const cartItems = JSON.parse(localStorage.getItem('cart_items'))
  if (cartItems === null) {
    localStorage.setItem('cart_items', JSON.stringify([]))
    return []
  }
  return cartItems
}

class Cart extends Component {
  state = {cartList: getCartItems(), isPaymentDone: false}

  onPlacingOrder = () => {
    this.setState({isPaymentDone: true})
  }

  incrementItem = item => {}

  decrementItem = item => {}

  getEmptyCartView = () => {}

  getCartView = () => {}

  getPaymentSuccessView = () => {}

  renderView = () => {
    const {cartList, isPaymentDone} = this.state

    if (cartList.length === 0) {
      return this.getEmptyCartView()
    } else if (isPaymentDone) {
      return this.getPaymentSuccessView()
    }
    return this.getCartView()
  }

  render() {
    return (
      <div className="cart-cont">
        <Header />
        {this.renderView()}
      </div>
    )
  }
}

export default Cart
