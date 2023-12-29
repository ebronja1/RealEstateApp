let SpisakNekretnina = function () {
    //privatni atributi modula
    let listaNekretnina = [];
    let listaKorisnika = [];


    //implementacija metoda
    let init = function (listaNekretnina1, listaKorisnika1) {
        listaNekretnina = listaNekretnina1;
        listaKorisnika = listaKorisnika1;
    }

    let filtrirajNekretnine = function (kriterij) {
        var filtriranaListaNekretnina = listaNekretnina;
        if ('tip_nekretnine' in kriterij) {
           console.log("1"); 
            let value1 = kriterij.tip_nekretnine
            console.log("value1=" + value1);
            filtriranaListaNekretnina = filtriranaListaNekretnina.filter(value => value.tip_nekretnine === value1);

        }
        if ('min_kvadratura' in kriterij) {
            console.log("2");
            let value1 = kriterij.min_kvadratura;
            filtriranaListaNekretnina = filtriranaListaNekretnina.filter(value => value.kvadratura >= value1);
        }
        if ('max_kvadratura' in kriterij) {
            console.log("3");
            let value1 = kriterij.max_kvadratura;
            filtriranaListaNekretnina = filtriranaListaNekretnina.filter(value => value.kvadratura <= value1);
        }
        if ('min_cijena' in kriterij) {
            console.log("4");
            let value1 = kriterij.min_cijena;
            filtriranaListaNekretnina = filtriranaListaNekretnina.filter(value => value.cijena >= value1);
        }
        if ('max_cijena' in kriterij) {
            console.log("5");
            let value1 = kriterij.max_cijena;
            filtriranaListaNekretnina = filtriranaListaNekretnina.filter(value => value.cijena <= value1);
        }
        return filtriranaListaNekretnina;
    }

    let ucitajDetaljeNekretnine = function (id) {
        // dodajte kod
        var nekretnina = listaNekretnina.find(item => item.id == id);
        return nekretnina;        
    }


    return {
        init: init,
        filtrirajNekretnine: filtrirajNekretnine,
        ucitajDetaljeNekretnine: ucitajDetaljeNekretnine
    }
};