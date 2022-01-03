const buttonNav = document.querySelector('#buttonNav');
const header = document.querySelector('.header');
const overlay = document.querySelector('.overlay');
const fadeDB = document.querySelectorAll('.has-fade-db');
const body = document.querySelector('.body');
const card = document.querySelector('#contain');
const formG = document.querySelector('#formG');
const user = document.querySelector('#username');
const passLabel = document.querySelector('#passLabel');
const passInput = document.querySelector('#passInput');

json = [];
json1 = [];
userTeam = [];
buttonNav.addEventListener('click', function () {
	if (header.classList.contains('open')) {
		//opens
		overlay.classList.remove('fade-in');
		overlay.classList.add('fade-out');
		fadeDB.forEach(function (element) {
			element.classList.remove('fade-in');
			element.classList.add('fade-out');
		});
		body.classList.remove('noScroll');
		header.classList.remove('open');
		card.classList.remove('cardBox__zIndex');
	} else {
		//close
		overlay.classList.remove('fade-out');
		overlay.classList.add('fade-in');
		fadeDB.forEach(function (element) {
			element.classList.remove('fade-out');
			element.classList.add('fade-in');
		});
		body.classList.add('noScroll');
		header.classList.add('open');
		card.classList.add('cardBox__zIndex');
	}
});
var count = 0;
let createRadioB = (json) => {
	// console.log(json['team name']);
	// console.log(userTeam);
	// console.log(userTeam.includes(json['team name']));

	if (userTeam.includes(json['team name']) == false) {
		let form_check = document.createElement('div');
		form_check.className = 'form-check';

		let inp = document.createElement('input');
		inp.className = 'form-check-input';
		inp.type = 'radio';
		inp.name = 'RadioOptions';
		inp.id = String(json['team name']);
		inp.value = String(json['team name']);

		let label = document.createElement('label');
		label.className = 'form-check-label';
		label.htmlFor = String(json['team name']);
		var tname = String(json['team name']);
		if (json['private'] == true) {
			label.innerHTML = `<i class="bi bi-file-lock-fill">${tname}</i>`;
		} else {
			label.innerHTML = `${tname}`;
		}
		form_check.appendChild(inp);
		form_check.appendChild(label);

		formG.appendChild(form_check);
		// if (document.getElementById(String(json['team name'])).checked) {
		// 	console.log('hello');
		// }
		inp.addEventListener('click', function () {
			$('input[type="password"]').val('');
			if (json['private']) {
				passInput.classList.remove('PasswordNone');
				passLabel.classList.remove('PasswordNone');
				passLabel.innerHTML = `Password for ${json['team name']}`;
			} else {
				passInput.classList.add('PasswordNone');
				passLabel.classList.add('PasswordNone');
			}
		});
	}
};

let initTeams = (json) => {
	for (let i = 0; i < json.length; i++) {
		createRadioB(json[i]);
	}
};

// let userTeamFetch = fetch('/userTeams.json');
// let = fetch('/userInfo.json');
// let TeamFetch = fetch('/teams.json');
// fetch('/teams.json')
// 	.then((response) => {
// 		return response.json();
// 	})
// 	.then((data) => {
// 		json = json.concat(data);
// 		userTeam = fetch_user_team(userTeam);

// 		initTeams(json, userTeam);
// 	});
// fetch('/userInfo.json')
// 	.then((response) => {
// 		return response.json();
// 	})
// 	.then((data) => {
// 		json1 = json1.concat(data);
// 		user.innerHTML = 'Hello ' + json1[0]['email'];
// 	});
// let fetch_user_team = () => {
// 	fetch('/userTeams.json')
// 		.then((response) => {
// 			return response.json();
// 		})
// 		.then((data) => {
// 			for (let i = 0; i < data.length; i++) {
// 				userTeam.push(data[i]['teams']);
// 			}
// 		});
// 	return userTeam;
// };
Promise.all([
	fetch('/userTeams.json'),
	fetch('/userInfo.json'),
	fetch('/teams.json'),
])
	.then(function (responses) {
		return Promise.all(
			responses.map(function (response) {
				return response.json();
			})
		);
	})
	.then(function (data) {
		for (let i = 0; i < data[0].length; i++) {
			userTeam.push(data[0][i]['teams']);
		}
		json1 = json1.concat(data[1]);
		json = json.concat(data[2]);
		initTeams(json);
		user.innerHTML = 'Hello ' + json1[0]['email'];
	});
