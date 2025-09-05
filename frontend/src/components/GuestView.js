import React from "react";

export default function GuestView({
  loginData,
  registerData,
  setLoginData,
  setRegisterData,
  handleLogin,
  handleRegister,
  formLoading,
  error,
}) {
  const [login, setLogin] = React.useState(true);

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="logo">
          <span className="logo-icon">📝</span>
          <h1>BlogSpace</h1>
        </div>
      </div>
      <div className="login-form-wrapper">
        <h2>{login ? "Sign In" : "Sign Up"}</h2>
        <p>Enter your credentials to access your account.</p>
        <form onSubmit={login ? handleLogin : handleRegister}>
          {!login && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={login ? loginData.email : registerData.email}
            onChange={(e) => {
              if (login) {
                setLoginData((d) => ({ ...d, email: e.target.value }));
              } else {
                setRegisterData((d) => ({ ...d, email: e.target.value }));
              }
            }}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={login ? loginData.password : registerData.password}
            onChange={(e) => {
              if (login) {
                setLoginData((d) => ({ ...d, password: e.target.value }));
              } else {
                setRegisterData((d) => ({ ...d, password: e.target.value }));
              }
            }}
            required
            minLength="6"
          />
          <button
            type="submit"
            className="sign-in-btn"
            disabled={formLoading}
          >
            {formLoading
              ? "Please wait..."
              : login
              ? "Sign In"
              : "Sign Up"}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
        <p className="signup-link">
          {login ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            className="link-btn"
            onClick={() => setLogin((f) => !f)}
          >
            {login ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
