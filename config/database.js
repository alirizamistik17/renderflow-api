// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Şifreleri okumak için .env dosyasını çağırıyoruz

// Sequelize nesnesi üretiyoruz. 
// Parametreler sırasıyla: Veritabanı Adı, Kullanıcı Adı, Şifre ve Ayarlar Objesi
const sequelize = new Sequelize(
    process.env.DB_NAME || 'renderflow_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || process.env.DB_PASSWORD || '12345',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        port: process.env.DB_PORT || 5433,
        logging: false
    }
);

// Bağlantıyı test eden bir asenkron fonksiyon
const veritabaniniBagla = async () => {
    try {
        await sequelize.authenticate(); // Veritabanının kapısını çalar
        console.log('✅ PostgreSQL Veritabanı bağlantısı başarıyla kuruldu.');
    } catch (hata) {
        console.error('❌ Veritabanı bağlantı hatası:', hata);
    }
};

veritabaniniBagla();

// Bu bağlantı motorunu diğer dosyalarda (modellerde) kullanabilmek için dışarı aktarıyoruz
module.exports = sequelize;