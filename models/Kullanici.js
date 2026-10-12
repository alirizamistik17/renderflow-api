// models/Kullanici.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Veritabanı bağlantı havuzumuz

// 'Kullanici' tablomuzun şablonunu tanımlıyoruz
const Kullanici = sequelize.define('Kullanici', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    eposta: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Aynı e-posta adresiyle ikinci kez kayıt olunamaz!
        validate: {
            isEmail: true // Sequelize e-posta formatında olup olmadığını kontrol eder
        }
    },
    sifre: {
        type: DataTypes.STRING,
        allowNull: false // Şifre boş geçilemez (burada hashlenmiş halini tutacağız)
    }
}, {
    freezeTableName: true, // Tablo adı 'Kullanicis' olmasın, 'Kullanici' kalsın
    timestamps: true       // Ne zaman üye oldu bilgisini otomatik tutar
});

module.exports = Kullanici;