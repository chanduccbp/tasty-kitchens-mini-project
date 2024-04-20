import {Component} from 'react'
import Header from '../Header'
import Footer from '../Footer'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import './index.css'

const cartItems = JSON.parse(localStorage.getItem('cartData'))
if (cartItems === null) {
  localStorage.setItem('cartData', JSON.stringify([]))
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
        rating: eachObj.rating,
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

  addItemToCart = item => {
    const {foodItems} = this.state
    const cartItemsList = JSON.parse(localStorage.getItem('cartData'))
    const similarItem = cartItemsList.find(eachObj => eachObj.id === item.id)

    if (similarItem === undefined) {
      const newItem = {
        id: item.id,
        name: item.name,
        cost: item.cost,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      }

      const newCartItemsList = cartItemsList.push(newItem)
      localStorage.setItem('cartData', JSON.stringify(newCartItemsList))

      const updatedFoodItems = foodItems.map(eachObj => {
        if (eachObj.id === item.id) {
          return {
            name: item.name,
            cost: item.cost,
            foodType: item.foodType,
            imageUrl: item.imageUrl,
            id: item.id,
            rating: item.rating,
            quantity: item.quantity,
            isAdded: true,
          }
        }
        return eachObj
      })

      this.setState({foodItems: updatedFoodItems})
    } else {
      const updatedFoodItems = foodItems.map(eachObj => {
        if (eachObj.id === item.id) {
          return {
            name: item.name,
            cost: item.cost,
            foodType: item.foodType,
            imageUrl: item.imageUrl,
            id: item.id,
            rating: item.rating,
            quantity: similarItem.quantity,
            isAdded: true,
          }
        }
        return eachObj
      })

      this.setState({foodItems: updatedFoodItems})
    }
  }

  increaseItemCount = item => {
    const {foodItems} = this.state
    const cartItemsList = JSON.parse(localStorage.getItem('cartData'))

    const updatedCartItemsList = cartItemsList.map(eachObj => {
      if (eachObj.id === item.id) {
        return {
          id: item.id,
          name: item.name,
          cost: item.cost,
          quantity: item.quantity + 1,
          imageUrl: item.imageUrl,
        }
      }

      return eachObj
    })

    localStorage.setItem('cartData', JSON.stringify(updatedCartItemsList))

    const updatedFoodItems = foodItems.map(eachObj => {
      if (eachObj.id === item.id) {
        return {
          name: item.name,
          cost: item.cost,
          foodType: item.foodType,
          imageUrl: item.imageUrl,
          id: item.id,
          rating: item.rating,
          quantity: item.quantity + 1,
          isAdded: true,
        }
      }
      return eachObj
    })

    this.setState({foodItems: updatedFoodItems})
  }

  decreaseItemCount = item => {
    const {foodItems} = this.state
    const cartItemsList = JSON.parse(localStorage.getItem('cartData'))

    if (item.quantity > 1) {
      const updatedCartItemsList = cartItemsList.map(eachObj => {
        if (eachObj.id === item.id) {
          return {
            id: item.id,
            name: item.name,
            cost: item.cost,
            quantity: item.quantity - 1,
            imageUrl: item.imageUrl,
          }
        }

        return eachObj
      })

      localStorage.setItem('cartData', JSON.stringify(updatedCartItemsList))

      const updatedFoodItems = foodItems.map(eachObj => {
        if (eachObj.id === item.id) {
          return {
            name: item.name,
            cost: item.cost,
            foodType: item.foodType,
            imageUrl: item.imageUrl,
            id: item.id,
            rating: item.rating,
            quantity: item.quantity - 1,
            isAdded: true,
          }
        }
        return eachObj
      })

      this.setState({foodItems: updatedFoodItems})
    } else {
      const updatedCartItemsList = cartItemsList.filter(
        eachObj => eachObj.id !== item.id,
      )

      localStorage.setItem('cartData', JSON.stringify(updatedCartItemsList))

      const updatedFoodItems = foodItems.map(eachObj => {
        if (eachObj.id === item.id) {
          return {
            name: item.name,
            cost: item.cost,
            foodType: item.foodType,
            imageUrl: item.imageUrl,
            id: item.id,
            rating: item.rating,
            quantity: item.quantity,
            isAdded: false,
          }
        }
        return eachObj
      })

      this.setState({foodItems: updatedFoodItems})
    }
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
            <p className="banner-rest-cuisine">{cuisine}</p>
            <p className="banner-rest-location">{location}</p>
            <p className="banner-rest-open-time">{opensAt}</p>
            <p className="banner-rest-total-items">{itemsCount}</p>
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
        <ul className="food-items-list">
          {foodItems.map(eachObj => {
            const onClickAddButton = () => {
              this.addItemToCart(eachObj)
            }

            const onClickIncrementButton = () => {
              this.increaseItemCount(eachObj)
            }

            const onClickDecrementButton = () => {
              this.decreaseItemCount(eachObj)
            }

            return (
              <li testid="foodItem" className="food-item">
                <img
                  src={eachObj.imageUrl}
                  alt="foodItem"
                  className="food-item-image"
                />
                <div className="food-item-details">
                  <h1 className="food-item-name">{eachObj.name}</h1>
                  <p className="food-item-cost">₹ {eachObj.cost}</p>
                  <div className="food-item-rating-cont">
                    <FaStar className="food-item-rating-star" />
                    <span className="food-item-rating">{eachObj.rating}</span>
                  </div>
                  {eachObj.isAdded ? (
                    <div className="food-item-quantity-cont">
                      <button
                        testid="decrement-count"
                        type="button"
                        onClick={onClickDecrementButton}
                        className="item-quantity-update-button"
                      >
                        -
                      </button>
                      <span testid="active-count" className="item-quantity">
                        {eachObj.quantity}
                      </span>
                      <button
                        testid="increment-count"
                        type="button"
                        onClick={onClickIncrementButton}
                        className="item-quantity-update-button"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={onClickAddButton}
                      className="item-add-button"
                    >
                      ADD
                    </button>
                  )}
                </div>
              </li>
            )
          })}
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
