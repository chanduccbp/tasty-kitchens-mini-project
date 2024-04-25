/* eslint-disable react/no-unknown-property */
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
    totalPages: '',
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

    const updatedRestaurantsData = restaurantsData.restaurants.map(eachObj => ({
      id: eachObj.id,
      imageUrl: eachObj.image_url,
      name: eachObj.name,
      cuisine: eachObj.cuisine,
      rating: eachObj.user_rating.rating,
      totalRatings: eachObj.user_rating.total_reviews,
    }))

    const totalRestaurantPages = Math.ceil(restaurantsData.total / 9)

    this.setState({
      offersList: updatedOffersData,
      restaurantsList: updatedRestaurantsData,
      totalPages: totalRestaurantPages,
      apiStatus: apiStatusConstants.success,
    })
  }

  onChangeFilter = event => {
    this.setState({sortBy: event.target.value}, this.getOffersAndRestaurants)
  }

  decrementActivePage = () => {
    const {activePage} = this.state

    if (activePage > 1) {
      this.setState(
        prevState => ({
          activePage: prevState.activePage - 1,
        }),
        this.getOffersAndRestaurants,
      )
    }
  }

  incrementActivePage = () => {
    const {activePage, totalPages} = this.state

    if (activePage < totalPages) {
      this.setState(
        prevState => ({
          activePage: prevState.activePage + 1,
        }),
        this.getOffersAndRestaurants,
      )
    }
  }

  renderCarousalLoadingView = () => (
    <div className="offers-loader">
      <Loader
        testid="restaurants-offers-loader"
        type="TailSpin"
        color="#F7931E"
        height="50"
        width="50"
      />
    </div>
  )

  renderRestaurantsLoadingView = () => (
    <div className="rest-list-loader">
      <Loader
        testid="restaurants-list-loader"
        type="TailSpin"
        color="#F7931E"
        height="50"
        width="50"
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
              <img src={eachObj.imageUrl} alt="offer" className="offer-image" />
            </div>
          ))}
        </Slider>
      </div>
    )
  }

  getRestaurantsView = () => {
    const {restaurantsList, activePage, totalPages} = this.state

    return (
      <div className="restaurants-list-cont">
        <ul className="restaurants-list">
          {restaurantsList.map(eachObj => (
            <Link
              to={`/restaurant/${eachObj.id}`}
              className="res-item-link-el"
              key={eachObj.id}
            >
              <li testid="restaurant-item" className="restaurant-item">
                <img
                  src={eachObj.imageUrl}
                  alt="restaurant"
                  className="rest-item-img"
                />
                <div className="rest-details">
                  <h1 className="rest-name">{eachObj.name}</h1>
                  <p className="cuisine">{eachObj.cuisine}</p>
                  <FaStar className="star-icon" />
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
            testid="pagination-left-button"
            onClick={this.decrementActivePage}
            className="arrow-icon"
          />
          <span testid="active-page-number" className="pages">
            {activePage} of {totalPages}
          </span>
          <MdKeyboardArrowRight
            testid="pagination-right-button"
            onClick={this.incrementActivePage}
            className="arrow-icon"
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
          <h1 className="title">Popular Restaurants</h1>
          <div className="filter-cont">
            <p className="filter-title">
              Select Your favourite restaurant special dish and make your day
              happy...
            </p>
            <div className="select-el-cont">
              <MdSort className="sort-icon" />
              <select
                onChange={this.onChangeFilter}
                value={sortBy}
                className="select-el"
              >
                {sortByOptions.map(eachObj => (
                  <option key={eachObj.id} value={eachObj.value}>
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
