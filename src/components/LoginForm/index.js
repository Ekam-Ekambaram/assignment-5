import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import './index.css'

class LoginForm extends Component {
  state = {
    isLoading: false,
    username: '',
    password: '',
    errorMsg: '',
    errorOccurred: false,
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 1})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = err => {
    this.setState({
      errorMsg: err,
      errorOccurred: true,
      isLoading: false, // Set isLoading to false when the request fails.
    })
  }

  onChangeUsername = event => {
    this.setState({
      username: event.target.value,
    })
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  onSubmitForm = async event => {
    event.preventDefault()
    // Set isLoading to true when the form is submitted.
    this.setState({isLoading: true})

    const apiUrl = 'https://apis.ccbp.in/login'
    const {username, password} = this.state
    const userDetails = {username, password} // Create userDetails as an object.
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {errorOccurred, errorMsg, username, password, isLoading} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form className="responsive-container" onSubmit={this.onSubmitForm}>
          <div className="website-logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="logo"
            />
          </div>
          <div className="input-container">
            <label className="label" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              className="input-values"
              placeholder="Username"
              value={username}
              onChange={this.onChangeUsername}
            />
            <label className="label" htmlFor="password">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className="input-values"
              placeholder="Password"
              value={password}
              onChange={this.onChangePassword}
            />
          </div>
          <button className="login-btn" type="submit">
            {isLoading ? (
              <Loader type="TailSpin" color="#ffffff" height={20} width={20} />
            ) : (
              'Login'
            )}
          </button>
          {errorOccurred && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
