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

  getCartView = () => {
    const {cartList} = this.state

    return (
      <div className="cart-view-cont">
        <div className="cart-items-cont">
          <div className="cart-items-header">
            <span className="cart-heading">Item</span>
            <span className="cart-heading">Quantity</span>
            <span className="cart-heading">Price</span>
          </div>
          <ul className="cart-items-list">
            {cartList.map(eachObj => {
              const onClickPlus = () => {
                this.incrementItem(eachObj)
              }

              const onClickMinus = () => {
                this.decrementItem(eachObj)
              }

              return (
                <li testid="cartItem" className="cart-item" key={eachObj.id}>
                  <img
                    src={eachObj.imageUrl}
                    alt="cart-item-img"
                    className="cart-item-img"
                  />
                  <span>{eachObj.name}</span>
                  <div className="item-quantity-cont">
                    <button
                      testid="decrement-quantity"
                      type="button"
                      onClick={onClickMinus}
                      className="cart-item-quantity-update-button"
                    >
                      -
                    </button>
                    <span testid="item-quantity" className="cart-item-quantity">
                      {eachObj.quantity}
                    </span>
                    <button
                      testid="increment-quantity"
                      type="button"
                      onClick={onClickPlus}
                      className="cart-item-quantity-update-button"
                    >
                      +
                    </button>
                  </div>
                  <span testid="total-price">
                    {eachObj.quantity * eachObj.cost}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
        <Footer />
      </div>
    )
  }

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
