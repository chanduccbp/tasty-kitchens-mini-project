import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  loginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})

    history.replace('/')
  }

  loginFailure = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    if (response.ok) {
      this.loginSuccess(data.jwt_token)
    } else {
      this.loginFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showError, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-cont">
        <div className="form-cont">
          <form className="form" onSubmit={this.onSubmitForm}>
            <img
              src="https://res.cloudinary.com/dgil22y25/image/upload/v1712141794/Rectangle_1457_qlmvhx.png"
              alt="website login"
              className="web-login-mob"
            />
            <img
              src="https://res.cloudinary.com/dgil22y25/image/upload/v1712137729/x27mnr9o0nvtvmeflwwp.png"
              alt="website logo"
              className="web-logo-login-desk"
            />
            <p className="app-name-desk">Tasty Kitchens</p>
            <h1>Login</h1>
            <label htmlFor="username" className="label">
              USERNAME
            </label>
            <input
              type="input"
              value={username}
              className="input-el"
              id="username"
              onChange={this.onChangeUsername}
            />
            <label htmlFor="password" className="label">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              className="input-el"
              id="password"
              onChange={this.onChangePassword}
            />
            {showError && <p className="error">{errorMsg}</p>}
            <button type="submit" className="login-butt">
              Login
            </button>
          </form>
        </div>
        <img
          src="https://res.cloudinary.com/dgil22y25/image/upload/v1712137779/ilzmrf2lipss3cduhnka.png"
          alt="website login"
          className="web-login-desk"
        />
      </div>
    )
  }
}

export default Login
