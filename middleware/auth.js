// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. İstek başlığından (Header) 'Authorization' değerini oku
    const authHeader = req.headers['authorization'];

    // Header genelde şu formatta gelir: "Bearer eyJhbGciOiJIUzI1Ni..."
    const token = authHeader && authHeader.split(' ')[1];

    // 2. Bilet hiç gönderilmemişse kapıyı kapat
    if (!token) {
        return res.status(401).json({ mesaj: "Erişim reddedildi. Bilet (Token) bulunamadı." });
    }

    try {
        // 3. Bileti gizli anahtarımızla doğrula
        const cozulmusVeri = jwt.verify(token, process.env.JWT_SECRET);
        
        // Biletin içindeki kullanıcı bilgilerini (id, eposta) isteğe ekle
        req.kullanici = cozulmusVeri;
        
        // Her şey yolunda, bir sonraki işleme geçmesine izin ver
        next();
    } catch (hata) {
        // Mühür bozulmuş veya süresi dolmuşsa
        return res.status(403).json({ mesaj: "Geçersiz veya süresi dolmuş token." });
    }
};