import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {IoIosCloseCircle, IoIosMenu} from 'react-icons/io'
import TabContext from '../../context/TabContext'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    localStorage.removeItem('active_tab')
    history.replace('/login')
  }

  return (
    <TabContext.Consumer>
      {value => {
        const {
          activeNavTab,
          changeTab,
          showMenu,
          onClickHamIcon,
          onClickClose,
        } = value

        const onClickHomeTab = () => {
          changeTab('HOME')
        }

        const onClickCartTab = () => {
          changeTab('CART')
        }

        const homeTabClass =
          activeNavTab === 'HOME' ? 'active-nav-tab' : 'nav-tab'
        const cartTabClass =
          activeNavTab === 'CART' ? 'active-nav-tab' : 'nav-tab'

        const showMobileMenu = () => {
          onClickHamIcon()
        }

        const closeMobileMenu = () => {
          onClickClose()
        }

        return (
          <nav className="navbar">
            <Link to="/" className="nav-title" onClick={onClickHomeTab}>
              <img
                src="https://res.cloudinary.com/dgil22y25/image/upload/v1712137729/x27mnr9o0nvtvmeflwwp.png"
                alt="website logo"
                className="web-logo-nav"
              />
              <p className="app-name-nav">Tasty Kitchens</p>
            </Link>
            <div className="nav-buttons-desk">
              <Link to="/" onClick={onClickHomeTab} className="nav-link">
                <span className={homeTabClass}>Home</span>
              </Link>
              <Link to="/cart" onClick={onClickCartTab} className="nav-link">
                <span className={cartTabClass}>Cart</span>
              </Link>
              <button
                type="button"
                onClick={onClickLogout}
                className="nav-button"
              >
                Logout
              </button>
            </div>
            <IoIosMenu onClick={showMobileMenu} className="ham-icon" />
            {showMenu && (
              <div className="nav-buttons-mob">
                <div className="nav-buttons">
                  <Link to="/" onClick={onClickHomeTab} className="nav-link">
                    <span className={homeTabClass}>Home</span>
                  </Link>
                  <Link
                    to="/cart"
                    onClick={onClickCartTab}
                    className="nav-link"
                  >
                    <span className={cartTabClass}>Cart</span>
                  </Link>
                  <button
                    type="button"
                    onClick={onClickLogout}
                    className="nav-button"
                  >
                    Logout
                  </button>
                </div>
                <IoIosCloseCircle
                  onClick={closeMobileMenu}
                  className="menu-close"
                />
              </div>
            )}
          </nav>
        )
      }}
    </TabContext.Consumer>
  )
}

export default withRouter(Header)
