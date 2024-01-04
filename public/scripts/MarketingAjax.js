/*const PoziviAjax = (() => {

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

    return {
        osvjeziPretrage: impl_osvjeziPretrage,
        osvjeziKlikove: impl_osvjeziKlikove,
    };
})();*/