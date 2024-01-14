const db = require('./db.js');
db.sequelize.sync({ force: false }).then(function () {
    inicializacija().then(function () {
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});

function inicializacija() {
    var korisnik1, korisnik2;
    var korisniciPromiseList = [];
    var upitiPromiseList = [];
    var nekretninePromiseList = [];

    return new Promise(function (resolve, reject) {
        korisniciPromiseList.push(db.korisnik.create({
            ime: 'Neko3',
            prezime: 'Nekic3',
            username: 'username3',
            password: '$2b$10$5R7uvOmugk8K2gek3m5YWOXbZeoUyy3mI8YvKIEojP.Z5PX1g3nuq'
        }));
        korisniciPromiseList.push(db.korisnik.create({
            ime: 'Neko2',
            prezime: 'Nekic2',
            username: 'username2',
            password: '$2b$10$yKewGxlD8LEmHoTiC.6oceK0TdFGQX09vi9jQcNEZolB64UJk0uTS'
        }));

        Promise.all(korisniciPromiseList).then(function (korisnici) {
            korisnik1 = korisnici.find(k => k.username === 'username3');
            korisnik2 = korisnici.find(k => k.username === 'username2');

            nekretninePromiseList.push(db.nekretnina.create({
                tip_nekretnine: 'Stan',
                naziv: 'Useljiv stan Sarajevo',
                kvadratura: 58,
                cijena: 232000,
                tip_grijanja: 'plin',
                lokacija: 'Novo Sarajevo',
                godina_izgradnje: 2019,
                datum_objave: '01.10.2023.',
                opis: 'Sociis natoque penatibus.'
            }).then(function (nekretnina) {
                upitiPromiseList.push(db.upit.create({
                    korisnik_id: korisnik1.id,
                    tekst_upita: 'kakakoakoakao koakaokoak hshshshs bbb',
                    nekretnina_id: nekretnina.id
                }));

                upitiPromiseList.push(db.upit.create({
                    korisnik_id: korisnik2.id,
                    tekst_upita: 'kakakoakoakao koakaokoak hshshshs bbb11',
                    nekretnina_id: nekretnina.id
                }));

                return new Promise(function (resolve, reject) {
                    resolve(nekretnina);
                });
            }));

            nekretninePromiseList.push(db.nekretnina.create({
                tip_nekretnine: 'Poslovni prostor',
                naziv: 'Mali poslovni prostor',
                kvadratura: 20,
                cijena: 70000,
                tip_grijanja: 'struja',
                lokacija: 'Centar',
                godina_izgradnje: 2005,
                datum_objave: '20.08.2023.',
                opis: 'Magnis dis parturient montes.'
            }).then(function (nekretnina) {
                upitiPromiseList.push(db.upit.create({
                    korisnik_id: korisnik2.id,
                    tekst_upita: 'kakakoakoakao koakaokoak hshshshs bbb',
                    nekretnina_id: nekretnina.id
                }));

                upitiPromiseList.push(db.upit.create({
                    klikovi: 101,
                    pretrage: 22,
                    korisnik_id: korisnik1.id,
                    nekretnina_id: nekretnina.id
                }));

                return new Promise(function (resolve, reject) {
                    resolve(nekretnina);
                });
            }));

            Promise.all(nekretninePromiseList).then(function (nekretnine) {
                resolve(nekretnine);
            }).catch(function (err) {
                console.log("Nekretnine greska " + err);
            });
        }).catch(function (err) {
            console.log("Korisnici greska " + err);
        });
    });
}

module.exports = inicializacija;