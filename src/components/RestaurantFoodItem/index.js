/* eslint-disable react/no-unknown-property */
import {FaStar} from 'react-icons/fa'
import TabContext from '../../context/TabContext'
import './index.css'

const RestaurantFoodItem = props => {
  const {itemDetails} = props
  const {name, cost, imageUrl, id, rating} = itemDetails

  return (
    <TabContext.Consumer>
      {value => {
        const {
          cartItems,
          addItemToCart,
          incrementItemQuantity,
          decrementItemQuantity,
          removeItemFromCart,
        } = value

        let itemQuantityInCart = 0

        const itemPresentInCart = cartItems.find(eachObj => eachObj.id === id)

        if (itemPresentInCart !== undefined) {
          itemQuantityInCart = itemPresentInCart.quantity
        }

        const onClickAddButton = () => {
          const newItem = {
            id,
            name,
            cost,
            quantity: 1,
            imageUrl,
          }
          addItemToCart(newItem)
        }

        const onClickIncrementButton = () => {
          incrementItemQuantity(id)
        }

        const onClickDecrementButton = () => {
          if (itemQuantityInCart > 1) {
            decrementItemQuantity(id)
          } else {
            removeItemFromCart(id)
          }
        }

        return (
          <li testid="foodItem" className="food-item">
            <img src={imageUrl} alt="foodItem" className="food-item-image" />
            <div className="food-item-details">
              <h1 className="food-item-name">{name}</h1>
              <p className="food-item-cost">₹ {cost}</p>
              <div className="food-item-rating-cont">
                <FaStar className="food-item-rating-star" />
                <span className="food-item-rating">{rating}</span>
              </div>
              {itemQuantityInCart !== 0 ? (
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
                    {itemQuantityInCart}
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
      }}
    </TabContext.Consumer>
  )
}

export default RestaurantFoodItem
