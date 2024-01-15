const PoziviAjax = (() => {

    // fnCallback se u svim metodama poziva kada stigne
    // odgovor sa servera putem Ajax-a
    // svaki callback kao parametre ima error i data,
    // error je null ako je status 200 i data je tijelo odgovora
    // ako postoji greška, poruka se prosljeđuje u error parametru
    // callback-a, a data je tada null

    // vraća korisnika koji je trenutno prijavljen na sistem
    function impl_getKorisnik(fnCallback) {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', 'http://localhost:3000/korisnik', true);

        // Set the callback function to handle the response
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                // If the request was successful, call the callback with the parsed JSON data
                fnCallback(null, JSON.parse(xhr.responseText));
            } else {
                // If there was an error, call the callback with an error
                fnCallback(JSON.parse(xhr.responseText), null);
            }
        }
        xhr.send();
    }

    // ažurira podatke loginovanog korisnika
    function impl_putKorisnik(noviPodaci, fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.open('PUT', 'http://localhost:3000/korisnik', true)
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, JSON.parse(ajax.responseText));
            }
            else if (ajax.readyState == 4) {
                fnCallback(JSON.parse(ajax.responseText), null);
            }
            ajax.setRequestHeader('Content-Type','application/json');
            ajax.send(JSON.stringify(noviPodaci));
        }
    }

    // dodaje novi upit za trenutno loginovanog korisnika
    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/upit', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                // The request is complete
                if (xhr.status === 200) {
                // The request was successful, call the callback with the response
                fnCallback(null, JSON.parse(xhr.responseText));
                } else {
                // There was an error, call the callback with an error message
                fnCallback(JSON.parse(xhr.responseText), null);
                }
            }
        };
      
        // Setting the Content-Type header
        xhr.setRequestHeader('Content-Type', 'application/json');
      
        // Sendin the request with the provided data
        xhr.send(JSON.stringify({ nekretnina_id: nekretnina_id, tekst_upita: tekst_upita }));
      }
      

    function impl_getNekretnine(fnCallback) {
        var xhr = new XMLHttpRequest();
        // Specifing the request type, URL, and whether it should be asynchronous
        xhr.open("GET", "http://localhost:3000/nekretnine", true);

        // Set up the callback function to handle the response
        xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    fnCallback(null, xhr.responseText);
                } else {
                    fnCallback(xhr.responseText, null);
                }
                }
            };

            // Send the request
            xhr.send();
    }

    function impl_postLogin(username, password, fnCallback) {
        var xhr = new XMLHttpRequest();
    
        // Specifing the request type, URL, async
        xhr.open("POST", "http://localhost:3000/login", true);
    
        // Setting the Content-Type header for a JSON request
        xhr.setRequestHeader("Content-Type", "application/json");
    
        // Setting up the callback function to handle the response
        xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
            // Parse the JSON response
            var data = JSON.parse(xhr.responseText);
    
            // Call the callback function with the response data
            fnCallback(null, data);
            } else {
            // Call the callback function with an error
            fnCallback(data, null);
            }
        }
        };
    
        // Create the request payload as a JSON string
        var requestBody = JSON.stringify({
        username: username,
        password: password,
        });
    
        // Send the request with the payload
        xhr.send(requestBody);
       
    }


    function impl_postLogout(fnCallback) {
        var xhr = new XMLHttpRequest();
    
        // Specifing the request type, URL, and whether it should be asynchronous
        xhr.open("POST", "http://localhost:3000/logout", true);
    
        // Setting the Content-Type header for a JSON request
        xhr.setRequestHeader("Content-Type", "application/json");
    
        // Setting up the callback function to handle the response
        xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
            // Parse the JSON response
            var data = JSON.parse(xhr.responseText);
    
            // Call the callback function with the response data
            fnCallback(null, data);
            } else {
            // Call the callback function with an error
            fnCallback(data, null);
            }
        }
        };
    
        // Sending the request without a payload since it's a logout request
        xhr.send();
    }

    function impl_getNekretninaById(nekretnina_id, fnCallback) {
        var xhr = new XMLHttpRequest();
        // Specifing the request type, URL, and whether it should be asynchronous
        xhr.open("GET", `http://localhost:3000/nekretnina/${nekretnina_id}`, true);
        // Set up the callback function to handle the response
        xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    fnCallback(null, xhr.responseText);
                } else {
                    fnCallback(xhr.responseText, null);
                }
                }
            };

            // Send the request
            xhr.send();
    }

  
    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine,
        getNekretninaById: impl_getNekretninaById
    };
})();

