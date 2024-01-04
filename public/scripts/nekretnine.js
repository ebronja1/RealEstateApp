
function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    // pozivanje metode za filtriranje
    filtriranaListaStanova = instancaModula.filtrirajNekretnine({ tip_nekretnine:  tip_nekretnine});

    filtriranaListaStanova.forEach((item) => {
        var pomocna = item.tip_nekretnine.toLowerCase();
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
            </div><br>
            <button class = "dugme" type="button">Detalji</button>
        </div>`});
    // iscrtavanje elemenata u divReferenca element

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

        /*
        //Filtriranje
        const searchBtn = document.getElementById('searchBtn');
        searchBtn.addEventListener('click', function () {
        // Get values from input fields
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        const minSquare = document.getElementById('minSquare').value;
        const maxSquare = document.getElementById('maxSquare').value;

        // Call the filtrirajNekretnine method with search criteria
        const nekretnine = SpisakNekretnina();
        nekretnine.filtrirajNekretnine({ minPrice, maxPrice, minSquare, maxSquare });

        // Update the UI or perform other actions with the filtered data
        
    });*/

//}