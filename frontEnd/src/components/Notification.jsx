/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';

function Notification({ message }) {
  return (
    <div className="notification">
      {message}
    </div>
  );
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Notification;

