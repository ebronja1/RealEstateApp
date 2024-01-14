// korisnik.js
const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Korisnik = sequelize.define("korisnik", {
        ime: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prezime: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Korisnik;
};
