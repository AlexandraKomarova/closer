import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

// pull out isAuthenticated and loading from auth state
const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Members</Link>
      </li>
      <li>
        <Link to='/posts'>Posts</Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className='fas fa-user' />{' '}<span className='hide-sm'>Account</span>
        </Link>
      </li>
      <li>
        {/* #! has the link to go nowhere */}
        <Link onClick={logout} to='#!'>
          <i className='fas fa-sign-out-alt' />{' '}<span className='hide-sm'>Logout</span>
        </Link>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Members</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar'>
      <h1 className="brand"><Link to='/'>{"{ closer }"}</Link></h1>
      {/* @ QUESTION: && to just give one condition? if there is no else? if there is an else, then ternanry?*/}
      {!loading && ( <> { isAuthenticated ? authLinks : guestLinks } </> )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);
