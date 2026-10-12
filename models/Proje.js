// models/Proje.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Az önce kurduğumuz bağlantı kablosu

// .define() metodu ile 'Proje' adında bir tablo şeması oluşturuyoruz
const Proje = sequelize.define('Proje', {
    // ID sütununu otomatik artacak şekilde tanımlıyoruz
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Proje adı zorunlu (allowNull: false) bir metin kutusudur
    ad: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    platform: {
        type: DataTypes.STRING,
        defaultValue: 'Web' // Veri girilmezse varsayılan olarak 'Web' ata
    },
    tamamlandi: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    // Tablo isimlerinin sonuna otomatik 's' takısı eklemesini kapatıyoruz (Projeler yerine Projes yapmasın diye)
    freezeTableName: true,
    // Eklenme ve güncellenme tarihlerini otomatik tutan createdAt/updatedAt sütunlarını aktifleştiriyoruz
    timestamps: true 
});

module.exports = Proje;