// tests/api.test.js
const sequelize = require('../config/database');
const request = require('supertest');
const app = require('../server');

describe('Sistem ve Güvenlik Entegrasyon Testleri', () => {
  let authToken = '';
  let olusturulanProjeId = null;
  const benzersizEposta = `test_${Date.now()}@ornek.com`; // Her testte çakışmayı önlemek için dinamik e-posta

  // ==========================================
  // 1. NEGATİF TESTLER (HATA YÖNETİMİ)
  // ==========================================
  it('Eksik bilgiyle kayıt olmaya çalışıldığında 400 dönmeli', async () => {
    const res = await request(app)
      .post('/api/auth/kayit')
      .send({ eposta: 'eksik@ornek.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('mesaj', 'Lütfen e-posta ve şifre giriniz.');
  });

  it('Token olmadan proje eklenmeye çalışıldığında 401 dönmeli', async () => {
    const res = await request(app)
      .post('/api/projeler')
      .send({ ad: 'Yetkisiz Deneme', platform: 'Web' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('mesaj', 'Erişim reddedildi. Bilet (Token) bulunamadı.');
  });

  // ==========================================
  // 2. POZİTİF TESTLER (TAM KULLANICI DÖNGÜSÜ)
  // ==========================================
  
  // A) Kayıt Olma
  it('Yeni bir kullanıcı başarıyla kaydedilmeli (201)', async () => {
    const res = await request(app)
      .post('/api/auth/kayit')
      .send({
        eposta: benzersizEposta,
        sifre: 'guvenliSifre123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.kullanici).toHaveProperty('eposta', benzersizEposta);
  });

  // B) Giriş Yapma ve Token Alma
  it('Kayıtlı kullanıcı giriş yapabilmeli ve JWT token almalı (200)', async () => {
    const res = await request(app)
      .post('/api/auth/giris')
      .send({
        eposta: benzersizEposta,
        sifre: 'guvenliSifre123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    
    // Sonraki testlerde kullanmak üzere token'ı saklıyoruz
    authToken = res.body.token;
  });

  // C) Token ile Proje Ekleme
  it('Geçerli token ile yeni proje eklenebilmeli (201)', async () => {
    const res = await request(app)
      .post('/api/projeler')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        ad: 'Otomatik Test Projesi',
        platform: 'Web'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.ad).toBe('Otomatik Test Projesi');

    olusturulanProjeId = res.body.id;
  });

  // D) Projeyi Güncelleme
  it('Eklenen proje güncellenebilmeli (200)', async () => {
    const res = await request(app)
      .put(`/api/projeler/${olusturulanProjeId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        tamamlandi: true,
        platform: 'Web'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.mesaj).toBe('Başarıyla güncellendi.');
  });

  // E) Projeyi Silme
  it('Eklenen proje silinebilmeli (200)', async () => {
    const res = await request(app)
      .delete(`/api/projeler/${olusturulanProjeId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.mesaj).toBe('Proje silindi.');
  });

  // F) Herkese Açık Projeleri Listeleme
  it('Tüm projeleri listeleme rotası herkese açık olmalı (200)', async () => {
    const res = await request(app).get('/api/projeler');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  afterAll(async () => {
  await sequelize.close(); // Testler bitince veritabanı bağlantı havuzunu temiz bir şekilde kapat
});
});