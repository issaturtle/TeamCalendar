const buttonNav = document.querySelector('#buttonNav');
const header = document.querySelector('.header');
const overlay = document.querySelector('.overlay');
const Reg = document.querySelector('.Register');

buttonNav.addEventListener('click', function () {
	if (header.classList.contains('open')) {
		//close ham
		header.classList.remove('open');
		overlay.classList.add('fade-out');
		overlay.classList.remove('fade-in');
		Reg.classList.remove('Register__open');
	} else {
		header.classList.add('open');
		overlay.classList.remove('fade-out');
		overlay.classList.add('fade-in');
		Reg.classList.add('Register__open');
	}
});
