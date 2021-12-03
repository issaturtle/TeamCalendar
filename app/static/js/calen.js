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
								// fadeElement.forEach(function (element) {
								// 	element.classList.remove('fade-in');
								// 	element.classList.add('fade-out');
								// });
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

				// events: [
				// 	{
				// 		end: '2021-11-18',
				// 		start: '2021-11-17',
				// 		title: 'No Nut',
				// 	},
				// 	{
				// 		end: '2021-11-20',
				// 		start: '2021-11-19',
				// 		title: 'No Nut',
				// 	},
				// 	{
				// 		end: '2021-11-30',
				// 		start: '2021-11-11',
				// 		title: 'add',
				// 	},
				// ],
				// // events: 'app/static/calendar_test/examples/json/events.json',
			});
			calendar.render();
			console.log(json);
		});
});

// let ar = JSON.parse(
// 	'D:/visualstudioProj/FlaskProject/app/static/calendar_test/examples/json/events.json'
// );
// var my_json;
// $.getJSON(
// 	'D:/visualstudioProj/FlaskProject/app/static/calendar_test/examples/json/events.json',
// 	function (json) {
// 		my_json = JSON.parse(json);
// 	}
// );
// var json = [];
// fetch(
// 	'D:/visualstudioProj/FlaskProject/app/static/calendar_test/examples/json/events.json'
// )
// 	.then(function (response) {
// 		json = response.json();
// 	})
// 	.then(function (obj) {
// 		console.log(obj);
// 	});
// fetch('./events.json')
// 	.then((response) => {
// 		return response.json();
// 	})
// 	.then((data) => {
// 		console.log(data);
// 	});\

//works
// var json = [
// 	{
// 		start: '2021-11-01',
// 		title: 'new Event',
// 	},
// 	{
// 		title: 'Long Event',
// 		start: '2021-11-01',
// 		end: '2021-11-02',
// 	},
// ];

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
// fetch('/calen')
// 	.then(function (response) {
// 		return response.text();
// 	})
// 	.then(function (text) {
// 		console.log('get response as text');
// 		console.log(text);
// 	});
