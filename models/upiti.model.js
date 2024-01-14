// upit.js
const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Upit = sequelize.define("upit", {
        korisnik_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tekst_upita: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nekretnina_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    return Upit;
};
