import React, { useState } from 'react';
import axios from 'axios';

const SignUpPage = () => {
  const [
    { username, email, password, confirmPassword, loading, success },
    setForm,
  ] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    loading: false,
    success: false,
  });

  const handleChange = (e) => {
    setForm((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  const isDisabled =
    !loading && password && password === confirmPassword ? false : true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setForm((prevState) => {
      return { ...prevState, loading: true };
    });

    try {
      await axios.post('/api/1.0/users', { username, email, password });
      setForm((prevState) => {
        return { ...prevState, success: true };
      });
    } catch (error) {}

    // setForm((prevState) => {
    //   return { ...prevState, loading: false };
    // });

    // fetch('/api/1.0/users', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     username,
    //     email,
    //     password,
    //   }),
    // });
  };

  return (
    <>
      {!success && (
        <form
          data-testid="form-sign-up"
          className="card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '2.5em',
            paddingRight: '1em',
            paddingLeft: '1em',
            minWidth: 325,
            paddingTop: 25,
            paddingBottom: 25,
          }}
        >
          <h1 className="text-center">Sign Up</h1>
          <div className="mb-3">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              className="form-control"
              type="text"
              name="username"
              id="username"
              defaultValue={username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              className="form-control"
              type="text"
              name="email"
              id="email"
              defaultValue={email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              className="form-control"
              type="password"
              name="password"
              id="password"
              defaultValue={password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="form-control"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              defaultValue={confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            className="btn btn-primary"
            disabled={isDisabled}
            onClick={handleSubmit}
            type="button"
          >
            {loading && (
              <span
                className="spinner-border spinner-border-sm"
                aria-hidden="true"
                role="status"
              ></span>
            )}
            Sign Up
          </button>
        </form>
      )}
      {success && (
        <div className="alert alert-success mt-3">
          Please check your e-mail to activate your account
        </div>
      )}
    </>
  );
};

export default SignUpPage;
