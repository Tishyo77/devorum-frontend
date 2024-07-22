import React, { useState } from 'react';
import './SignUpPage.css';

const SignUpPart1 = ({ nextPart }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
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
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      nextPart();
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="signup-part">
      <button className="google-button">Continue with Google</button>
      <div className="or-divider">or</div>
      <form onSubmit={handleSubmit}>
        <div className={`form-group ${errors.firstName ? 'error' : ''}`}>
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>
        <div className={`form-group ${errors.lastName ? 'error' : ''}`}>
          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>
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
        <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>
        <button type="submit">Next</button>
      </form>
      <div className="login-prompt">
        Already a member? <a href="/login">Login</a>
      </div>
    </div>
  );
};

export default SignUpPart1;
