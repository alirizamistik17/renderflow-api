# RenderFlow API

RenderFlow backend RESTful API servisi. Express.js, PostgreSQL ve Sequelize ORM kullanılarak geliştirilmiş; JWT kimlik doğrulama ve Jest entegrasyon testlerini içeren güvenli bir backend mimarisidir.

## 🚀 Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env.example` dosyasını kopyalayarak `.env` dosyanızı oluşturun ve veritabanı bilgilerinizi girin:
```bash
cp .env.example .env
```

3. Geliştirici modunda başlatın:
```bash
npm run dev
```

4. Testleri çalıştırın:
```bash
npm test
```

## 🛠 Kullanılan Teknolojiler
- **Node.js & Express.js** - RESTful API mimarisi
- **PostgreSQL & Sequelize** - İlişkisel Veritabanı ve ORM
- **JWT (JSON Web Token) & bcryptjs** - Güvenlik, şifreleme ve kimlik doğrulama
- **Jest & Supertest** - Entegrasyon ve birim testleri
