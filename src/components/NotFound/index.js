import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-cont">
    <img
      src="https://res.cloudinary.com/dgil22y25/image/upload/v1712057868/wapwjrva0ji5k9j15n9s.png"
      alt="not found"
    />
    <h1>Page Not Found</h1>
    <p>
      We are sorry, the page you requested could not be found.Please go back to
      the homepage
    </p>
    <Link to="/" className="nf-link">
      <button type="button" className="nf-button">
        Home Page
      </button>
    </Link>
  </div>
)

export default NotFound
