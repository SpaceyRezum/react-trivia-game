import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';

import Quiz from '../components/quiz';
import TopScores from '../components/top_scores';


class TopicPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			quizName: '',
			category: '',
			questions: [],
			perfectScore: 'a',
			userHighestScore: 0
		}
		this.setUserHighestScore = this.setUserHighestScore.bind(this);
		this.setPerfectScore = this.setPerfectScore.bind(this);
	}

	componentDidMount() {
		this.getQuizInfo();
	}

	render() {
		return (
			<div className="col-12">
				<div className="row">
					<aside className="quiz-title col-xs-12 col-sm-12 col-md-3 col-lg-3">
						<h2 className="trivia--game">
							{ (this.props.params.topic).replace(/-/g, " ") }
						</h2>
						<TopScores 
							userHighestScore={ this.state.userHighestScore }
							perfectScore={ this.state.perfectScore }
							quizName={ this.state.quizName }
						/>
					</aside>
					<Quiz 
						questions={ this.state.questions }
						userHighestScore={ this.state.userHighestScore }
						setPerfectScore={ this.setPerfectScore }
						setUserHighestScore={ this.setUserHighestScore }
					/>
				</div>
			</div>
		)
	}

	getQuizInfo() {
		const quizName = (this.props.params.topic).replace(/-/g, " ");
		const firebaseRef = firebase.database().ref("/quizzes/" + quizName);

		firebaseRef.once('value', (snapshot) => {
			let category = snapshot.val().category;
			let questions = [];

			for (let i = 0; i < snapshot.val().questionList.length; i++) {
				questions.push(snapshot.val().questionList[i]);
			}

			this.setState({
				quizName: quizName, 
				category: category, 
				questions: questions });

		// once the app retrieves which quiz the user is on, 
		// it checks whether user already has a score stored for this quiz
		this.getUserHighestScore(this.props.userID, quizName);
		});
	}

	setPerfectScore(perfectScore) {
		this.setState({
			perfectScore: perfectScore
		});
	}

	setUserHighestScore(highestScore) {
		let userID = this.props.userID;
		let userAvatar = this.props.user.photoURL;
		let userName = this.props.user.displayName;
		let quizName = this.state.quizName;
		let score = highestScore;
		const firebaseRef = firebase.database().ref("/quizzes/" + quizName + "/scores/" + userID);

		// create an object as userID : score and pushes it to firebase
		let update = {
			name: userName,
			avatar: userAvatar,
			score: score
		};

		firebaseRef.set(update);
	}

	getUserHighestScore(userID, quizName) {
		const firebaseRef = firebase.database().ref("/quizzes/" + quizName + "/scores/" + userID);

		firebaseRef.on('value', (snapshot) => {
			if (snapshot.val()) {
				let userScore = snapshot.val().score;
				let userHighestScore;

				if (!userScore) {
				 	userHighestScore = 0;
				} else {
				  userHighestScore = userScore;
				}

				this.setState({
					userHighestScore: userHighestScore
				});
			}
		});
	}

}


export default TopicPage;