const addEvent = document.querySelector('.addEvent__menu');
const buttonNav = document.querySelector('#buttonNav');
const header = document.querySelector('.header');
const overlay = document.querySelector('.overlay');
const fadeDB = document.querySelectorAll('.has-fade-db');
const body = document.querySelector('.body');
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
		addEvent.classList.remove('switchZindex');
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
		addEvent.classList.add('switchZindex');
	}
});
json1 = [];
fetch('/userInfo.json')
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		json1 = json1.concat(data);
		user.innerHTML = 'Hello ' + json1[0]['email'];
	});
