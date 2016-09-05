import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { meFromTokenSuccess, meFromTokenFailure } from '../actions/auth';
