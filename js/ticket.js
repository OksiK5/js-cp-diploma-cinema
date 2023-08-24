const selectSeance = JSON.parse(sessionStorage.selectSeance);

document.addEventListener('DOMContentLoaded', () => {
	
	let places = selectSeance.salesPlaces.map(element => `${element.row}/${element.place}`).join(', ');
	let price = 0;
	price += selectSeance.salesPlaces.reduce((total, element) => total + (element.type === 'standart' ? Number(selectSeance.priceStandart) : Number(selectSeance.priceVip)), 0);

	document.querySelector('.ticket__title').innerHTML = selectSeance.filmName;
	document.querySelector('.ticket__start').innerHTML = selectSeance.seanceTime;
	document.querySelector('.ticket__hall').innerHTML = selectSeance.hallName;
	document.querySelector('.ticket__chairs').innerHTML = places;
	
	const date = new Date(Number(`${selectSeance.seanceTimeStamp}000`));
	const dateStr = date.toLocaleDateString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	});
	
	const textQR = `
	Фильм: ${selectSeance.filmName} 
	Дата: ${dateStr}
	Начало сеанса: ${selectSeance.seanceTime} 
	Зал: ${selectSeance.hallName} 
	Ряд/Место: ${places} 
	Билет действителен строго на свой сеанс`;

	const qrcode = QRCreator(textQR, {
		image: "SVG"
	}); 
	  document.querySelector('.ticket__info-qr').append(qrcode.result); 
});