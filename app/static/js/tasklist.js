const buttonNav = document.querySelector('#buttonNav');
const header = document.querySelector('.header');
const overlay = document.querySelector('.overlay');
const fadeDB = document.querySelectorAll('.has-fade-db');
const body = document.querySelector('.body');
const test = document.querySelector('#test');
const user = document.querySelector('#username');
const tagList = document.querySelector('#tagsList');
const cardBox = document.querySelector('.cardBox__container');

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
	}
});

let createCard = (json) => {
	let row = document.createElement('div');
	row.className = 'row row-cols-1 row-cols-md-3 g-4 webContainer';

	let col = document.createElement('div');
	col.className = 'col';

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
	card_title.innerHTML = json['title'];
	let card_text = document.createElement('p');
	card_text.className = 'card-text';
	card_text.innerHTML = 'Starting date: ' + json['start'];
	let card_text_end = document.createElement('p');
	card_text_end.className = 'card-text';
	card_text_end.innerHTML = 'Ending date: ' + json['end'];

	let card_footer = document.createElement('div');
	card_footer.className = 'card-footer';

	let card_button = document.createElement('button');
	card_button.className = 'btn btn-primary';
	card_button.innerHTML = 'Resolve';
	card_button.addEventListener('click', function () {
		col.classList.add('displayNone');
		// setTimeout(1000);
		// col.classList.add('removeTag');
	});
	card_footer.append(card_button);
	card_footer.appendChild(card_button);
	card_body.appendChild(card_title);
	card_body.appendChild(card_text);
	card_body.appendChild(card_text_end);

	card.appendChild(img);
	card.appendChild(card_body);
	card.appendChild(card_footer);
	col.appendChild(card);

	tagList.appendChild(col);
};

let createList = (json) => {
	for (let i = 0; i < json.length; i++) {
		createCard(json[i]);
	}
};
json = [];
fetch('/calen.json')
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		json = json.concat(data);
		// test.innerHTML = json.length;
		createList(json);
	});
document.addEventListener('DOMContentLoaded', function () {
	var json1 = [];
	var json = [];
	// fetch('/calen.json')
	// 	.then((response) => {
	// 		return response.json();
	// 	})
	// 	.then((data) => {
	// 		json = json.concat(data);
	// 		test.innerHTML = json[0]['end'];
	// 	});
	fetch('/userInfo.json')
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			json1 = json1.concat(data);
			user.innerHTML = 'Hello ' + json1[0]['email'];
		});
});
$('button').click(function () {
	alert(this.classList); // or alert($(this).attr('id'));
});
