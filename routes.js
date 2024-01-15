const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('./db.js');

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
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database
    const userFound = await db.korisnik.findOne({ where: { username } });

    if (userFound) {
      // Compare passwords using bcrypt
      const validPassword = await bcrypt.compare(password, userFound.password);

      if (validPassword) {
        req.session.username = username;
        res.status(200).json({ poruka: 'Uspješna prijava' });
      } else {
        res.status(401).json({ poruka: 'Neuspješna prijava' });
      }
    } else {
      res.status(401).json({ poruka: 'Neuspješna prijava' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ poruka: 'Internal Server Error' });
  }
});

// Route: /logout
router.post('/logout', isAuthenticated, (req, res) => {
  req.session.destroy();
  res.status(200).json({ poruka: 'Uspješno ste se odjavili' });
});

// Route: /korisnik
router.get('/korisnik', isAuthenticated, async (req, res) => {
  const username = req.session.username;

  try {
    // Find the user in the database
    const user = await db.korisnik.findOne({ where: { username } });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ greska: 'Neautorizovan pristup' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ poruka: 'Internal Server Error' });
  }
});

// Route: /upit
router.post('/upit', isAuthenticated, async (req, res) => {
  // Check if user is authenticated
  if (!req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  const nekretninaId = req.body.nekretnina_id;
  const tekstUpita = req.body.tekst_upita;

  try {
    // Find the property with the given ID in the database
    const nekretnina = await db.nekretnina.findByPk(nekretninaId);

    if (!nekretnina) {
      res.status(400).json({ greska: `Nekretnina sa id-em ${nekretninaId} ne postoji` });
    } else {
      // Assuming there's an Upit model and an association between Nekretnina and Upit
      const user = await db.korisnik.findOne({ where: { username: req.session.username } });
      if (!user) {
        return res.status(401).json({ greska: 'Korisnik nije pronađen' });
      }

      const upit = await db.upit.create({
        korisnik_id: user.id,
        tekst_upita: tekstUpita,
        nekretnina_id: nekretnina.id
      });

      res.status(200).json({ poruka: 'Upit je uspješno dodan', upit });
    }
  } catch (error) {
    console.error('Error processing upit:', error);
    res.status(500).json({ greska: 'Internal server error' });
  }
});

// Route: /korisnik
router.put('/korisnik', isAuthenticated, async (req, res) => {
  const { id, ime, prezime, username, password } = req.body;

  if (!req.session.username) {
    return res.status(401).json({ greska: 'Neautorizovan pristup' });
  }

  try {
    // Find the user who is logged in based on the session username
    const loggedInUser = await db.korisnik.findOne({ where: { username: req.session.username } });

    if (!loggedInUser) {
      return res.status(404).json({ greska: 'Korisnik nije pronađen' });
    }

    // Update user attributes if provided
    if (id) loggedInUser.id = id;
    if (ime) loggedInUser.ime = ime;
    if (prezime) loggedInUser.prezime = prezime;
    if (username) loggedInUser.username = username;
    if (password) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      loggedInUser.password = hashedPassword;
    }

    // Save the updated user to the database
    await loggedInUser.save();

    res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ greska: 'Internal server error' });
  }
});
// Route: /nekretnine
router.get('/nekretnine', async (req, res) => {
  try {
    // Fetch all nekretnine from the database
    const nekretnine = await db.nekretnina.findAll();

    res.status(200).json(nekretnine);
  } catch (error) {
    console.error('Error fetching nekretnine from the database:', error);
    res.status(500).json({ greska: 'Internal server error' });
  }
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


//RUTA SA SPIRALE 4
//Ruta za dobavljanje jedne nekrentine
router.get('/nekretnina/:id', async (req, res) => {
  const nekretninaId = req.params.id;

  try {
    // Find the nekretnina by ID in the database
    //var nekretnina = await db.nekretnina.findByPk(nekretninaId);
    const nekretninaWithUpiti = await db.nekretnina.findByPk(nekretninaId, {
      include: [
        {
          model: db.upit,
          as: 'upiti',
          include: {
            model: db.korisnik, // Assuming the model for korisnik is db.korisnik
            as: 'korisnik',
          },
        },
      ],
    });
    if (!nekretninaWithUpiti) {
      return res.status(400).json({ greska: `Nekretnina sa id-em ${nekretninaId} ne postoji` });
    }

    // If nekretnina is found, return its data in JSON format
    res.status(200).json(nekretninaWithUpiti);
  } catch (error) {
    console.error('Error fetching nekretnina from the database:', error);
    res.status(500).json({ greska: 'Internal server error' });
  }
});


//export router
module.exports = router;
