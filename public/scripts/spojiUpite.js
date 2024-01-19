document.addEventListener('DOMContentLoaded', async function () {

    //Za loginovanog korisnika prikaz polja za dodavanje upita
    PoziviAjax.getKorisnik(function (err, data) {
        if (err) {
        console.log(err);
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const nekretninaId = urlParams.get('id');


            console.log('Code is reaching this point.'); // Add this line for debugging
            var divZaUpit = document.querySelector('#dodajUpitForma');
            console.log('divZaUpit', divZaUpit.style.display = "block");
            divZaUpit.style.display = "block";

        var dugmeZaPotvrdu = document.querySelector('#dodajUpit');
        dugmeZaPotvrdu.addEventListener('click', function () {
            var tekstPolje = document.querySelector('#upitInputField');
            var uneseniTekst = tekstPolje.value; 
            PoziviAjax.postUpit(nekretninaId, uneseniTekst, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                tekstPolje.value = '';
                location.reload();
            }
            });
        });
        }
    });
});