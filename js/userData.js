// Функция для отправки данных на API без ожидания ответа
function sendDataToAPI(data) {
    // Замените URL_API на URL вашего внешнего API
    const apiUrl = 'https://script.google.com/macros/s/AKfycbxBe21mJA3BFE2kt6ibctcr6Fa0HQ6FKzy64CgsUbUUe5FNRLrFKrzgSDa6V6dUAYe73A/exec';

    // Опции запроса
    const options = {
        method: 'POST',
            headers: {
                // 'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
    };

// Отправка данных на API
fetch(apiUrl, options)
    .then(response => {
    if (response.ok) {
        console.log('Данные успешно отправлены на API');
    } else {
        console.error('Произошла ошибка при отправке данных на API');
    }
    })
    .catch(error => {
    console.error('Произошла ошибка при выполнении запроса:', error);
    });
}

// Функция для получения IP-адреса
function getIpAddress() {
    return new Promise((resolve, reject) => {
        const ipServiceUrl = 'https://api.ipify.org?format=json';

        fetch(ipServiceUrl)
            .then(response => response.json())
            .then(data => {
                const ipAddress = data.ip;
                resolve(ipAddress); // Возвращаем IP-адрес через resolve
            })
            .catch(error => {
                reject(error); // Отклоняем промис при возникновении ошибки
            });
    });
}

// Функция для получения данных о геолокации по IP-адресу
function getGeoLocation(ipAddress) {
    return new Promise((resolve, reject) => {
        const geoLocationUrl = `https://ip-api.com/json/${ipAddress}`;

        fetch(geoLocationUrl)
            .then(response => response.json())
            .then(geoData => {
                resolve(geoData); // Возвращаем данные о геолокации через resolve
            })
            .catch(error => {
                reject(error); // Отклоняем промис при возникновении ошибки
            });
    });
}

// Получение отпечатка браузера с помощью FingerprintJS
async function getBrowserFingerprint() {
    try {
      // Создание экземпляра FingerprintJS
      const components = await Fingerprint2.getPromise();
  
      // Получение отпечатка браузера
      const fingerprint = Fingerprint2.x64hash128(components.map(pair => pair.value).join(), 31);
      return fingerprint;
    } catch (error) {
      throw new Error('Ошибка при получении отпечатка браузера: ' + error.message);
    }
  }



const urlParams = new URLSearchParams(window.location.search);

getIpAddress()
    .then(ipAddress => {
        console.log('IP-адрес пользователя:', ipAddress);
        getBrowserFingerprint()
            .then(fingerprint => {
                console.log('Отпечаток браузера:', fingerprint);

                // Создание объекта visitData с учетом IP-адреса, данных о геолокации и отпечатка браузера
                const visitData = {
                    timestamp: new Date().toISOString(),
                    pageUrl: window.location.href,
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    screenWidth: window.screen.width,
                    screenHeight: window.screen.height,
                    appVersion: navigator.appVersion,
                    platform: navigator.platform,
                    cookiesEnabled: navigator.cookieEnabled,
                    timeZoneOffset: new Date().getTimezoneOffset(),
                    ipAddress: ipAddress,
                    // Отпечаток браузера
                    browserFingerprint: fingerprint,
                    // Дополнительные данные можно добавить по необходимости
                    utm_source: urlParams.get('utm_source') || '',
                    utm_medium: urlParams.get('utm_medium') || '',
                    utm_campaign: urlParams.get('utm_campaign') || '',
                    utm_term: urlParams.get('utm_term') || '',
                    utm_content: urlParams.get('utm_content') || '',
                    refferer: document.referrer || '',
                    title: document.title || '',
                };
                console.log('visitData:', visitData);
                // Отправка данных на API с полученными данными
                sendDataToAPI(visitData);
            })
            .catch(error => {
                console.error('Произошла ошибка при получении отпечатка браузера:', error);
            });
    })
    .catch(error => {
        console.error('Произошла ошибка при получении IP-адреса пользователя:', error);
    });