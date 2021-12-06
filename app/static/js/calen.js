const fadeElement = document.querySelectorAll('.has-fade');

const overlay = document.querySelector('.overlay');
const eve = document.querySelector('.addEvent');
const del = document.querySelector('.deleteEvent');
const body = document.querySelector('.body');
const submit = document.querySelector('.Register__Button');
let calendarEl = document.getElementById('calendar');
let calendar = new FullCalendar.Calendar(calendarEl);

document.addEventListener('DOMContentLoaded', function () {
	var json = [];
	fetch('http://127.0.0.1:5000/calen.json')
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			json = json.concat(data);
			calendar = new FullCalendar.Calendar(calendarEl, {
				initialView: 'dayGridMonth',
				selectable: true,
				timeZone: 'PT',
				initialDate: '2021-11-07',
				dateClick: function (info) {
					alert('Date: ' + info.dateStr);
				},
				dayMaxEventRows: true, // for all non-TimeGrid views
				views: {
					timeGrid: {
						dayMaxEventRows: 6, // adjust to 6 only for timeGridWeek/timeGridDay
					},
				},
				customButtons: {
					addEventButton: {
						text: 'Create/Delete events',
						click: function () {
							if (eve.classList.contains('open')) {
								fadeElement.forEach(function (element) {
									element.classList.remove('fade-in');
									element.classList.add('fade-out');
								});
								body.classList.remove('noScroll');
								eve.classList.remove('open');
							} else {
								fadeElement.forEach(function (element) {
									element.classList.remove('fade-out');
									element.classList.add('fade-in');
								});
								body.classList.add('noScroll');
								eve.classList.add('open');
							}
						},
					},
					LogoutButton: {
						text: 'Logout',
						click: function () {
							location.replace('http://127.0.0.1:5000/logout');
						},
					},
					Deletebutton: {
						text: 'Delete event',
						click: function () {
							if (del.classList.contains('open')) {
								fadeElement.classList;
								body.classList.remove('noScroll');
								del.classList.remove('open');
							} else {
								fadeElement.forEach(function (element) {
									element.classList.remove('fade-out');
									element.classList.add('fade-in');
								});
								body.classList.add('noScroll');
								del.classList.add('open');
							}
						},
					},
				},

				headerToolbar: {
					left: 'prev,next,today addEventButton',
					center: 'title',
					right: 'dayGridMonth,timeGridWeek,timeGridDay LogoutButton',
				},
				events: json,
			});
			calendar.render();
			console.log(json);
		});
});

submit.addEventListener('click', function () {
	if (eve.classList.contains('open')) {
		fadeElement.forEach(function (element) {
			element.classList.remove('fade-in');
			element.classList.add('fade-out');
		});
		body.classList.remove('noScroll');
		eve.classList.remove('open');
	}
});
