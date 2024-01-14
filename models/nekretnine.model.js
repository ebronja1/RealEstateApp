// nekretnina.js
const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Nekretnina = sequelize.define("nekretnina", {
        tip_nekretnine: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        naziv: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        kvadratura: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cijena: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tip_grijanja: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lokacija: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        godina_izgradnje: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        datum_objave: {
            type: DataTypes.STRING, 
            allowNull: false,
        },
        opis: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
    });

    return Nekretnina;
};
