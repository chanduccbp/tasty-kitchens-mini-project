import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
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

  render() {
    return (
      <div className="home-cont">
        <Header />

        <Footer />
      </div>
    )
  }
}

export default Home
