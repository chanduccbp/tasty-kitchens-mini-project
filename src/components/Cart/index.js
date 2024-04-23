/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import TabContext from '../../context/TabContext'
import './index.css'

const getCartItems = () => {
  const cartItems = JSON.parse(localStorage.getItem('cartData'))
  if (cartItems === null) {
    localStorage.setItem('cartData', JSON.stringify([]))
    return []
  }
  return cartItems
}

class Cart extends Component {
  state = {cartList: getCartItems(), isPaymentDone: false}

  onPlacingOrder = () => {
    localStorage.removeItem('cartData')
    this.setState({isPaymentDone: true})
  }

  getTotalPrice = () => {
    const {cartList} = this.state
    let totalPrice = 0

    const addPrice = eachObj => {
      totalPrice += eachObj.quantity * eachObj.cost
    }

    cartList.forEach(eachObj => addPrice(eachObj))

    return totalPrice
  }

  incrementItem = item => {
    const {cartList} = this.state

    const updatedCartItemsList = cartList.map(eachObj => {
      if (eachObj.id === item.id) {
        return {
          id: item.id,
          name: item.name,
          cost: item.cost,
          quantity: item.quantity + 1,
          imageUrl: item.imageUrl,
        }
      }

      return eachObj
    })

    localStorage.setItem('cartData', JSON.stringify(updatedCartItemsList))

    this.setState({cartList: updatedCartItemsList})
  }

  decrementItem = item => {
    const {cartList} = this.state

    if (item.quantity > 1) {
      const updatedCartItemsList = cartList.map(eachObj => {
        if (eachObj.id === item.id) {
          return {
            id: item.id,
            name: item.name,
            cost: item.cost,
            quantity: item.quantity - 1,
            imageUrl: item.imageUrl,
          }
        }

        return eachObj
      })

      localStorage.setItem('cartData', JSON.stringify(updatedCartItemsList))
      this.setState({cartList: updatedCartItemsList})
    } else {
      const updatedCartItemsList = cartList.filter(
        eachObj => eachObj.id !== item.id,
      )

      localStorage.setItem('cartData', JSON.stringify(updatedCartItemsList))
      this.setState({cartList: updatedCartItemsList})
    }
  }

  getEmptyCartView = () => (
    <TabContext.Consumer>
      {value => {
        const {changeTab} = value

        const onClickOrderNow = () => {
          changeTab('HOME')
        }

        return (
          <div className="empty-cart-view">
            <img
              src="https://res.cloudinary.com/dgil22y25/image/upload/v1713602304/Layer_2_orbepx.png"
              alt="empty cart"
              className="empty-cart-image"
            />
            <h1 className="empty-cart-heading">No Orders Yet!</h1>
            <p className="empty-cart-description">
              Your cart is empty. Add something from the menu.
            </p>
            <Link to="/" className="cart-link-el" onClick={onClickOrderNow}>
              <button type="button" className="empty-cart-button">
                Order Now
              </button>
            </Link>
          </div>
        )
      }}
    </TabContext.Consumer>
  )

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
                  <div className="cart-item-info">
                    <img
                      src={eachObj.imageUrl}
                      alt="cart-item-img"
                      className="cart-item-img"
                    />
                    <span className="cart-item-name">{eachObj.name}</span>
                  </div>
                  <div className="cart-item-quantity-cont">
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
                  <span className="cart-item-price">
                    {eachObj.quantity * eachObj.cost}
                  </span>
                </li>
              )
            })}
          </ul>
          <div className="cart-total-price">
            <div className="order-total-cont">
              <span className="order-total">Order Total: </span>
              <span testid="total-price" className="order-total">
                ₹ {this.getTotalPrice()}
              </span>
            </div>
            <button
              type="button"
              className="order-button"
              onClick={this.onPlacingOrder}
            >
              Place Order
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  getPaymentSuccessView = () => (
    <TabContext.Consumer>
      {value => {
        const {changeTab} = value

        const onClickGotoHomePage = () => {
          changeTab('HOME')
        }

        return (
          <div className="payment-success-view">
            <img
              src="https://res.cloudinary.com/dgil22y25/image/upload/v1713602787/check-circle.1_1_lbe7hn.png"
              alt="success"
              className="payment-success-image"
            />
            <h1 className="payment-success-heading">Payment Successful</h1>
            <p className="payment-success-description">
              Thank you for ordering Your payment is successfully completed.
            </p>
            <Link to="/" className="cart-link-el" onClick={onClickGotoHomePage}>
              <button type="button" className="payment-success-button">
                Go To Home Page
              </button>
            </Link>
          </div>
        )
      }}
    </TabContext.Consumer>
  )

  renderView = () => {
    const {cartList, isPaymentDone} = this.state

    if (isPaymentDone) {
      return this.getPaymentSuccessView()
    }

    if (cartList.length === 0) {
      return this.getEmptyCartView()
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
