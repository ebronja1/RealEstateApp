
function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    // pozivanje metode za filtriranje
    filtriranaListaStanova = instancaModula.filtrirajNekretnine({ tip_nekretnine:  tip_nekretnine});
    var tempElement;
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

const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

const listaNekretnina = [{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 2,
    tip_nekretnine: "Poslovni prostor",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
}]

const listaKorisnika = [{
    id: 1,
    ime: "Neko",
    prezime: "Nekic",
    username: "username1",
},
{
    id: 2,
    ime: "Neko2",
    prezime: "Nekic2",
    username: "username2",
}]

//instanciranje modula
let nekretnine = SpisakNekretnina();
nekretnine.init(listaNekretnina, listaKorisnika);

//pozivanje funkcije
spojiNekretnine(divStan, nekretnine, "Stan");
spojiNekretnine(divKuca, nekretnine, "Kuća");
spojiNekretnine(divPp, nekretnine, "Poslovni prostor");