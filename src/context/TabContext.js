import React from 'react'

const TabContext = React.createContext({
  activeNavTab: '',
  changeTab: () => {},
  showMenu: '',
  onClickHamIcon: () => {},
  onClickClose: () => {},
  cartItems: '',
  addItemToCart: () => {},
  incrementItemQuantity: () => {},
  decrementItemQuantity: () => {},
  removeItemFromCart: () => {},
})

export default TabContext
