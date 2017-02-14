import React from 'react';
import firebase from 'firebase';

class SearchForm extends React.Component {
	constructor(props) {
		super();
		this.state = {quizNames: []}
		this.displayMatches = this.displayMatches.bind(this);
	}

	componentDidMount(){
		const firebaseRef = firebase.database().ref("/quizzes/");
		firebaseRef.once('value', (snapshot) => {
			this.setState({quizNames: Object.keys(snapshot.val() )});
		})
	}

	displayMatches(){

		function findMatches(wordToMatch, quizNames){
		  return quizNames.filter(quizName => {
		  	console.log(quizName);
		    const rgex = new RegExp(wordToMatch, 'gi');
		    console.log(rgex);
		    return quizName.match(rgex);
		  });
		}

		const suggestions = document.querySelector('.suggestions');
		const matchArray = findMatches(this.quizInput.value, this.state.quizNames);
		const html = matchArray.map(quizName => {
		const regex = new RegExp(this.quizInput.value, 'gi');
		quizName = quizName.replace(regex, `<span clasNames="hl">${this.quizInput.value}</span>`);
		return `
			<li>
			    <span className="name">${quizName}</span> 
			</li>
		`;
	  }).join('');
	  suggestions.innerHTML = html;
	};

	goToQuiz(evt){
		evt.preventDefault();
		console.log(this.quizInput.value );
	}

	render() {
		return (
			<div>
		  		<form onSubmit={ this.goToQuiz.bind(this) }>
		  			<input type="search" ref={ (input) => {this.quizInput = input} } onChange={this.displayMatches}/>
		  			<input type="submit" value="Submit"/>
		  		</form>
		  		<ul className="suggestions"></ul>
	  		</div>
		)
	}
}

SearchForm.contextTypes = {
	router: React.PropTypes.object
}

export default SearchForm;