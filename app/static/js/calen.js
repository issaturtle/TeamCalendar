const fadeElement = document.querySelectorAll('.has-fade');
const overlay = document.querySelector('.overlay');
const eve = document.querySelector('.addEvent');
const body = document.querySelector('.body');
const submit = document.querySelector('.Register__Button');
var events = {};
document.addEventListener('DOMContentLoaded', function () {
	var calendarEl = document.getElementById('calendar');
	var calendar = new FullCalendar.Calendar(calendarEl, {
		initialView: 'dayGridMonth',
	});
	calendar.render();
});
// var calendar = new FullCalendar.Calendar(calendarEl, {
// 	themeSystem: 'bootstrap',
// });

document.addEventListener('DOMContentLoaded', function () {
	var calendarEl = document.getElementById('calendar');

	var calendar = new FullCalendar.Calendar(calendarEl, {
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
				text: 'Create events',
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
		},

		headerToolbar: {
			left: 'prev,next today addEventButton',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay',
		},
		events: [
			{
				title: 'All Day Event',
				start: '2021-11-01',
			},
			{
				title: 'Long Event',
				start: '2021-11-09',
				end: '2021-11-10',
			},
			{
				groupId: '999',
				title: 'Repeating Event',
				start: '2021-11-09T16:00:00',
			},
			{
				groupId: '999',
				title: 'Repeating Event',
				start: '2021-11-16T16:00:00',
			},
			{
				title: 'Conference',
				start: '2021-11-11',
				end: '2021-11-13',
			},
			{
				title: 'Meeting',
				start: '2021-11-12T10:30:00',
				end: '2021-11-12T12:30:00',
			},
			{
				title: 'Lunch',
				start: '2021-11-12T12:00:00',
			},
			{
				title: 'Meeting',
				start: '2021-11-12T14:30:00',
			},
			{
				title: 'Birthday Party',
				start: '2021-11-13T07:00:00',
			},
			{
				title: 'Click for Google',
				url: 'http://google.com/',
				start: '2021-11-28',
			},
		],
	});

	calendar.render();
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
// fetch('/calen')
// 	.then(function (response) {
// 		return response.text();
// 	})
// 	.then(function (text) {
// 		console.log('get response as text');
// 		console.log(text);
// 	});
fetch('/calen');
function addEvent(event) {
	calendar.addEvent();
}
