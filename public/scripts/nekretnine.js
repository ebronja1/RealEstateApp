
function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    // pozivanje metode za filtriranje
    filtriranaListaStanova = instancaModula.filtrirajNekretnine({ tip_nekretnine:  tip_nekretnine});
    let pomocna;
    filtriranaListaStanova.forEach((item) => {
        pomocna = item.tip_nekretnine.toLowerCase();
        if (pomocna == "poslovni prostor") pomocna = "PProstor";
        divReferenca.innerHTML += 
        `<div class="grid-item-${pomocna}">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f5/%C5%BDupni_stan_Vuka.jpg" alt=""><br>
            <div class = "lijeviPodaci">
                <p>Naziv nekretnine:</p>
                <p>${item.naziv}</p> 
            </div><br>
            <div class = "lijeviPodaci">
                <p>Kvadratura:</p>
                <p>${item.kvadratura}</p>
                <p>km^2</p>
                <div id = "klikovi-idNekretnine">
                </div>
            </div><br>
            <div class = "desniPodaci">
                <p class = "paragrafiDesni">Cijena:</p>
                <p class = "paragrafiDesni">${item.cijena}</p>
                <p class = "paragrafiDesni">KM</p>
                <div id = "pretrage-idNekretnine" class = "paragrafiDesni">
                </div>
            </div>
            <div class = "lokacija"></div>
            <div class = "godinaIzgradnje"></div><br>
            <button nekretninaId=${item.id} class = "dugme-detalji" type="button">Detalji</button>
            </div><br>
        </div>`});
    // iscrtavanje elemenata u divReferenca element

    //dodatak u vezi dugmadi i dodatnih informacija o nekretninama
    divReferenca.addEventListener('click', function(event) {
        // Check if the clicked element is a dugme-detalji button
        if (event.target.classList.contains('dugme-detalji')) {
            // Handle the click event for dugme-detalji
            //const parentDiv = event.target.parentNode; // Get the parent grid-item
            const button = document.querySelector('.dugme-detalji')
            const selectedNekretninaId = button.getAttribute('nekretninaId');
            console.log(selectedNekretninaId);
            console.log('button', button);
                // Fetch details for the selected nekretninaId using Ajax
                PoziviAjax.getNekretninaById(selectedNekretninaId, function (err, nekretnina) {
                    if (err) {
                    console.error(err);
                    // Handle error, e.g., display an error message on the page
                    } else {
                    var nekretnina1 = JSON.parse(nekretnina);
                    const lokacijaElement = document.querySelector('.lokacija');
                    const godinaIzgradnjeElement = document.querySelector('.godinaIzgradnje');

                    console.log('nekretnina sa nekretnine.js kad se klikne na detalji:', nekretnina1.lokacija);
                    // Update HTML with nekretnina details
                    lokacijaElement.textContent = `Lokacija: ${nekretnina1.lokacija || 'N/A'}`;
                    godinaIzgradnjeElement.textContent = `Godina izgradnje: ${nekretnina1.godina_izgradnje}`;

                    // Replace "Detalji" button with "Otvori detalje" button
                    const otvoriDetaljeButton = document.createElement('button');
                    otvoriDetaljeButton.className = 'dugme-otvori';
                    otvoriDetaljeButton.textContent = 'Otvori detalje';
                    otvoriDetaljeButton.dataset.nekretninaId = selectedNekretninaId;

                    button.parentElement.replaceChild(otvoriDetaljeButton, button);

                    // Add event listener for the new "Otvori detalje" button
                    otvoriDetaljeButton.addEventListener('click', () => {
                        // Redirect to detalji.html and pass the selectedNekretninaId
                        window.location.href = `detalji.html?id=${selectedNekretninaId}`;
                    });
                    }
                });
            }
            });

        }
//function ucitajStanicuNekretnine () {
    document.addEventListener('DOMContentLoaded', async function () {

                const searchBtn = document.getElementById('searchBtn');
                searchBtn.addEventListener('click', async function () {
                PoziviAjax.getNekretnine(function (err, data) {
                    // Get values from input fields
                    let minPrice = document.getElementById('minPrice').value;
                    let maxPrice = document.getElementById('maxPrice').value;
                    let minSquare = document.getElementById('minSquare').value;
                    let maxSquare = document.getElementById('maxSquare').value;
                    console.log('max-square=', maxSquare);
                    
                    if (!minPrice) minPrice = null;
                    if (!maxPrice) maxPrice = null;
                    if (!minSquare) minSquare = null;
                    if (!maxSquare) maxSquare = null;

                    // Update the UI or perform other actions with the filtered data
                    //
                    var listaNekretnina = JSON.parse(data);
                    let nekretnine = SpisakNekretnina();
                    nekretnine.init(listaNekretnina, null);
                    let kriterij = {min_kvadratura: minSquare, max_kvadratura: maxSquare, min_cijena: minPrice, max_cijena: maxPrice};
                    let filtriraneNek = nekretnine.filtrirajNekretnine(kriterij);
                    //SaljemoFiltrirane
                    let nekretnine2 = SpisakNekretnina();
                    nekretnine2.init(filtriraneNek, null);
                    const divStan = document.querySelector('#stan');
                    const divKuca = document.querySelector('#kuca');
                    const divPp = document.querySelector('#pp');

                    if (minPrice == null && maxPrice == null && minSquare == null && maxSquare == null)
                        nekretnine2 = nekretnine;
                    //pozivanje funkcije
                    spojiNekretnine(divStan, nekretnine2, "Stan");
                    spojiNekretnine(divKuca, nekretnine2, "Kuća");
                    spojiNekretnine(divPp, nekretnine2, "Poslovni prostor");
                    if (err) {
                        console.log(err);
                    }
                });
            });

            
            });
