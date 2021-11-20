import React, { useState } from 'react';

const SignUpPage = () => {
  const [{ username, email, password, confirmPassword, disabled }, setForm] =
    useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      disabled: true,
    });

  const handleChange = (e) => {
    setForm((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
        disabled: password !== '' && password === confirmPassword && false,
      };
    });
  };

  return (
    <>
      <h1>Sign Up</h1>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        id="username"
        defaultValue={username}
        onChange={handleChange}
      />
      <label htmlFor="email">Email</label>
      <input type="text" name="email" id="email" value={email} />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        defaultValue={password}
        onChange={handleChange}
      />
      <label htmlFor="confirmPassword">Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        defaultValue={confirmPassword}
      />
      <button disabled={disabled}>Sign Up</button>
    </>
  );
};

export default SignUpPage;
