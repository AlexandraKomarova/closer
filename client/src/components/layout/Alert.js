import React from 'react';
import PropTypes from 'prop-types'; // document the intended types of properties passed to components
import { connect } from 'react-redux'; 

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => <div key={alert.id} className={`alert alert-${alert.alertType}`}>{alert.msg}</div>);

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

// get alert state from redux, fetch it into this component
// mappimg redux state to this component so that we have access to it
// in this case it'll be array of alerts
const mapStateToProps = state => ({
  alerts: state.alert // gets state from root reducer
});

export default connect(mapStateToProps)(Alert);

// from react docs

// PropTypes exports a range of validators that can be used to make sure the data you receive is valid. In this example, we’re using PropTypes.string. When an invalid value is provided for a prop, a warning will be shown in the JavaScript console. For performance reasons, propTypes is only checked in development mode.

