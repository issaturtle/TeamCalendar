const buttonNav = document.querySelector('#buttonNav');
const header = document.querySelector('.header');

const fadeElement = document.querySelectorAll('.has-fade');
const body = document.querySelector('body');
const signUpHomepage = document.querySelector('.intro__text');
const aboutpage = document.querySelector('.about');
buttonNav.addEventListener('click', function () {
	if (header.classList.contains('open')) {
		fadeElement.forEach(function (element) {
			element.classList.remove('fade-in');
			element.classList.add('fade-out');
		});
		body.classList.remove('noScroll');
		header.classList.remove('open');
		aboutpage.classList.remove('open');
	} else {
		fadeElement.forEach(function (element) {
			element.classList.remove('fade-out');
			element.classList.add('fade-in');
		});
		body.classList.add('noScroll');
		header.classList.add('open');
		aboutpage.classList.add('open');
	}
});
