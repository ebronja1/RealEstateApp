
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
            </div><br>
            <div class = "desniPodaci">
                <p class = "paragrafiDesni">Cijena:</p>
                <p class = "paragrafiDesni">${item.cijena}</p>
                <p class = "paragrafiDesni">KM</p>
            </div><br>
            <button class = "dugme" type="button">Detalji</button>
        </div>`});
    // iscrtavanje elemenata u divReferenca element

}
//function ucitajStanicuNekretnine () {
    document.addEventListener('DOMContentLoaded', async function () {

        const nekretnineLink = document.querySelector('nekretnine.html');

                PoziviAjax.getNekretnine(function (err, data) {
                    var listaNekretnina = JSON.parse(data);
                        let nekretnine = SpisakNekretnina();
                        nekretnine.init(listaNekretnina, null);
                        const divStan = document.querySelector('#stan');
                        const divKuca = document.querySelector('#kuca');
                        const divPp = document.querySelector('#pp');

                        //pozivanje funkcije
                        spojiNekretnine(divStan, nekretnine, "Stan");
                        spojiNekretnine(divKuca, nekretnine, "Kuća");
                        spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
                        if (err) {
                            console.log(err);
                        }
                });
            });

//}