const buttonNav = document.querySelector('#buttonNav');
const header = document.querySelector('.header');
const overlay = document.querySelector('.overlay');
const Reg = document.querySelector('.Register');
const fadeElement = document.querySelectorAll('.has-fade');
const body = document.querySelector('body');
const signUpHomepage = document.querySelector('.intro__text');
buttonNav.addEventListener('click', function () {
	if (header.classList.contains('open')) {
		fadeElement.forEach(function (element) {
			element.classList.remove('fade-in');
			element.classList.add('fade-out');
		});
		body.classList.remove('noScroll');
		header.classList.remove('open');

		Reg.classList.remove('Register__open');
		//close ham

		// overlay.classList.add('fade-out');
		// overlay.classList.remove('fade-in');
	} else {
		fadeElement.forEach(function (element) {
			element.classList.remove('fade-out');
			element.classList.add('fade-in');
		});
		body.classList.add('noScroll');
		header.classList.add('open');

		Reg.classList.add('Register__open');
		// overlay.classList.remove('fade-out');
		// overlay.classList.add('fade-in');

		// overlay.classList.remove('fade-out');
		// overlay.classList.add('fade-in');
	}
});
