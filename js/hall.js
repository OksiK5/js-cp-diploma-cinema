
document.addEventListener('DOMContentLoaded', () => {
	const selectSeance = JSON.parse(localStorage.selectSeance);

	const buyingInfoTitle = document.querySelector('.buying__info-title');
	const buyingInfoStart = document.querySelector('.buying__info-start');
	const buyingInfoHall = document.querySelector('.buying__info-hall');
	const priceStandart = document.querySelector('.price-standart');
	const stepWrapper = document.querySelector('.conf-step__wrapper');
	const stepLegend = document.querySelector('.conf-step__legend');
	const acceptinBtn = document.querySelector('.acceptin-button');

	const infoHint = document.querySelector('.buying__info-hint');
	let touchEnd = 0;
	let scale = 'scale(1.0)';
	let marginTop = '0';
	let paddingTop = '3rem';

	infoHint.addEventListener('touchend', (event) => {
		event.preventDefault();
		let now = new Date().getTime();
		if (now - touchEnd <= 300) {
			scale = (scale === 'scale(1.0)') ? 'scale(1.3)' : 'scale(1.0)';
			paddingTop = (scale === 'scale(1.0)') ? '3rem' : '5rem';
			marginTop = (scale === 'scale(1.0)') ? '0' : '3rem';

			stepLegend.style.paddingTop = paddingTop;
			stepWrapper.style.transform = scale;
			stepWrapper.style.marginTop = marginTop;
		}
		touchEnd = now;
	});

	buyingInfoTitle.innerHTML = `Фильм: ${selectSeance.filmName}`;
	buyingInfoStart.innerHTML = `Начало сеанса: ${selectSeance.seanceTime}`;
	buyingInfoHall.innerHTML = selectSeance.hallName;
	priceStandart.innerHTML = selectSeance.priceStandart;

	const request = `event=get_hallConfig&timestamp=${selectSeance.seanceTimeStamp}&hallId=${selectSeance.hallId}&seanceId=${selectSeance.seanceId}`;

	createRequest(request, (response) => {
		console.log(response);
		if (response === null) {
		stepWrapper.innerHTML = selectSeance.hallConfig;
		} else {
    	stepWrapper.innerHTML = response;
		}

		const chairs = [...document.querySelectorAll('.conf-step__row .conf-step__chair')];
		let chairsSelected = [...document.querySelectorAll('.conf-step__row .conf-step__chair_selected')];
		if (chairsSelected.length) {
			acceptinBtn.removeAttribute('disabled');
		} else {
			acceptinBtn.setAttribute('disabled', true);
		}
		chairs.forEach((chair) => {
			chair.addEventListener('click', (event) => {
				if (event.target.classList.contains('conf-step__chair_taken')) {
					return;
				}
				event.target.classList.toggle('conf-step__chair_selected');
				chairsSelected = [...document.querySelectorAll('.conf-step__row .conf-step__chair_selected')];
				if (chairsSelected.length) {
					acceptinBtn.removeAttribute('disabled');
				} else {
					acceptinBtn.setAttribute('disabled', true);
				}
			});
		});
	});

	acceptinBtn.addEventListener('click', (event) => {
		event.preventDefault();
		const selectedPlaces = Array();
		const stepRow = Array.from(document.getElementsByClassName('conf-step__row'));
		for (let i = 0; i < stepRow.length; i++) {
			const stepChair = Array.from(stepRow[i].getElementsByClassName('conf-step__chair'));
			for (let j = 0; j < stepChair.length; j++) {
				if (stepChair[j].classList.contains('conf-step__chair_selected')) {
					const typePlace = (stepChair[j].classList.contains('conf-step__chair_standart')) ? 'standart' : 'vip';
					selectedPlaces.push({
						'row': i + 1,
						'place': j + 1,
						'type': typePlace
					});
				}
			}
		}
		const configHall = stepWrapper.innerHTML;
		selectSeance.hallConfig = configHall;
		selectSeance.salesPlaces = selectedPlaces;
		localStorage.clear();
		localStorage.setItem('selectSeance', JSON.stringify(selectSeance));
		window.location.href = 'payment.html';
	});
});