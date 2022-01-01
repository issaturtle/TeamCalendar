const buttonNav = document.querySelector('#buttonNav');
const header = document.querySelector('.header');
const overlay = document.querySelector('.overlay');
const fadeDB = document.querySelectorAll('.has-fade-db');
const body = document.querySelector('.body');
const card = document.querySelector('#contain');
const formG = document.querySelector('#formG');
const user = document.querySelector('#username');
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
	label.innerHTML = String(json['team name']);

	form_check.appendChild(inp);
	form_check.appendChild(label);

	formG.appendChild(form_check);
	count += 1;
};

let initTeams = (json) => {
	for (let i = 0; i < json.length; i++) {
		createRadioB(json[i]);
	}
};
json = [];
json1 = [];
fetch('/teams.json')
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		json = json.concat(data);
		initTeams(json);
	});
fetch('/userInfo.json')
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		json1 = json1.concat(data);
		user.innerHTML = 'Hello ' + json1[0]['email'];
	});
