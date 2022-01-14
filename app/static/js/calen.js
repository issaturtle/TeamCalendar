const fadeElement = document.querySelectorAll('.has-fade');
const fadeDB = document.querySelectorAll('.has-fade-db');
const eventMenu = document.querySelector('.addEvent__menu');
const overlay = document.querySelector('.overlay');
const eve = document.querySelector('.addEvent');
const del = document.querySelector('.deleteEvent');
const body = document.querySelector('.body');
const submit = document.querySelector('.Register__Button');
const teamName = document.querySelector('#calenName');
let calendarEl = document.getElementById('calendar');
let calendar = new FullCalendar.Calendar(calendarEl);

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;
let eventCreate = () => {
	if (eve.classList.contains('open')) {
		//opens
		if (eve.classList.contains('opens')) {
		} else {
			overlay.classList.remove('fade-in');
			overlay.classList.add('fade-out');
		}

		fadeElement.forEach(function (element) {
			element.classList.remove('fade-in');
			element.classList.add('fade-out');
		});
		body.classList.remove('noScroll');
		eve.classList.remove('open');
	} else {
		//close
		// overlay.classList.remove('fade-out');
		// overlay.classList.add('fade-in');
		fadeElement.forEach(function (element) {
			element.classList.remove('fade-out');
			element.classList.add('fade-in');
		});
		body.classList.add('noScroll');
		eve.classList.add('open');
	}
};

document.addEventListener('DOMContentLoaded', function () {
	var json = [];
	var json1 = [];
	Promise.all([fetch('/calen.json'), fetch('/userInfo.json')])
		.then(function (responses) {
			return Promise.all(
				responses.map(function (response) {
					return response.json();
				})
			);
		})
		.then(function (data) {
			json = json.concat(data[0]['events']);
			json1 = json1.concat(data[1]['email']);

			if (data[0]['team'] != undefined) {
				teamName.innerHTML = data[0]['team'] + "'s calendar";
			} else {
				teamName.innerHTML = json1 + "'s calendar";
			}

			calendar = new FullCalendar.Calendar(calendarEl, {
				initialView: 'dayGridMonth',
				selectable: true,
				timeZone: 'PT',
				initialDate: today,
				displayEventTime: true,

				dateClick: function (info) {
					eventCreate();
					// for (let i = 0; i < json.length; i++) {
					// 	if (
					// 		info.dateStr == json[i]['start'] ||
					// 		info.dateStr == json[i]['end']
					// 	) {
					// 		date +=
					// 			json[i]['title'] +
					// 			': Start: ' +
					// 			json[i]['start'] +
					// 			', Deadline: ' +
					// 			json[i]['end'] +
					// 			'\n';

					// 		empty = true;
					// 	} else {
					// 		continue;
					// 	}
					// }

					// if (empty == false) {
					// 	alert('Date: ' + info.dateStr + '\n' + 'No Tasks ');
					// } else {
					// 	alert('Date: ' + info.dateStr + '\n' + 'Tasks: ' + '\n' + date);
					// }
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
							eventCreate();
						},
					},
					Dashboard: {
						text: 'Teams',
						click: function () {
							if (eve.classList.contains('opens')) {
								//opens
								if (eve.classList.contains('open')) {
								} else {
									overlay.classList.remove('fade-in');
									overlay.classList.add('fade-out');
								}

								fadeDB.forEach(function (element) {
									element.classList.remove('fade-in');
									element.classList.add('fade-out');
								});
								body.classList.remove('noScroll');
								eve.classList.remove('opens');
							} else {
								//close
								overlay.classList.remove('fade-out');
								overlay.classList.add('fade-in');
								fadeDB.forEach(function (element) {
									element.classList.remove('fade-out');
									element.classList.add('fade-in');
								});
								body.classList.add('noScroll');
								eve.classList.add('opens');
							}
						},
					},
					LogoutButton: {
						text: 'Logout',
						click: function () {
							location.replace('/logout');
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
					left: 'Dashboard prev,next,today addEventButton',
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
function myFunc(vars) {
	return vars;
}
