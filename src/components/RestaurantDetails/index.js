import {Component} from 'react'
import Header from '../Header'
import Footer from '../Footer'
import Cookies from 'js-cookie'
import './index.css'

const cartItems = JSON.parse(localStorage.getItem('cart_items'))
if (cartItems === null) {
  localStorage.setItem('cart_items', JSON.stringify([]))
}

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
}

class RestaurantDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    restaurantDetails: {},
    foodItems: [],
  }

  componentDidMount() {
    this.getRestaurantDetails()
  }

  getRestaurantDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const restaurantDetailsResponse = await fetch(
      `https://apis.ccbp.in/restaurants-list/${id}`,
      options,
    )
    const restaurantDetailsData = await restaurantDetailsResponse.json()
    const updatedRestaurantDetailsData = {
      rating: restaurantDetailsData.rating,
      id: restaurantDetailsData.id,
      name: restaurantDetailsData.name,
      costForTwo: restaurantDetailsData.cost_for_two,
      cuisine: restaurantDetailsData.cuisine,
      imageUrl: restaurantDetailsData.image_url,
      reviewsCount: restaurantDetailsData.reviews_count,
      opensAt: restaurantDetailsData.opens_at,
      location: restaurantDetailsData.location,
      itemsCount: restaurantDetailsData.items_count,
    }

    const updatedFoodItemsData = restaurantDetailsData.food_items.map(
      eachObj => ({
        name: eachObj.name,
        cost: eachObj.cost,
        foodType: eachObj.food_type,
        imageUrl: eachObj.image_url,
        id: eachObj.id,
        quantity: 1,
        isAdded: false,
      }),
    )

    this.setState({
      restaurantDetails: updatedRestaurantDetailsData,
      foodItems: updatedFoodItemsData,
      apiStatus: apiStatusConstants.success,
    })
  }

  getRestaurantDetailsLoadingView = () => (
    <div className="rest-details-loader">
      <Loader
        type="TailSpin"
        color="#F7931E"
        height="50"
        width="50"
        testid="restaurant-details-loader"
      />
    </div>
  )

  getRestaurantDetailsView = () => {}

  renderRestaurantDetailsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.getRestaurantDetailsLoadingView()
      case apiStatusConstants.success:
        return this.getRestaurantDetailsView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="rest-details-cont">
        <Header />
        {this.renderRestaurantDetailsView()}
        <Footer />
      </div>
    )
  }
}

export default RestaurantDetails
