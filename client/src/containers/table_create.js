import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm } from 'redux-form';
import { createNewTable } from '../actions/table';
import { Button, Modal, Popover, Tooltip, OverlayTrigger, Radio } from 'react-bootstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { meFromTokenSuccess, meFromTokenFailure } from '../actions/auth';

class TableCreate extends Component {
  static contextTypes = {
    router: PropTypes.object
  };
  constructor(props){
    super(props)
    this.state = {
      showTableCreateModal: false,
      userData: ""
     }

    this.tableCreateClose = this.tableCreateClose.bind(this);
    this.tableCreateOpen = this.tableCreateOpen.bind(this);
  }

  tableCreateClose() {
    this.setState({ showTableCreateModal: false });
  }

  tableCreateOpen() {
    if(this.props.userData === undefined){
      NotificationManager.warning(`You have to log in first.`, `Open Unsuccessful`);
    }else{
      this.setState({ showTableCreateModal: true });
    }
  }



  onSubmit(props) {
    if(!this.props.userData.user){
      NotificationManager.warning(`You have to log in first.`, `Log In Unsuccessful`);
      return;
    }
    props.creator = this.props.userData.user.username;
    props.hashtags = props.hashtags.split(/[ ,]+/);
    this.props.createNewTable(props)
    .then((response) => {
      // handle jwt store here
      if(response.payload.data.success === true){
        this.tableCreateClose();
        NotificationManager.success(`You have successfully created a table!`, `Creation Unsuccessful`);
        this.context.router.push({ //browserHistory.push should also work here
         pathname: `table/${response.payload.data.data._id}`
       });
      }else{
        NotificationManager.warning(`Error Occurred!, ${response.payload.data.message}`, `Creation Unsuccessful`);

      }
     });
   }

  render() {

    const { fields: {title, hashtags, description, isPrivate}, handleSubmit } = this.props;

    return (
      <div>
        <div className="btn-cotainer col-xs-4 col-md-2">
          <Button
            bsSize="sm"
            onClick={this.tableCreateOpen}
            className="pull-left default-button"
          >
            Create Table
          </Button>
        </div>

        <Modal show={this.state.showTableCreateModal} onHide={this.tableCreateClose} >
          <Modal.Header closeButton>
            <Modal.Title>Create New Table</Modal.Title>
          </Modal.Header>
          <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Modal.Body>
            <h4>Create a table</h4>
            <div className={`form-group ${title.touched && title.invalid ? 'has-error' : ''}`}>
              <label className="control-label">Title*</label>
              <input type="text" className="form-control" {...title} />
              <div className="help-block">
                {title.touched ? title.error : ''}
              </div>
            </div>

            <div className={`form-group ${hashtags.touched && hashtags.invalid ? 'has-error' : ''}`}>
              <label className="control-label">Hashtags* (Separate with space)</label>
              <input type="text" className="form-control" {...hashtags} />
              <div className="help-block">
                {hashtags.touched ? hashtags.error : ''}
              </div>
            </div>

            <div className={`form-group ${description.touched && description.invalid ? 'has-error' : ''}`}>
              <label className="control-label">Description*</label>
              <textarea className="form-control" rows="5" {...description} />
              <div className="help-block">
                {description.touched ? description.error : ''}
              </div>
            </div>

            <div className={`form-group ${isPrivate.touched && isPrivate.invalid ? 'has-error' : ''}`}>
              <Radio inline
                value='false'
                onChange={isPrivate.onChange}
                checked={isPrivate.value === 'false'}
              >
                Public
              </Radio>
              <Radio inline
               value='true'
               onChange={isPrivate.onChange}
               checked={isPrivate.value === 'true'}
              >
                Private
              </Radio>
            </div>

          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn default-button">
              Submit
            </button>
            <Button onClick={this.tableCreateClose}>Close</Button>
          </Modal.Footer>
          </form>
        </Modal>

      </div>
    );
  }
};

function validate(values){
  const errors = {};
  if(!values.title){
    errors.title = 'Enter a title.';
  }
  if(!values.description){
    errors.description = 'Enter some description.';
  }
  if(!values.hashtags){
    errors.hashtags = 'Must have at least one hashtag.'
  }

  return errors;
}
// connect: first argument is mapStateToProps, 2nd is mapDispatchToProps
// reduxForm: 1st is form config, 2nd is mapStateToProps, 3rd is mapDispatchToProps
function mapStateToProps(state){
  return { userData: state.userData.user };
}

export default reduxForm({
  form: 'CreateNewTable',
  fields: ['title','hashtags','description','isPrivate'],
  validate
}, mapStateToProps, { createNewTable, meFromTokenSuccess, meFromTokenFailure  })(TableCreate);
