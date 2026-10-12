// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// 1. EĞER BULUT VERİTABANI VARSA (Render / Neon - Canlı Ortam)
if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Neon SSL sertifikasını onaylamak için
            }
        },
        logging: false
    });
} else {
    // 2. YEREL ORTAM (Docker / Localhost)
    sequelize = new Sequelize(
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
}

// Bağlantıyı test eden fonksiyon
const veritabaniniBagla = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL Veritabanı bağlantısı başarıyla kuruldu.');
    } catch (hata) {
        console.error('❌ Veritabanı bağlantı hatası:', hata);
    }
};

veritabaniniBagla();

module.exports = sequelize;
