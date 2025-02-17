import {useState} from 'react'
import {Redirect, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Login = props => {
  const [email, setemail] = useState('')
  const [register, setRegister] = useState(false)
  const [password, setPassword] = useState('')
  const [showSubmitError, setshowSubmitError] = useState(false)
  const [showSubmitSuccess, setshowSubmitSuccess] = useState(false)
  const [successMsg, setSuccesMsg] = useState('')
  const [errorMsg, seterrorMsg] = useState('')
  const [username, setUsername] = useState('')
  const [showSubmitRegisError, setshowSubmitRegisError] = useState(false)
  const [registrationFailed, setregistrationFailed] = useState('')

  const onChangeEmailname = event => {
    setemail(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = props
    history.replace('/')
  }

  const onSubmitFailure = msg => {
    setshowSubmitError(true)
    seterrorMsg(msg)
  }

  const submitForm = async event => {
    event.preventDefault()
    const userDetails = {email, password}
    const url = "https://login-50kc.onrender.com/login"
    const options = {
      method: 'POST',
      headers : {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      onSubmitSuccess(data.jwt_token)
    } else {
      onSubmitFailure(data.error_msg)
    }
  }

  const renderPasswordField = () => (
    <>
      <label className="input-label" htmlFor="password">
        PASSWORD
      </label>
      <input
        type="password"
        id="password"
        className="input-field"
        value={password}
        onChange={onChangePassword}
        placeholder="Password"
      />
    </>
  )

  const renderEmailField = () => (
    <>
      <label className="input-label" htmlFor="username">
        Email
      </label>
      <input
        type="email"
        id="username"
        className="input-field"
        value={email}
        onChange={onChangeEmailname}
        placeholder="email"
        required
      />
    </>
  )

  const onChangeRegisterUsername = (event) => {
    setUsername(event.target.value)
  }

  const onChangeRegisterEmailname = (event) => {
    setemail(event.target.value)
  }

  const onChangeRegisterPasswordname = (event) => {
    setPassword(event.target.value)
  }


  const renderRegisterUsernameField = () => (
    <>
      <label className="input-label" htmlFor="username">
        USERNAME
      </label>
      <input
        type="text"
        id="username"
        className="input-field"
        value={username}
        onChange={onChangeRegisterUsername}
        placeholder="username"
        required
      />
    </>
  )

  const renderRegisterEmailField = () => (
    <>
      <label className="input-label" htmlFor="email">
        email
      </label>
      <input
        type="email"
        id="email"
        className="input-field"
        value={email}
        onChange={onChangeRegisterEmailname}
        placeholder="email"
        required
      />
    </>
  )

  const renderRegisterPasswordField = () => (
    <>
      <label className="input-label" htmlFor="password">
        PASSWORD
      </label>
      <input
        type="password"
        id="password"
        className="input-field"
        value={password}
        onChange={onChangeRegisterPasswordname}
        placeholder="password"
        required
      />
    </>
  )

  const onSuccessRegistration = (msg) => {
    setshowSubmitRegisError(false)
    setshowSubmitSuccess(true)
    setSuccesMsg(msg)
    setPassword('')
    setemail('')

  }

  const onSubmitRegistrationFailure = (msg) => {
    setshowSubmitSuccess(false)
    setshowSubmitRegisError(true)
    setregistrationFailed(msg)
    setPassword('')
    setemail('')
  }

  const submitRegisterForm = async (event) => {
    event.preventDefault()
    const userDetails = {username, email, password}
    const url = "https://login-50kc.onrender.com/register"
    const options = {
      method: 'POST',
      headers : {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      onSuccessRegistration(data.success)
    } else {
      onSubmitRegistrationFailure(data.error_msg)
    }
  }

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Redirect to="/" />
  }

  return (
    <>
    {
        register ? 
        (
        <div className="register-form-container">
            <div className="signup-button">
                <button type='button' className='register' onClick={() => setRegister(false)}>SignIN</button>
            </div>
            <form className="form-container" onSubmit={submitRegisterForm}>
                <div className="input-container">{renderRegisterUsernameField()}</div>
                <div className="input-container">{renderRegisterEmailField()}</div>
                <div className="input-container">{renderRegisterPasswordField()}</div>
                <button type="submit" className="login-button">Register</button>
                {showSubmitRegisError && <p className="error-message">*{registrationFailed}</p>}
                {showSubmitSuccess && <p className="error-message">*{successMsg}</p>}
            </form>
        </div>
        )
        :
        (
        <div className="login-form-container">
            <div className="signup-button">
                <button type='button' className='register' onClick={()=> setRegister(true)}>SignUp</button>
            </div>
            <form className="form-container" onSubmit={submitForm}>
                <div className="input-container">{renderEmailField()}</div>
                <div className="input-container">{renderPasswordField()}</div>
                <button type="submit" className="login-button">
                Login
                </button>
                {showSubmitError && <p className="error-message">*{errorMsg}</p>}
            </form>
        </div>
        )
    }
    </>
  )
}
export default withRouter(Login)
