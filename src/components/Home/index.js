import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdKeyboardArrowRight, MdKeyboardArrowLeft, MdSort} from 'react-icons/md'
import {FaStar} from 'react-icons/fa'
import Slider from 'react-slick'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const sortByOptions = [
  {
    id: 0,
    displayText: 'Highest',
    value: 'Highest',
  },
  {
    id: 2,
    displayText: 'Lowest',
    value: 'Lowest',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    offersList: [],
    restaurantsList: [],
    sortBy: sortByOptions[1].value,
    activePage: 1,
  }

  componentDidMount() {
    this.getOffersAndRestaurants()
  }

  getOffersAndRestaurants = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {activePage, sortBy} = this.state

    const offset = (activePage - 1) * 9

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const offersResponse = await fetch(
      'https://apis.ccbp.in/restaurants-list/offers',
      options,
    )

    const restaurantsResponse = await fetch(
      `https://apis.ccbp.in/restaurants-list?offset=${offset}&limit=9&sort_by_rating=${sortBy}`,
      options,
    )

    const offersData = await offersResponse.json()
    const updatedOffersData = offersData.offers.map(eachObj => ({
      imageUrl: eachObj.image_url,
      id: eachObj.id,
    }))

    const restaurantsData = await restaurantsResponse.json()
    console.log(restaurantsData)
    const updatedRestaurantsData = restaurantsData.restaurants.map(eachObj => ({
      id: eachObj.id,
      imageUrl: eachObj.image_url,
      name: eachObj.name,
      cuisine: eachObj.cuisine,
      rating: eachObj.user_rating.rating,
      totalRatings: eachObj.user_rating.total_reviews,
    }))

    this.setState({
      offersList: updatedOffersData,
      restaurantsList: updatedRestaurantsData,
      apiStatus: apiStatusConstants.success,
    })
  }

  onChangeFilter = event => {
    this.setState({sortBy: event.target.value}, this.getOffersAndRestaurants)
  }

  decrementActivePage = () => {
    this.setState(
      prevState => ({
        activePage: prevState.activePage - 1,
      }),
      this.getOffersAndRestaurants,
    )
  }

  incrementActivePage = () => {
    this.setState(
      prevState => ({
        activePage: prevState.activePage + 1,
      }),
      this.getOffersAndRestaurants,
    )
  }

  renderCarousalLoadingView = () => (
    <div>
      <Loader
        type="TailSpin"
        color="#F7931E"
        height="50"
        width="50"
        testid="restaurants-offers-loader"
      />
    </div>
  )

  renderRestaurantsLoadingView = () => (
    <div>
      <Loader
        type="TailSpin"
        color="#F7931E"
        height="50"
        width="50"
        testid="restaurants-list-loader"
      />
    </div>
  )

  getOffersCarousals = () => {
    const {offersList} = this.state
    const settings = {
      dots: true,
    }

    return (
      <div className="carousal-container">
        <Slider {...settings}>
          {offersList.map(eachObj => (
            <div key={eachObj.id}>
              <img src={eachObj.imageUrl} alt="offer" />
            </div>
          ))}
        </Slider>
      </div>
    )
  }

  getRestaurantsView = () => {
    const {restaurantsList, activePage} = this.state

    return (
      <div className="restaurants-list-cont">
        <ul className="restaurants-list">
          {restaurantsList.map(eachObj => (
            <Link to={`/restaurant/${eachObj.id}`}>
              <li key={eachObj.id} className="restaurant-item">
                <img
                  src={eachObj.imageUrl}
                  alt="restaurant"
                  testid="restaurant-item"
                  className="rest-item-img"
                />
                <div className="rest-details">
                  <h1 className="rest-name">{eachObj.name}</h1>
                  <p className="cuisine">{eachObj.cuisine}</p>
                  <FaStar />
                  <span className="rating-num">{eachObj.rating}</span>
                  <span className="total-ratings">
                    ({eachObj.totalRatings})
                  </span>
                </div>
              </li>
            </Link>
          ))}
        </ul>
        <div className="page-cont">
          <MdKeyboardArrowLeft
            onClick={this.decrementActivePage}
            testid="pagination-left-button"
          />
          <span testid="active-page-number">{activePage}</span>
          <MdKeyboardArrowRight
            onClick={this.incrementActivePage}
            testid="pagination-right-button"
          />
        </div>
      </div>
    )
  }

  renderCarousalView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getOffersCarousals()
      case apiStatusConstants.inProgress:
        return this.renderCarousalLoadingView()
      default:
        return null
    }
  }

  renderRestaurantsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getRestaurantsView()
      case apiStatusConstants.inProgress:
        return this.renderRestaurantsLoadingView()
      default:
        return null
    }
  }

  render() {
    const {sortBy} = this.state

    return (
      <div className="home-cont">
        <Header />
        {this.renderCarousalView()}
        <div className="title-and-filter-cont">
          <h1>Popular Restaurants</h1>
          <div className="filter-cont">
            <p>
              Select Your favourite restaurant special dish and make your day
              happy...
            </p>
            <div className="select-el-cont">
              <MdSort />
              <select
                onChange={this.onChangeFilter}
                value={sortBy}
                className="select-el"
              >
                {sortByOptions.map(eachObj => (
                  <option key={eachObj.id} value={eachObj.id}>
                    Sort by {eachObj.displayText}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {this.getRestaurantsView()}
        <Footer />
      </div>
    )
  }
}

export default Home
