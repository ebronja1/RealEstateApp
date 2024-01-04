const express = require('express');
const router = express.Router();
const fs = require('fs');

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
        var userFound = korisnici.find(korisnik => korisnik.username == username);
        var validPassword = false;
        if(userFound)
        validPassword = await bcrypt.compare(password,userFound.password);
          if(validPassword){
              req.session.username = username;
              res.status(200);
              res.json({poruka:"Uspješna prijava"});
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
  // Check if user is authenticated
  if (!req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }
  let nekretnina_id = req.body.id;
  let tekst_upita = req.body.upiti[0].tekst_upita;
  console.log(nekretnina_id);
  console.log(tekst_upita);

  // Read the content of nekretnine.json
  fs.readFile('./data/nekretnine.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading nekretnine.json:', err);
      res.status(500).json({ greska: 'Internal server error' });
      return;
    }

    try {
      // Parse the JSON data
      const jsonData = JSON.parse(data);

      // Find the property with the given ID
      const property = jsonData.find((p) => p.id === nekretnina_id);

      if (!property) {
        res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
      } else {
        // Add the new data to the property
        property.upiti.push({ korisnik_id: user.id, tekst_upita });

        // Convert the updated JSON data to a string
        const updatedJson = JSON.stringify(jsonData, null, 2);

        // Write the updated data back to nekretnine.json
        fs.writeFile('./data/nekretnine.json', updatedJson, 'utf8', (err) => {
          if (err) {
            console.error('Error writing to nekretnine.json:', err);
            res.status(500).json({ greska: 'Internal server error' });
          } else {
            res.status(200).json({ poruka: 'Upit je uspješno dodan' });
          }
        });
      }
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ greska: 'Internal server error' });
    }
  });
});

// Route: /korisnik
router.put('/korisnik', isAuthenticated, (req, res) => {
  const { id, ime, prezime, username, password } = req.body;
  if (!req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

    // Read the content of korisnici.json
    fs.readFile('./data/korisnici.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading korisnici.json:', err);
        res.status(500).json({ greska: 'Internal server error' });
        return;
      }

      try {
        // Parse the JSON data
        const jsonData = JSON.parse(data);
        
        //Find user who is logged in
        let loggedInUser = jsonData.find((u) => u.username === req.session.username);
        const userIndex = jsonData.findIndex((u) => u.id === loggedInUser.id);

        if (id) loggedInUser.id = id;
        if (ime) loggedInUser.ime = ime;
        if (prezime) loggedInUser.prezime = prezime;
        if (username) loggedInUser.username = username;
        if (password) loggedInUser.password = password;

        if (userIndex !== -1) {

          bcrypt.hash(password, 10, function(err, hash) {
            // hash šifre imate ovdje
             if (err) {
              console.log('err');
             }
             console.log(hash);
             loggedInUser.password = hash;
              // Update the user in the array
              jsonData[userIndex] = loggedInUser;
              // Write the updated data back to korisnici.json
              const updatedJson = JSON.stringify(jsonData, null, 2);
              fs.writeFile('./data/korisnici.json', updatedJson, 'utf8', (err) => {

                if (err) {
                  console.error('Error writing to korisnici.json:', err);
                  res.status(500).json({ greska: 'Internal server error' });
                } else {
                  res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
                }
              });
            });
            
            
        } else {
          res.status(404).json({ greska: 'Korisnik nije pronađen' });
        }
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        res.status(500).json({ greska: 'Internal server error' });
      }
    });
});

// Route: /nekretnine
router.get('/nekretnine', (req, res) => {
  fs.readFile('./data/nekretnine.json', 'utf8',async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }   
    const nekretnine = JSON.parse(data);        
    res.status(200).json(nekretnine);
  });
});

//ISPOD SU RUTE ZA 3. ZADATAK:


// Ruta za praćenje filtriranja nekretnina
router.post('/marketing/nekretnine', (req, res) => {
  const { nizNekretnina } = req.body;

  console.log('Filtrirane nekretnine:', nizNekretnina);
  //
  fs.readFile('./data/pretrage.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading pretrage.json:', err);
      res.status(500).json({ greska: 'Internal server error' });
      return;
    }

      // Parse the JSON data
      const jsonData = JSON.parse(data);

      // Find the property with the given ID
      // Update "pretrage" values based on the IDs provided in the request body
      jsonData.forEach((item) => {
        if (nizNekretnina.includes(item.id)) {
        item.pretrage += 1; // You can adjust this logic based on your requirements
        }
      });

        // Convert the updated JSON data to a string
      const updatedJson = JSON.stringify(jsonData, null, 2);
      
      // Write the updated data back to nekretnine.json
      fs.writeFile('./data/pretrage.json', updatedJson, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to pretrage.json:', err);
          res.status(500).json({ greska: 'Internal server error' });
        } else {
          res.status(200).json({ poruka: 'Uspjesno azurirani podaci o pretragama' });
        }
      });
    });
});

//Ruta za klikove
router.post('/marketing/nekretnine/:id', (req, res) => {
  const nekretninaId = req.params.id;

  console.log('Kliknuta nekretnina sa id:', nekretninaId);
  //
  fs.readFile('./data/pretrage.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading pretrage.json:', err);
      res.status(500).json({ greska: 'Internal server error' });
      return;
    }

      // Parse the JSON data
      const jsonData = JSON.parse(data);

      // Find the property with the given ID
      // Update "pretrage" values based on the IDs provided in the request body
      jsonData.forEach((item) => {
        if (item.id == nekretninaId ) {
        item.klikovi += 1; // You can adjust this logic based on your requirements
        }
      });

        // Convert the updated JSON data to a string
      const updatedJson = JSON.stringify(jsonData, null, 2);
      
      // Write the updated data back to nekretnine.json
      fs.writeFile('./data/pretrage.json', updatedJson, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to pretrage.json:', err);
          res.status(500).json({ greska: 'Internal server error' });
        } else {
          res.status(200).json({ poruka: 'Uspjesno azurirani podaci o klikovima' });
        }
      });
    });
});

//Ruta osvjezi
// Ruta za praćenje filtriranja nekretnina
router.post('/marketing/osvjezi', (req, res) => {
  const nizNekretnina = req.body.nizNekretnina;

  console.log('Filtrirane nekretnine:', nizNekretnina);
  //
  fs.readFile('./data/pretrage.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading pretrage.json:', err);
      res.status(500).json({ greska: 'Internal server error' });
      return;
    }

      // Parse the JSON data
      let jsonData = JSON.parse(data);

      // Find the property with the given ID
      // Update "pretrage" values based on the IDs provided in the request body
      if(nizNekretnina) {
        // Use the filter method to filter the original array
        jsonData = jsonData.filter(item => nizNekretnina.includes(item.id));
      }
        // Convert the updated JSON data to a string
      const updatedJson = JSON.stringify(jsonData, null, 2);
              
      res.status(200).json(updatedJson);
    });
});


//export router
module.exports = router;
