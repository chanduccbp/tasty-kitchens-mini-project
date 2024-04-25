/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import Header from '../Header'
import Footer from '../Footer'
import RestaurantFoodItem from '../RestaurantFoodItem'
import './index.css'

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
        rating: eachObj.rating,
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
        testid="restaurant-details-loader"
        type="TailSpin"
        color="#F7931E"
        height="50"
        width="50"
      />
    </div>
  )

  getRestaurantDetailsView = () => {
    const {restaurantDetails, foodItems} = this.state
    const {
      rating,
      name,
      costForTwo,
      cuisine,
      imageUrl,
      reviewsCount,
      opensAt,
      location,
      itemsCount,
    } = restaurantDetails

    return (
      <div className="rest-details-view-cont">
        <div className="rest-details-banner">
          <img src={imageUrl} alt="restaurant" className="rest-banner-image" />
          <div className="rest-banner-details">
            <h1 className="banner-rest-name">{name}</h1>
            <p className="banner-rest-info">{cuisine}</p>
            <p className="banner-rest-info">{location}</p>
            <p className="banner-rest-info">opens at {opensAt}</p>
            <p className="banner-rest-info">items count {itemsCount}</p>
            <div className="banner-rating-and-cost-cont">
              <div className="banner-rating-cont">
                <div className="banner-rating-num">
                  <FaStar className="banner-rating-star" />
                  <span className="banner-rest-rating">{rating}</span>
                </div>
                <span className="banner-rest-total-ratings">
                  {reviewsCount}+ Ratings
                </span>
              </div>
              <div className="banner-rest-cost-cont">
                <span className="banner-rest-cost">₹ {costForTwo}</span>
                <span className="banner-rest-cost-for-two">Cost for two</span>
              </div>
            </div>
          </div>
        </div>
        <ul className="food-items-list">
          {foodItems.map(eachObj => (
            <RestaurantFoodItem key={eachObj.id} itemDetails={eachObj} />
          ))}
        </ul>
      </div>
    )
  }

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
