import React from 'react';
import firebase from 'firebase';

import Header from '../components/header';
// import HomePage from '../views/home_page';
// import TopicPage from '../views/topic_page';

class AppLayout extends React.Component {
	constructor() {
		super();
		this.state = {
			userLoggedIn: false,
			user: {},
			userID: ""
		}
	}

	// we could potentially add a footer component if we want
	render() {
		return (
			<div className="row">
				<Header isUserLoggedIn={ this.state.userLoggedIn }
								user={ this.state.user }/>
				{ React.cloneElement(this.props.children, {
						user: this.state.user,
						userID : this.state.userID,
          	isUserLoggedIn: this.state.userLoggedIn
        	}) }
			</div>
		)
	}

	// provides value for children
	getChildContext(){
		return {
			currentUserName: this.state.user.displayName,
			currentPhoto: this.state.user.photoURL
		}
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
	    if (user) {
	      this.setState({ userLoggedIn: true, user: user, userID: user.uid.replace(/"/g,"")});
	    } else {
	      this.setState({ userLoggedIn: false });
	    }
	  });
	}

}	

//documents what info is avail to children
AppLayout.childContextTypes = {
	currentUserName: React.PropTypes.string,
	currentPhoto: React.PropTypes.string
}	

export default AppLayout;