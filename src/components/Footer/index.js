import {
  FaPinterestSquare,
  FaInstagramSquare,
  FaTwitter,
  FaFacebookSquare,
} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <div className="footer">
    <div className="footer-title">
      <img
        src="https://res.cloudinary.com/dgil22y25/image/upload/v1712313837/Frame_275_phtzrz.png"
        alt="website-footer-logo"
        className='web-footer-logo'
      />
      <h1>Tasty Kitchens</h1>
    </div>
    <p className="footer-desc">
      The only thing we are serious about is food.Contact us on
    </p>
    <div className="social-icons">
      <FaPinterestSquare testid="pintrest-social-icon" />
      <FaInstagramSquare testid="instagram-social-icon" />
      <FaTwitter testid="twitter-social-icon" />
      <FaFacebookSquare testid="facebook-social-icon" />
    </div>
  </div>
)

export default Footer
