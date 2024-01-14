const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt24", "root", "password", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  port: 3306
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
//db.korisnik = sequelize.import(__dirname + '/models/korisnici.model.js');
//db.korisnik = sequelize.define('korisnik', require(__dirname + '/models/korisnici.model.js')(sequelize, Sequelize));
db.korisnik = require(__dirname + '/models/korisnici.model.js')(sequelize, Sequelize);
db.upit = require(__dirname + '/models/upiti.model.js')(sequelize, Sequelize);
db.nekretnina = require(__dirname + '/models/nekretnine.model.js')(sequelize, Sequelize);

//db.upit = sequelize.import(__dirname + '/upiti.model.js');
//db.nekretnina = sequelize.import(__dirname + '/models/nekretnine.model.js');

// Define associations
// Veza 1-n: Jedan korisnik može imati više upita
db.korisnik.hasMany(db.upit, { as: 'upiti', foreignKey: 'korisnik_id' });

// Veza n-1: Svaki upit pripada jednom korisniku
db.upit.belongsTo(db.korisnik, { foreignKey: 'korisnik_id', as: 'korisnik' });

// Veza n-1: Svaki upit se odnosi na jednu nekretninu
db.upit.belongsTo(db.nekretnina, { foreignKey: 'nekretnina_id', as: 'nekretnina' });

// Veza 1-n: Jedna nekretnina može imati više upita
db.nekretnina.hasMany(db.upit, { as: 'upiti', foreignKey: 'nekretnina_id' });

module.exports = db;
