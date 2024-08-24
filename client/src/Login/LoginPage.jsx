import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Logo from '../assets/Logo.png';
import api from '../api';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate(); 

    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(''); 

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (
          formData.password.length < 6 ||
          !/[A-Z]/.test(formData.password) ||
          !/[a-z]/.test(formData.password) ||
          !/[0-9]/.test(formData.password) ||
          !/[!@#$%^&*]/.test(formData.password)
        ) {
          newErrors.password =
            'Password must have at least one uppercase character, lowercase character, digit and special character';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
          try {
            const response = await api.post('user/login', {
              email: formData.email,
              password: formData.password
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            navigate('/feed');
          } catch (error) {
            if (error.response && error.response.status === 400) {
              setApiError('Email or Password is wrong');
            } else {
              setApiError('An error occurred during login. Please try again.');
            }
          }
        } else {
          setErrors(validationErrors);
        }
    };

    return (
        <div className="login-page">
            <div className="navbar">
                <div className="logo">
                    <img src={Logo} alt="Devorum Logo" className="logo-img" />
                </div>
            </div>
            <h2>Login and start collaborating now!</h2>
            <div className="login-container">
              <div className='login-part'>
                    <form onSubmit={handleSubmit}>
                        <div className={`form-group ${errors.email ? 'error' : ''}`}>
                            <label>Email:</label>
                            <input type="text" name="email" value={formData.email} onChange={handleChange} />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                        <div className={`form-group ${errors.password ? 'error' : ''}`}>
                            <label>Password:</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>
                        <button type="submit">Login</button>
                        {apiError && <span className="error-message">{apiError}</span>}
                    </form>
                    <div className="signup-prompt">
                        Not a member? <a href="/signup">Sign Up</a>
                    </div>
              </div>
            </div>
          </div>
    );
};

export default LoginPage;
