const selectSeance = JSON.parse(localStorage.selectSeance);

let places = selectSeance.salesPlaces.map(salePlace => `${salePlace.row}/${salePlace.place}`).join(', ');
let price = selectSeance.salesPlaces.reduce((total, salePlace) => {
	return total + (salePlace.type === 'standart' ? Number(selectSeance.priceStandart) : Number(selectSeance.priceVip));
}, 0);

document.querySelector('.ticket__title').innerHTML = selectSeance.filmName;
document.querySelector('.ticket__hall').innerHTML = selectSeance.hallName;
document.querySelector('.ticket__start').innerHTML = selectSeance.seanceTime;
document.querySelector('.ticket__chairs').innerHTML = places;
document.querySelector('.ticket__cost').innerHTML = price;

const newHallConfig = selectSeance.hallConfig.replace(/selected/g, 'taken');
document.querySelector('.acceptin-button').addEventListener('click', (event) => {
	event.preventDefault();

	fetch('https://jscp-diplom.netoserver.ru/', {
		method: 'POST',
		headers: {
			'Content-Type' : 'application/x-www-form-urlencoded'
		},
		body: `event=sale_add&timestamp=${selectSeance.seanceTimeStamp}&hallId=${selectSeance.hallId}&seanceId=${selectSeance.seanceId}&hallConfiguration=${newHallConfig}`,
	});
});