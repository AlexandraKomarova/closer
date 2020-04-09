import React from 'react';
import { Link } from 'react-router-dom';


const DashboardActions = () => {
  return (
    <div className='dash-buttons'>
      <Link to='/edit-profile' className='btn'>
        <i className='fas fa-user-circle' /> Edit Profile
      </Link>
      {/* <Link to={`/profile/${_id}`} className='btn btn-primary'>
          View Profile
      </Link> */}
    </div>
  );
};


export default DashboardActions;
