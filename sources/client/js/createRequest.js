function createRequest(body, callback) {
    let xhr = new XMLHttpRequest();
	xhr.open("POST", "https://jscp-diplom.netoserver.ru/", true);
	xhr.responseType = "json";
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send(body);
	xhr.onload = () => {
		try {
            if (xhr.status === 200) {
                const response = xhr.response;
                for (let key in response) {
                    if (response[key].err) {
                        alert(`Ошибка обращения ${response[key].err}: ${response[key].errMessage}`);
                        return;
                    }
                }
                callback(response);
            } else {
                alert(`Ошибка запроса: ${xhr.status} ${xhr.statusText}`);
            }
        } catch (err) {
            alert(`Ошибка ответа: ${err.message}`);
        }
    };
};

// function createRequest(request) {
// 	return fetch("https://jscp-diplom.netoserver.ru/", {
// 	  method: 'POST',
// 	  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
// 	  body: request,
// 	})
// 	.then(response => {
// 	  if(!response.ok) {
// 		throw new Error('Неудачный запрос')
// 	  }
// 	  return response.json();
// 	  })
// 	  .catch(error => {
// 		console.error('Ошибка:', error);
// 	 })
//   }