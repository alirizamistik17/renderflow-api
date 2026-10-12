// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Veritabanı ve Modeller
const sequelize = require('./config/database');
const Proje = require('./models/Proje');
const Kullanici = require('./models/Kullanici');

// 2. Güvenlik Middleware (Kapı Görevlisi)
const authKontrol = require('./middleware/auth');

const app = express();

// 3. Global Middleware'ler
app.use(cors());        // React ve dış kaynaklardan gelen isteklere izin ver
app.use(express.json()); // Gelen JSON isteklerini ayrıştır

// ==========================================
// 🔐 KİMLİK DOĞRULAMA (AUTH) ROTALARI
// ==========================================

// 1. KAYIT OLMA (Register) -> POST /api/auth/kayit
app.post('/api/auth/kayit', async (req, res) => {
    try {
        const { eposta, sifre } = req.body;

        if (!eposta || !sifre) {
            return res.status(400).json({ mesaj: "Lütfen e-posta ve şifre giriniz." });
        }

        const mevcutKullanici = await Kullanici.findOne({ where: { eposta } });
        if (mevcutKullanici) {
            return res.status(400).json({ mesaj: "Bu e-posta adresi zaten kullanımda." });
        }

        // Şifreyi hashle
        const hashliSifre = await bcrypt.hash(sifre, 10);

        const yeniKullanici = await Kullanici.create({
            eposta,
            sifre: hashliSifre
        });

        res.status(201).json({
            mesaj: "Kullanıcı başarıyla kaydedildi.",
            kullanici: { id: yeniKullanici.id, eposta: yeniKullanici.eposta }
        });
    } catch (hata) {
        res.status(500).json({ mesaj: "Kayıt sırasında sunucu hatası oluştu.", hata: hata.message });
    }
});

// 2. GİRİŞ YAPMA (Login) -> POST /api/auth/giris
app.post('/api/auth/giris', async (req, res) => {
    try {
        const { eposta, sifre } = req.body;

        const kullanici = await Kullanici.findOne({ where: { eposta } });
        if (!kullanici) {
            return res.status(404).json({ mesaj: "Kullanıcı bulunamadı." });
        }

        const sifreDogruMu = await bcrypt.compare(sifre, kullanici.sifre);
        if (!sifreDogruMu) {
            return res.status(401).json({ mesaj: "Hatalı şifre girdiniz." });
        }

        // Bilet (JWT Token) üretimi
        const token = jwt.sign(
            { id: kullanici.id, eposta: kullanici.eposta },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            mesaj: "Giriş başarılı!",
            token
        });
    } catch (hata) {
        res.status(500).json({ mesaj: "Giriş sırasında hata oluştu.", hata: hata.message });
    }
});

// ==========================================
// 📂 PROJE (CRUD) ROTALARI
// ==========================================

// 1. GET (Tüm projeleri listele - Herkes görebilir)
app.get('/api/projeler', async (req, res) => {
    try {
        const projeler = await Proje.findAll();
        res.json(projeler);
    } catch (hata) {
        res.status(500).json({ mesaj: "Projeler getirilirken hata oluştu", hata: hata.message });
    }
});

// 2. POST (Yeni proje ekle - Korumalı)
app.post('/api/projeler', authKontrol, async (req, res) => {
    try {
        const { ad, platform } = req.body;
        const yeniProje = await Proje.create({ ad, platform });
        res.status(201).json(yeniProje);
    } catch (hata) {
        res.status(500).json({ mesaj: "Proje eklenirken hata oluştu", hata: hata.message });
    }
});

// 3. PUT (Proje güncelle - Korumalı)
app.put('/api/projeler/:id', authKontrol, async (req, res) => {
    try {
        const gelenId = req.params.id;
        await Proje.update(
            { tamamlandi: req.body.tamamlandi, platform: req.body.platform },
            { where: { id: gelenId } }
        );
        res.json({ mesaj: "Başarıyla güncellendi." });
    } catch (hata) {
        res.status(500).json({ mesaj: "Güncelleme sırasında hata oluştu", hata: hata.message });
    }
});

// 4. DELETE (Proje sil - Korumalı)
app.delete('/api/projeler/:id', authKontrol, async (req, res) => {
    try {
        await Proje.destroy({ where: { id: req.params.id } });
        res.json({ mesaj: "Proje silindi." });
    } catch (hata) {
        res.status(500).json({ mesaj: "Silme sırasında hata oluştu", hata: hata.message });
    }
});

// ==========================================
// 🚀 SUNUCU VE VERİTABANI BAŞLATMA
// ==========================================
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
sequelize.sync().then(() => {
    console.log("✅ Tablolar veritabanı ile senkronize edildi.");
    app.listen(PORT, () => {
        console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
    });
}).catch(err => {
    console.error("❌ Veritabanı senkronizasyon hatası:", err);
});
}
module.exports = app;