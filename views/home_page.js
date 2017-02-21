import React from 'react';
import firebase from 'firebase';
import SearchForm from '../components/search_form';
import TopicBlock from '../components/topic_block';

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			listOfQuizzes: [], 
			filterText: '',
			matchingTheSearch: false,
			userLoggedIn: false,
			currentUser: ''
		};
		this.handleUserInput = this.handleUserInput.bind(this);
		this.populateQuizArray = this.populateQuizArray.bind(this);
	}

	componentDidMount() {
		this.populateQuizArray();
		this.checkUserLogIn();
	}

	// function fetching data from firebase to display available quizes
	populateQuizArray() {
		const firebaseRef = firebase.database().ref('quizzes');

		// loops through each quiz once and pushes it in listOfQuizzes
		let quizzes = [];
		firebaseRef.on('child_added', (snapshot) => {
			let quiz = {
				name: snapshot.key,
				details: snapshot.val()
			};
			quizzes.push(quiz);
			this.setState({ listOfQuizzes: quizzes });
		});
	}

	// function linked to loggedIn state
	checkUserLogIn() {
		firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ userLoggedIn: true });
      } else {
        this.setState({ userLoggedIn: false });
      }
    });
	}

	// function linked to Search Form
	findMatches(wordToMatch, quizzes){
	  return quizzes.filter(quiz => {	
	    const rgex = new RegExp(wordToMatch, 'gi');
	    return quiz.match(rgex);
	  });
	} 

	// function linked to Search Form
	handleUserInput(filterText, matchingTheSearch) {
	    this.setState({
	      filterText: filterText,
	      matchingTheSearch: this.state.matchingTheSearch
	    });
	}

	render() {
		return (
			<div>
			  	<main>
					<div className="poster">
						<h2 className="poster--title">Welcome to Nerdia Tech Trivia</h2>
					</div>

					<SearchForm 
						filterText={this.state.filterText}
						matchingTheSearch={this.state.matchingTheSearch}
						onUserInput={this.handleUserInput} />

					<h3 className="welcome-message">
						Welcome to Nerdia { this.state.userLoggedIn ? "Guest" : this.state.currentUser }
					</h3>

					<div className="trivia">
						{ this.state.listOfQuizzes.map( (quiz) => (
								<TopicBlock key={quiz.name}
											quizDetails={quiz}
											className="trivia--game"
											isUserLoggedIn={ this.state.userLoggedIn }
								/>
							)) }
					</div>
				</main>
			</div>
		)
	}
}

export default HomePage;


