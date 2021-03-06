import React, { useState } from 'react';
import axios from 'axios';
import Input from '../components/Input';
import { withTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const SignUpPage = ({ t, i18n }) => {
  const [
    { username, email, password, confirmPassword, loading, success, errors },
    setForm,
  ] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    loading: false,
    success: false,
    errors: [],
  });

  const handleChange = (e) => {
    setForm((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
        errors: [],
      };
    });
  };

  const doPasswordsMatch = React.useMemo(
    () => password === confirmPassword,
    [confirmPassword, password]
  );
  const confirmError = { confirmPassword: 'Passwords do not match' };
  const isDisabled = !loading && password && doPasswordsMatch ? false : true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setForm((prevState) => {
      return { ...prevState, loading: true };
    });

    if (!doPasswordsMatch) {
      setForm((prevState) => {
        return {
          ...prevState,
          errors: [confirmError],
        };
      });
      return;
    }

    try {
      await axios.post(
        '/api/1.0/users',
        { username, email, password },
        {
          headers: {
            'Accept-Language': i18n.language,
          },
        }
      );
      setForm((prevState) => {
        return { ...prevState, success: true, errors: [], loading: false };
      });
    } catch (error) {
      if (error.response.status === 400) {
        setForm((prevState) => {
          return {
            ...prevState,
            errors: error.response.data.validationErrors,
          };
        });
      }
      setForm((prevState) => {
        return {
          ...prevState,
          loading: false,
        };
      });
    }
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
          <h1 className="text-center">{t('signUp')}</h1>
          <Input
            id="username"
            type="text"
            label={t('userName')}
            handleChange={handleChange}
            errors={errors}
          />
          <Input
            id="email"
            type="email"
            label={t('email')}
            handleChange={handleChange}
            errors={errors}
          />
          <Input
            id="password"
            type="password"
            label={t('password')}
            handleChange={handleChange}
            errors={errors}
          />
          <Input
            id="confirmPassword"
            type="password"
            label={t('confirmPassword')}
            handleChange={handleChange}
            errors={!doPasswordsMatch && confirmError}
          />

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
            {t('signUp')}
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

export default withTranslation()(SignUpPage);
