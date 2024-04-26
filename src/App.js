import {Component} from 'react'
import {Switch, Route} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Home from './components/Home'
import RestaurantDetails from './components/RestaurantDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import TabContext from './context/TabContext'
import './App.css'

const getActiveTab = () => {
  const activeTab = localStorage.getItem('active_tab')
  if (activeTab === null) {
    localStorage.setItem('active_tab', JSON.stringify('HOME'))
    return JSON.parse(localStorage.getItem('active_tab'))
  }

  return JSON.parse(activeTab)
}

const getCartItems = () => {
  const cartItems = localStorage.getItem('cartData')
  if (cartItems === null) {
    return []
  }
  return JSON.parse(cartItems)
}

class App extends Component {
  state = {
    activeNavTab: getActiveTab(),
    showMenu: false,
    cartItems: getCartItems(),
    isPaymentDone: false,
  }

  changeTab = tab => {
    localStorage.setItem('active_tab', JSON.stringify(tab))
    this.setState({activeNavTab: tab})
  }

  onClickHamIcon = () => {
    this.setState({showMenu: true})
  }

  onClickClose = () => {
    this.setState({showMenu: false})
  }

  updateLocalStorage = () => {
    const {cartItems} = this.state
    localStorage.setItem('cartData', JSON.stringify(cartItems))
  }

  addItemToCart = item => {
    this.setState(
      prevState => ({
        cartItems: [...prevState.cartItems, item],
      }),
      this.updateLocalStorage,
    )
  }

  incrementItemQuantity = id => {
    this.setState(
      prevState => ({
        cartItems: prevState.cartItems.map(eachObj => {
          if (eachObj.id === id) {
            return {...eachObj, quantity: eachObj.quantity + 1}
          }
          return eachObj
        }),
      }),
      this.updateLocalStorage,
    )
  }

  decrementItemQuantity = id => {
    this.setState(
      prevState => ({
        cartItems: prevState.cartItems.map(eachObj => {
          if (eachObj.id === id) {
            return {...eachObj, quantity: eachObj.quantity - 1}
          }
          return eachObj
        }),
      }),
      this.updateLocalStorage,
    )
  }

  removeItemFromCart = id => {
    this.setState(
      prevState => ({
        cartItems: prevState.cartItems.filter(eachObj => eachObj.id !== id),
      }),
      this.updateLocalStorage,
    )
  }

  onPlacingOrder = () => {
    this.setState({isPaymentDone: true})
  }

  render() {
    const {activeNavTab, showMenu, cartItems, isPaymentDone} = this.state

    return (
      <TabContext.Provider
        value={{
          activeNavTab,
          changeTab: this.changeTab,
          showMenu,
          onClickHamIcon: this.onClickHamIcon,
          onClickClose: this.onClickClose,
          cartItems,
          addItemToCart: this.addItemToCart,
          incrementItemQuantity: this.incrementItemQuantity,
          decrementItemQuantity: this.decrementItemQuantity,
          removeItemFromCart: this.removeItemFromCart,
          isPaymentDone,
          onPlacingOrder: this.onPlacingOrder,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute
            exact
            path="/restaurant/:id"
            component={RestaurantDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route component={NotFound} />
        </Switch>
      </TabContext.Provider>
    )
  }
}

export default App
