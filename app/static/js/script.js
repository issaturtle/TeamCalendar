const buttonNav = document.querySelector('#buttonNav');
const header = document.querySelector('.header');
const overlay = document.querySelector('.overlay');
const Reg = document.querySelector('.Register');
const fadeElement = document.querySelectorAll('.has-fade');
const body = document.querySelector('body');
buttonNav.addEventListener('click', function () {
	if (header.classList.contains('open')) {
		body.classList.remove('noScroll');
		//close ham
		fadeElement.forEach(function (element) {
			element.classList.remove('fade-in');
			element.classList.add('fade-out');
		});
		header.classList.remove('open');
		// overlay.classList.add('fade-out');
		// overlay.classList.remove('fade-in');
		Reg.classList.remove('Register__open');
	} else {
		body.classList.add('noScroll');
		header.classList.add('open');
		fadeElement.forEach(function (element) {
			element.classList.remove('fade-out');
			element.classList.add('fade-in');
		});
		// overlay.classList.remove('fade-out');
		// overlay.classList.add('fade-in');
		Reg.classList.add('Register__open');
	}
});
