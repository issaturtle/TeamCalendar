const buttonNav = document.querySelector('#buttonNav');
const header = document.querySelector('.header');
const overlay = document.querySelector('.overlay');
const fadeDB = document.querySelectorAll('.has-fade-db');
const body = document.querySelector('.body');
const test = document.querySelector('#test');
const user = document.querySelector('#username');
const cardBox = document.querySelector('.cardBox__container');
const tagList = document.querySelector('#tagsList');

let createCard = (json, num) => {
	let row = document.createElement('div');
	if ((num == 2) == true) {
		tagList.className = 'row row-cols-1 row-cols-md-3 g-4 webContainer';
	} else {
		tagList.className = 'row row-cols-1 row-cols-md-1 g-4 webContainer';
	}

	let col = document.createElement('div');
	col.className = 'col teamCardCenter flxGrw';

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
	card_title.className = 'card-title';
	card_title.innerHTML = json['teams'];
	let form = document.createElement('form');

	form.method = 'POST';
	let inpTeamName = document.createElement('input');
	inpTeamName.type = 'text';
	inpTeamName.id = 'teamName';
	inpTeamName.name = 'teamName';
	inpTeamName.value = json['teams'];
	inpTeamName.className = 'removeTag';
	let card_footer = document.createElement('div');
	card_footer.className = 'card-footer flex';

	let card_button = document.createElement('button');
	card_button.className = 'btn btn-primary';
	card_button.innerHTML = "Check team's calendar";
	card_button.type = 'submit';
	card_button.name = 'checkCalen';
	card_button.value = 'checkCalen';

	let card_button2 = document.createElement('button');
	card_button2.className = 'btn btn-danger leaveButton';
	card_button2.innerHTML = 'Leave team';
	card_button2.type = 'submit';
	card_button2.name = 'leaveT';
	card_button2.value = 'leaveT';
	card_button2.addEventListener('click', function () {
		col.classList.add('displayNone');
		form.target = 'frame';
	});

	// card_button.addEventListener('click', function () {});

	card_footer.appendChild(card_button);
	card_footer.appendChild(card_button2);
	form.appendChild(inpTeamName);
	form.append(card_footer);
	card_body.appendChild(card_title);

	card.appendChild(img);
	card.appendChild(card_body);

	card.appendChild(form);
	col.appendChild(card);

	tagList.appendChild(col);
};
json = [];
json1 = [];
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
// fetch('/userTeams.json')
// 	.then((response) => {
// 		return response.json();
// 	})
// 	.then((data) => {
// 		json = json.concat(data);
// 		createList(json);
// 	});
// json1 = [];
// fetch('/userInfo.json')
// 	.then((response) => {
// 		return response.json();
// 	})
// 	.then((data) => {
// 		json1 = json1.concat(data);
// 		user.innerHTML = 'Hello ' + json1[0]['email'];
// 	});
Promise.all([fetch('/userTeams.json'), fetch('/userInfo.json')])
	.then(function (responses) {
		return Promise.all(
			responses.map(function (response) {
				return response.json();
			})
		);
	})
	.then(function (data) {
		json = json.concat(data[0]);
		createList(json);
		json1 = json1.concat(data[1]);
		user.innerHTML = 'Hello ' + json1[0]['email'];
	});

const navList = document.querySelector('#pills-tab');
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
	}
});
