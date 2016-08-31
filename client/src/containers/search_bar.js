import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';
import { browserHistory } from 'react-router';
import { fetchTables, fetchDetailTables } from '../actions/search'; // implement this
// import { listTables } from '../actions/list_tables';

class SearchBar extends Component {

  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props){
    super(props);
    this.state = {
      hashtag: [],
      detailTitle: "",
      notifications: OrderedSet(),
      count: 0
    }

    this.onHashtagChange = this.onHashtagChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onSpacebar = this.onSpacebar.bind(this);
    this.removeNotification = this.removeNotification.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
  }

  componentWillMount() {
    if(!this.props.location){
      return;
    }
    if(this.props.location.query.hashtag){
      this.setState({
        hashtag: this.props.location.query.hashtag
      });
      $(".input-hashtag").val(this.props.location.query.hashtag);
    }
    if(this.props.location.query.title){
      this.setState({
        detailTitle: this.props.location.query.title
      });
      $(".input-title").val(this.props.location.query.title);
    }
  }

  addNotification(noti_message) {
    const { notifications, count } = this.state;
    const id = notifications.size + 1;
    const newCount = count + 1;
    return this.setState({
      count: newCount,
      notifications: notifications.add({
        message: noti_message,
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

  onHashtagChange(event){
    this.setState({ hashtag: event.target.value });
  }

  onTitleChange(event){
    this.setState({ detailTitle: event.target.value });
  }

  onSpacebar(event){
    if(event.which === 32){
      let tags = event.target.value.split(/[ ,]+/);
      console.log(tags);
      this.setState({ hashtag: tags });
      this.props.fetchTables(tags);
    }
  }

  onFormSubmit(event){
     event.preventDefault();
     if(this.state.hashtag.length < 1 && this.state.detailTitle.length === 0){
       this.addNotification("Enter a hashtag..");
       return;
     }else if(this.state.detailTitle.length > 0 ){
       // handle details search
       if (this.state.detailTitle.length < 2 ) {
         console.log("More than 1 letter!");
        this.addNotification("More than one letter..");
         return;
       }else{
         let tags;
         if(this.state.hashtag.length > 1){
           tags = this.state.hashtag.split(/[ ,]+/);
         }
         this.props.fetchDetailTables(tags, this.state.detailTitle)
         .then(() => {
           this.setState({ hashtag: tags, detailTitle: this.state.detailTitle });
           this.context.router.push({
            pathname: "show",
            query: {
              hashtag: tags,
              title: this.state.detailTitle
             }
          });
         });
       }
     }else{
       let tags = this.state.hashtag.split(/[ ,]+/);
       this.props.fetchTables(tags)
       .then(() => {
         this.setState({ hashtag: tags });
         this.context.router.push({ //browserHistory.push should also work here
          pathname: "show"
        });
       });

     }
  }

  render() {
    return (
      <div>
        <div className="col-xs-12 col-md-12 search-container">
          <form onSubmit={this.onFormSubmit} className="input-group">
            <input
              placeholder="#NYU"
              id="input-hashtag"
              className="form-control"
              value={this.state.hashtag}
              onChange={this.onHashtagChange}
              onKeyPress={this.onSpacebar}
            />
            <span className="input-group-addon">::</span>
            <input
              placeholder="Study Group"
              id="input-title"
              className="form-control"
              value={this.state.detailTitle}
              onChange={this.onTitleChange}
              onKeyPress={this.onSpacebar}
            />
            <span className="input-group-btn">
              <button type="submit" className="btn btn-secondary">
              Search
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
  return bindActionCreators({ fetchTables, fetchDetailTables }, dispatch);
}

export default connect(null, mapDispatchToProps)(SearchBar);
