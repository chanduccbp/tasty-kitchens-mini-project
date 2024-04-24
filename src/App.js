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

class App extends Component {
  state = {activeNavTab: getActiveTab(), showMenu: false}

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

  render() {
    const {activeNavTab, showMenu} = this.state

    return (
      <TabContext.Provider
        value={{
          activeNavTab,
          changeTab: this.changeTab,
          showMenu,
          onClickHamIcon: this.onClickHamIcon,
          onClickClose: this.onClickClose,
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
