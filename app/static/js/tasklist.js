const buttonNav = document.querySelector('#buttonNav');
const header = document.querySelector('.header');
const overlay = document.querySelector('.overlay');
const fadeDB = document.querySelectorAll('.has-fade-db');
const body = document.querySelector('.body');
const test = document.querySelector('#test');
const user = document.querySelector('#username');
const tagList = document.querySelector('#tagsList');
const cardBox = document.querySelector('.cardBox__container');
const profi = document.querySelector('#pills-profile-tab');
const navList = document.querySelector('#pills-tab');
const pillsProf = document.querySelector('#pills-profile');
const dropdownMenu = document.querySelector('.dropdown-menu');
// profi.addEventListener('click', function () {
// 	//CAN FETCH DURING CLICk
// 	// fetch('/userInfo.json')
// 	// 	.then((response) => {
// 	// 		return response.json();
// 	// 	})
// 	// 	.then((data) => {
// 	// 		json1 = json1.concat(data);
// 	// 		user.innerHTML = 'Hello ' + json1[0]['email'];
// 	// 	});
// 	document.querySelector('#lol').innerHTML = 'hi';
// });
/////////////////////////////////////////////////////
/*
constants
*/
json = [];
json1 = [];
teamJson = [];
/////////////////////////////
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
		cardBox.classList.remove('cardBox__zIndex');
		navList.classList.remove('switchZindex');
		pillsProf.classList.remove('switchZindex');
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
		cardBox.classList.add('cardBox__zIndex');
		navList.classList.add('switchZindex');
		pillsProf.classList.add('switchZindex');
	}
});
let createTabs = (json) => {
	teamName = json['teams'].replace(' ', '-');
	// console.log(teamName);
	// let nav_item = document.createElement('li');
	// nav_item.className = 'nav-item';
	// nav_item.setAttribute('role', 'presentation');

	let tabButton = document.createElement('button');
	tabButton.className = 'nav-link dropdown-item Tasklist__teamTabs';
	tabButton.id = `pills-${teamName}-tab`;

	tabButton.setAttribute('data-bs-toggle', 'pill');
	tabButton.setAttribute('data-bs-target', '#pills-profile');

	tabButton.type = 'button';
	tabButton.role = 'tab';
	tabButton.setAttribute('aria-controls', 'pills-profile');
	tabButton.setAttribute('aria-selected', 'false');
	tabButton.innerHTML = json['teams'];

	tabButton.addEventListener('click', function () {
		let div = document.createElement('div');
		div.className = 'taskListTabs__Width';
		if (json['events'].length == 0) {
			div.innerHTML = `${json['teams']} has no tasks`;
		} else {
			div.innerHTML = `Click ${json['teams']}'s event to resolve`;
		}

		div.className = 'taskListTabs__title taskListTabs__Width';
		if (pillsProf.hasChildNodes()) {
			while (pillsProf.firstChild) {
				pillsProf.removeChild(pillsProf.firstChild);
			}
			pillsProf.appendChild(div);
			for (let i = 0; i < json['events'].length; i++) {
				createEventinList(json['events'][i], json['teams']);
			}
		}
	});
	let divider = document.createElement('div');
	divider.className = 'dropdown-divider';

	dropdownMenu.appendChild(tabButton);
	dropdownMenu.appendChild(divider);
	// nav_item.appendChild(tabButton);
	// navList.appendChild(nav_item);
};
let createEventinList = (json, teamName) => {
	let lg = document.createElement('div');
	lg.className = 'list-group taskListTabs__Width';

	let btn = document.createElement('button');
	btn.setAttribute('type', 'button');
	btn.className =
		'list-group-item list-group-item-action taskListTabs__Buttons';
	btn.addEventListener('click', function () {
		btn.classList.add('displayNone');
	});
	btn.setAttribute('type', 'submit');
	btn.name = 'teamTaskDismiss';
	btn.value = 'teamTaskDismiss';
	let form = document.createElement('form');
	form.method = 'POST';
	form.target = 'frame';
	let inpTeamName = document.createElement('input');
	inpTeamName.type = 'text';
	inpTeamName.id = 'teamName';
	inpTeamName.name = 'teamName';
	inpTeamName.value = teamName;
	console.log(teamName);
	inpTeamName.className = 'removeTag';
	let inpEvent = document.createElement('input');
	inpEvent.type = 'text';
	inpEvent.id = 'eventTitle';
	inpEvent.name = 'eventTitle';
	inpEvent.value = json['title'];
	inpEvent.className = 'removeTag';

	let inpStart = document.createElement('input');
	inpStart.type = 'text';
	inpStart.id = 'eventStart';
	inpStart.name = 'eventStart';
	inpStart.value = json['start'];
	inpStart.className = 'removeTag';
	let inpEnd = document.createElement('input');
	inpEnd.type = 'text';
	inpEnd.id = 'eventEnd';
	inpEnd.name = 'eventEnd';
	inpEnd.value = json['end'];
	inpEnd.className = 'removeTag';

	let title = document.createElement('h3');
	title.innerHTML = json['title'];

	let sml = document.createElement('small');
	sml.innerHTML =
		'Start: ' +
		json['start'].replace('T', ' Time: ') +
		' | End: ' +
		json['end'].replace('T', ' Time: ');
	form.appendChild(inpTeamName);
	form.appendChild(inpEvent);
	form.appendChild(inpStart);
	form.appendChild(inpEnd);
	form.appendChild(btn);
	btn.appendChild(title);
	btn.appendChild(sml);
	lg.appendChild(form);
	pillsProf.appendChild(lg);
};
let createCard = (json, num) => {
	let row = document.createElement('div');
	if ((num == 2) == true) {
		tagList.className = 'row row-cols-1 row-cols-md-3 g-4 webContainer';
	} else {
		tagList.className = 'row row-cols-1 row-cols-md-1 g-4 webContainer';
	}

	let col = document.createElement('div');
	col.className = 'col flxGrw';

	let card = document.createElement('div');
	card.className = 'card h-100';

	let img = document.createElement('img');
	img.className = 'card-img-top';
	img.width = 390;
	img.height = 40;
	img.src = '/static/Images/colortag.png';

	let card_body = document.createElement('div');
	card_body.className = 'card-body';
	let card_title = document.createElement('h5');
	card_title.className = 'card-title teamCardWidth cardBox__cardTitle';
	card_title.innerHTML = json['title'];

	let card_text = document.createElement('p');
	card_text.className = 'card-text';
	card_text.innerHTML =
		'Starting date: ' + json['start'].replace('T', ' Time: ');

	let card_text_end = document.createElement('p');
	card_text_end.className = 'card-text';
	card_text_end.innerHTML =
		'Ending date: ' + json['end'].replace('T', ' Time: ');

	let form = document.createElement('form');
	form.method = 'POST';
	form.target = 'frame';
	let inpEvent = document.createElement('input');
	inpEvent.type = 'text';
	inpEvent.id = 'eventTitle';
	inpEvent.name = 'eventTitle';
	inpEvent.value = json['title'];
	inpEvent.className = 'removeTag';

	let inpStart = document.createElement('input');
	inpStart.type = 'text';
	inpStart.id = 'eventStart';
	inpStart.name = 'eventStart';

	inpStart.value = json['start'];
	inpStart.className = 'removeTag';

	let inpEnd = document.createElement('input');
	inpEnd.type = 'text';
	inpEnd.id = 'eventEnd';
	inpEnd.name = 'eventEnd';
	inpEnd.value = json['end'];
	inpEnd.className = 'removeTag';

	let card_footer = document.createElement('div');
	card_footer.className = 'card-footer';

	let card_button = document.createElement('button');
	card_button.className = 'btn btn-primary';
	card_button.innerHTML = 'Resolve';
	card_button.type = 'submit';
	card_button.name = 'personalDismiss';
	card_button.value = 'personalDismiss';
	card_button.addEventListener('click', function () {
		col.classList.add('displayNone');
	});
	card_footer.append(card_button);
	card_footer.appendChild(card_button);
	form.appendChild(inpEvent);
	form.appendChild(inpStart);
	form.appendChild(inpEnd);
	form.appendChild(card_footer);
	card_body.appendChild(card_title);
	card_body.appendChild(card_text);
	card_body.appendChild(card_text_end);

	card.appendChild(img);
	card.appendChild(card_body);
	card.appendChild(form);
	col.appendChild(card);

	tagList.appendChild(col);
};

let createList = (json) => {
	if (json.length < 3) {
		for (let i = 0; i < json.length; i++) {
			createCard(json[i], 1);
		}
	} else {
		for (let i = 0; i < json.length; i++) {
			createCard(json[i], 2);
		}
	}
};

let initTabs = (json) => {
	for (let i = 0; i < json.length; i++) {
		createTabs(json[i]);
	}
};
Promise.all([
	fetch('/calen.json'),
	fetch('/userTeams.json'),
	fetch('/userInfo.json'),
])
	.then(function (responses) {
		return Promise.all(
			responses.map(function (response) {
				return response.json();
			})
		);
	})
	.then(function (data) {
		json = json.concat(data[0]['events']);
		teamJson = teamJson.concat(data[1]);
		json1 = json1.concat(data[2]);

		createList(json);
		initTabs(teamJson);

		user.innerHTML = 'Hello ' + json1[0]['email'];
	});

// document.addEventListener('DOMContentLoaded', function () {
// 	var json1 = [];
// 	var json = [];
// 	// fetch('/calen.json')
// 	// 	.then((response) => {
// 	// 		return response.json();
// 	// 	})
// 	// 	.then((data) => {
// 	// 		json = json.concat(data);
// 	// 		test.innerHTML = json[0]['end'];
// 	// 	});
// 	fetch('/userInfo.json')
// 		.then((response) => {
// 			return response.json();
// 		})
// 		.then((data) => {
// 			json1 = json1.concat(data);
// 			user.innerHTML = 'Hello ' + json1[0]['email'];
// 		});
// });
// $('button').click(function () {
// 	alert(this.classList); // or alert($(this).attr('id'));
// });
$(document).ready(function () {
	$('.dropdown-toggle').dropdown();
});
