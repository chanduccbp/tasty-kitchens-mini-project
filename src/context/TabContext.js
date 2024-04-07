import React from 'react'

const TabContext = React.createContext({
  activeNavTab: '',
  changeTab: () => {},
  showMenu: '',
  onClickHamIcon: () => {},
  onClickClose: () => {},
})

export default TabContext
