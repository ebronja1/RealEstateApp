document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const nekretninaId = urlParams.get('id');
    console.log('id sa detalji.html' ,nekretninaId);
    if (nekretninaId) {
      // Fetching details for the selected nekretninaId using Ajax
      PoziviAjax.getNekretninaById(nekretninaId, function (err, nekretnina) {
        if (err) {
          console.error(err);
          // Handling error, e.g., display an error message on the page
        } else {
          // Updating HTML with nekretnina details
          //document.querySelector('#osnovno img').src = nekretnina.slika; 
          let nekretnina1 = JSON.parse(nekretnina);
          document.querySelector('#osnovno img').src = "https://upload.wikimedia.org/wikipedia/commons/f/f5/%C5%BDupni_stan_Vuka.jpg";
          document.querySelector('#naziv').textContent = `Naziv: ${nekretnina1.naziv}`;
          document.querySelector('#kvadratura').textContent = `Kvadratura: ${nekretnina1.kvadratura} m^2`;
          document.querySelector('#cijena').textContent = `Cijena: ${nekretnina1.cijena} KM`;

  
          // Adding Lokacija and Godina Izgradnje to HTML
          document.querySelector('#tipGrijanja').textContent = `Tip grijanja: ${nekretnina1.tip_grijanja}`;
          document.querySelector('#godinaIzgradnje').textContent = `Godina izgradnje: ${nekretnina1.godina_izgradnje}`;
          document.querySelector('#lokacija').textContent = `Lokacija: ${nekretnina1.lokacija}`;
          document.querySelector('#datumObjave').textContent = `Datum Objave: ${nekretnina1.datum_objave}`;
          document.querySelector('#opis').textContent = `Opis: ${nekretnina1.opis}`;
  
          const upitiForNekretnina = nekretnina1.upiti;
          console.log('upiti', upitiForNekretnina);
          // Get the ul element where you want to append li items
          var upitiUl = document.querySelector('#listaUpita');

          // Loop through the upiti array
          for (const upit of upitiForNekretnina) {
            // Create a new li element
            const liElement = document.createElement('li');

            // Create nested elements for username and text
            const usernameElement = document.createElement('p');
            usernameElement.classList.add('naslovcic');
            usernameElement.textContent = upit.korisnik.username;

            const textElement = document.createElement('p');
            const brElement = document.createElement('br');
            textElement.textContent = upit.tekst_upita;

            // Append nested elements to the li element
            liElement.appendChild(usernameElement);
            liElement.appendChild(brElement);
            liElement.appendChild(textElement);

            // Append the li element to the ul
            upitiUl.appendChild(liElement);
          }
            
            //Za loginovanog korisnika prikaz polja za dodavanje upita
            PoziviAjax.getKorisnik(function (err, data) {
                if (err) {
                  console.log(err);
                } else {
                    console.log('Code is reaching this point.'); // Add this line for debugging
                    var divZaUpit = document.querySelector('#dodajUpitForma');
                    console.log('divZaUpit', divZaUpit.style.display = "block");
                    divZaUpit.style.display = "block";

                  var dugmeZaPotvrdu = document.querySelector('#dodajUpit');
                  dugmeZaPotvrdu.addEventListener('click', function () {
                    var tekstPolje = document.querySelector('#upitInputField');
                    var uneseniTekst = tekstPolje.value; 
                    PoziviAjax.postUpit(nekretnina1.id, uneseniTekst, function (err, data) {
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
      }
    });
  }
});
