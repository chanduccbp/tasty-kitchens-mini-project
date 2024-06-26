import {Link} from 'react-router-dom'
import TabContext from '../../context/TabContext'
import './index.css'

const NotFound = () => (
  <TabContext.Consumer>
    {value => {
      const {changeTab} = value

      const onClickHomePage = () => {
        changeTab('HOME')
      }

      return (
        <div className="not-found-cont">
          <img
            src="https://res.cloudinary.com/dgil22y25/image/upload/v1712057868/wapwjrva0ji5k9j15n9s.png"
            alt="not found"
          />
          <h1 className="nf-head">Page Not Found</h1>
          <p className="nf-para">
            We are sorry, the page you requested could not be found.Please go
            back to the homepage
          </p>
          <Link to="/" className="nf-link" onClick={onClickHomePage}>
            <button type="button" className="nf-button">
              Home Page
            </button>
          </Link>
        </div>
      )
    }}
  </TabContext.Consumer>
)

export default NotFound
