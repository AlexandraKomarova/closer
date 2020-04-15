import React, { useState } from 'react';
import { connect } from 'react-redux'; // connects the component to redux
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert'; // bring alert action
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  // ...formData makes a copy of formData as we only want to change one thing
  // [e.target.name]: e.target.value allows a dynamic key, othwerwise we would have to type name: e.target.value, email: e.target.value, etc
  // if we have name: e.target.value and want use it our onChange in any other field it'll always edit the name because we use that as the key
  // [e.target.name] is whatever the value of the attribute is
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    // @ ACTION CALL 
    // our setAlert() takes two params: msg and alertType
    // setAlert() generates the id
    // dispatches SET_ALERT with msg (1st arg), alertType(2nd arg) and created id as payload 
    // 2nd param, alertType, will be a dynamic class in Alert component
    if (password !== password2) setAlert('Passwords do not match', 'danger'); 
    else register({ name, email, password });
  };

  if (isAuthenticated) return <Redirect to='/dashboard' />;
  
  return (
      <div className="signup-wrapper">
        <h1 className='large'>Sign Up</h1>
        <form className='form' onSubmit={e => onSubmit(e)}>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Name'
              name='name'
              value={name} // add that to associate this input with the name in the state
              onChange={e => onChange(e)}
            />
          </div>
          <div className='form-group'>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              value={email}
              onChange={e => onChange(e)}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              value={password}
              onChange={e => onChange(e)}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Confirm Password'
              name='password2'
              value={password2}
              onChange={e => onChange(e)}
            />
          </div>
          <input type='submit' className='btn' value='Register' />
        </form>
        <p className='my-1'>
          Already have an account? <Link to='/login' className="sign-in">Sign In</Link>
        </p>
    </div>
  
    
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

// connect() to redux 
// connect takes in 2 things: 
// 1) state that you wanna map(get)
// 2) object with actions: { actions }
// this will allow us to access props.setAlert that will come in as params in the functional component
export default connect(mapStateToProps, { setAlert, register })(Register); 
