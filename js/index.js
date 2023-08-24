const listDayWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const dayNumber = document.querySelectorAll('.page-nav__day-number');
const dayWeek = document.querySelectorAll('.page-nav__day-week');

document.addEventListener('DOMContentLoaded', () => {
	const date = new Date();
	date.setHours(0, 0, 0);
	for (let i = 0; i < dayNumber.length; i++) {
		let newDay = new Date(date.getTime() + (i * 24 * 60 * 60 * 1000));
		let timestamp = Math.trunc(newDay / 1000);
		dayNumber[i].innerHTML = newDay.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) + '.';
		dayWeek[i].innerHTML = `${listDayWeek[newDay.getDay()]}`;
		let link = dayNumber[i].parentNode;
		link.dataset.timeStamp = timestamp;
		if ((dayWeek[i].innerHTML == 'Вс') || (dayWeek[i].innerHTML == 'Сб')) {
			link.classList.add('page-nav__day_weekend');
		} else {
			link.classList.remove('page-nav__day_weekend');
		}
	}

	const request = 'event=update';
	createRequest(request, (response) => {
		let object = {};
		object.seances = response.seances.result;
		object.films = response.films.result;
		object.halls = response.halls.result;
		object.halls = object.halls.filter(hall => hall.hall_open == 1);

		const main = document.querySelector('main');
		object.films.forEach((film) => {
			let seancesHTML = '';
			let filmId = film.film_id;

			object.halls.forEach((hall) => {
				let seances = object.seances.filter(seance => ((seance.seance_hallid == hall.hall_id) && (seance.seance_filmid == filmId)));
				if (seances.length > 0) {
					seancesHTML += `
					  <div class="movie-seances__hall">
						<h3 class="movie-seances__hall-title">${hall.hall_name}</h3>
						<ul class="movie-seances__list">`;
					seances.forEach(seance => seancesHTML += `<li class="movie-seances__time-block"><a class="movie-seances__time"   href="hall.html" data-film-name="${film.film_name}" data-film-id="${film.film_id}" data-hall-id="${hall.hall_id}" data-hall-name="${hall.hall_name}" data-price-vip="${hall.hall_price_vip}" data-price-standart="${hall.hall_price_standart}" data-seance-id="${seance.seance_id}" 
						data-seance-start="${seance.seance_start}" data-seance-time="${seance.seance_time}">${seance.seance_time}</a></li>`);
					seancesHTML += `
					  </ul>
					  </div>`;
				}
			});

			if (seancesHTML) {
				main.innerHTML += `
					<section class="movie">
					  <div class="movie__info">
						<div class="movie__poster">
						  <img class="movie__poster-image" alt="${film.film_name} постер" src="${film.film_poster}">
						</div>
						<div class="movie__description">
						  <h2 class="movie__title">${film.film_name}</h2>
						  <p class="movie__synopsis">${film.film_description}</p>
						  <p class="movie__data">
							<span class="movie__data-duration">${film.film_duration} мин.</span>
							<span class="movie__data-origin">${film.film_origin}</span>
						  </p>
						</div>
					  </div>
					  ${seancesHTML}
					</section>`;
			}
		});

		const dayLinks = Array.from(document.querySelectorAll('.page-nav__day'));
		const movieSeances = Array.from(document.querySelectorAll('.movie-seances__time'));
		dayLinks.forEach(dayLink => {
			dayLink.addEventListener('click', (event) => {
				event.preventDefault();

				const chosenDay = document.querySelector('.page-nav__day_chosen');
				chosenDay.classList.remove('page-nav__day_chosen');
				dayLink.classList.add('page-nav__day_chosen');

				const timeStampDay = Number(event.target.dataset.timeStamp) || Number(event.target.closest('.page-nav__day').dataset.timeStamp);

				movieSeances.forEach(movieSeance => {
					const timeStampSeanceDay = Number(movieSeance.dataset.seanceStart) * 60;
					const timeStampSeance = timeStampDay + timeStampSeanceDay;
					const timeStampNow = Math.trunc(+new Date() / 1000);
					movieSeance.dataset.seanceTimeStamp = timeStampSeance;

					if (timeStampSeance - timeStampNow > 0) {
						movieSeance.classList.remove('acceptin-button-disabled');
					} else {
						movieSeance.classList.add('acceptin-button-disabled');
					}
				});
			});
		});

		dayLinks[0].click();

		movieSeances.forEach(movieSeance => {
			movieSeance.addEventListener('click', (event) => {
				const selectSeance = event.target.dataset;
				selectSeance.hallConfig = object.halls.find(hall => hall.hall_id == selectSeance.hallId).hall_config;
				sessionStorage.setItem('selectSeance', JSON.stringify(selectSeance));
			});

		});
	});
});