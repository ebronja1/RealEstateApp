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
  
          // Add event listener for the "Otvori detalje" button
          const otvoriDetaljeButton = document.querySelector('.dugme-otvori');
          otvoriDetaljeButton.addEventListener('click', () => {
            // Redirect to detalji.html with the same nekretninaId
            window.location.href = `detalji.html?id=${nekretninaId}`;
          });
        }
      });
    }
  });