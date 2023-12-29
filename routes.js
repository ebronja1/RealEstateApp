const express = require('express');
const fs = require("fs");
const router = express.Router();


const usersData = require('./data/korisnici.json');
const propertiesData = require('./data/nekretnine.json');
const bcrypt = require('bcrypt');

// Middleware to check if the user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
};

/*let plainTextPassword = 'hashPassworda2';

bcrypt.hash(plainTextPassword, 10, function(err, hash) {
    if (err) {
        console.error('Error during password hashing:', err);
    } else {
        // hash password
        console.log('Hashed Password:', hash);
    }
});
*/

// Route: /login
router.post('/login', function(req,res){
  const { username, password } = req.body;
  fs.readFile('./data/korisnici.json', 'utf8',async (err, data) => {
      if (err) {
        console.error(err);
        return;
      }   
      try {
        const korisnici = JSON.parse(data);        
        var userFound = korisnici.find(korisnik => korisnik.username == username)
        var validPassword = false
        if(userFound)
        validPassword = await bcrypt.compare(password,userFound.password);
          if(validPassword){
              req.session.username = username;
              res.status(200).json({poruka:"Uspješna prijava"})
          }
          else {
              res.status(401).json({poruka:"Neuspješna prijava"})
          }
      } catch (error) {
        console.error('Error parsing JSON data: ', error);
      }
    });
});

// Route: /logout
router.post('/logout', isAuthenticated, (req, res) => {
  req.session.destroy();
  res.status(200).json({ poruka: 'Uspješno ste se odjavili' });
});

// Route: /korisnik
router.get('/korisnik', isAuthenticated, (req, res) => {
  const username = req.session.username;
  const user = usersData.find((u) => u.username === username);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
});

// Route: /upit
router.post('/upit', isAuthenticated, (req, res) => {
  let nekretnina_id = req.body.id;
  let tekst_upita = req.body.upiti[0].tekst_upita;
  console.log(nekretnina_id);
  console.log(tekst_upita);
  const user = usersData.find((u) => u.username === req.session.username);
  //let property = propertiesData.find((p) => p.id === nekretnina_id);
  //let jsonData = propertiesData;

  if (!property) {
    res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
  } else {
    property.push({ id_korisnika: user.id, tekst_upita });
    //const updatedJson = JSON.stringify(jsonData, null, 2);
    //fs.writeFile('./data/korisnici.json', updatedJson, 'utf8');
    res.status(200).json({ poruka: 'Upit je uspješno dodan' });
  }
});

// Route: /korisnik
router.put('/korisnik', isAuthenticated, (req, res) => {
  const { ime, prezime, username, password } = req.body;
  const loggedInUser = usersData.find((u) => u.username === req.session.username);

  if (loggedInUser) {
    if (ime) loggedInUser.ime = ime;
    if (prezime) loggedInUser.prezime = prezime;
    if (username) loggedInUser.username = username;
    if (password) loggedInUser.password = password;

    res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
  } else {
    res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
});

// Route: /nekretnine
router.get('/nekretnine', (req, res) => {
  res.status(200).json(propertiesData);
});

module.exports = router;
