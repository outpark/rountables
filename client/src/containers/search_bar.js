import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';

import { fetchTables } from '../actions/search'; // implement this
import { listTables } from '../actions/list_tables';

class SearchBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      hashtag: [],
      notifications: OrderedSet(),
      count: 0
    }

    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onSpacebar = this.onSpacebar.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
  }

  addNotification() {
    const { notifications, count } = this.state;
    const id = notifications.size + 1;
    const newCount = count + 1;
    return this.setState({
      count: newCount,
      notifications: notifications.add({
        message: `Enter a hashtag`,
        key: newCount,
        action: 'Dismiss',
        dismissAfter: 3400,
        onClick: () => this.removeNotification(newCount)
      })
    });
  }

  removeNotification(count) {
    this.setState({
      notifications: this.state.notifications.filter(n => n.key !== count)
    })
  }

  onInputChange(event){
    this.setState({ hashtag: event.target.value });
  }

  onSpacebar(event){
    if(event.which === 32){
      let tags = event.target.value.split(/[ ,]+/);
      this.setState({ hashtag: tags });
      this.props.fetchTables(tags);
    }
  }

  onFormSubmit(event){
     event.preventDefault();
     if(this.state.hashtag.length < 1){
       this.addNotification();
       return;
     }
     let tags = this.state.hashtag.split(/[ ,]+/);
     this.props.fetchTables(tags);
     this.setState({ hashtag: [] });
     // fetch data and reset hashtag
  }

  render() {
    return (
      <div>
        <div className="col-xs-12 col-md-12">
          <form onSubmit={this.onFormSubmit} className="input-group">
            <input
              placeholder="Search for a hashtag"
              className="form-control"
              value={this.state.hashtag}
              onChange={this.onInputChange}
              onKeyPress={this.onSpacebar}
            />
            <span className="input-group-btn">
              <button type="submit" className="btn btn-secondary">
              submit
              </button>
            </span>
          </form>
        </div>
        <NotificationStack
          notifications={this.state.notifications.toArray()}
          onDismiss={notification => this.setState({
            notifications: this.state.notifications.delete(notification)
          })}
        />
      </div>

    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchTables, listTables }, dispatch);
}

export default connect(null, mapDispatchToProps)(SearchBar);
