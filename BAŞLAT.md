# Paragliding Ölüdeniz — Proje Rehberi

## Lokal Geliştirme

### 1. Terminali aç, projeye gel:
```
cd "D:\claude projekt\oludeniz project"
```

### 2. Bağımlılıkları yükle (ilk seferde):
```
npm install
```

### 3. Geliştirme sunucusunu başlat:
```
npm run dev
```

### 4. Tarayıcıda aç:
```
http://localhost:3000
```

---

## GitHub'a Push

### Yeni repo oluştur:
1. https://github.com/new adresine git
2. Repository name: `paragliding-oludeniz`
3. **Private** seç
4. "Create repository" tıkla

### İlk push:
```bash
git init
git add .
git commit -m "Initial commit — full site"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/paragliding-oludeniz.git
git push -u origin main
```

> ⚠️ `KULLANICI_ADIN` yerine kendi GitHub kullanıcı adını yaz

---

## Vercel Deploy (Ücretsiz)

### Adım 1 — Vercel hesabı
https://vercel.com adresinde **GitHub ile** kayıt ol (ücretsiz).

### Adım 2 — Projeyi import et
1. https://vercel.com/new adresine git
2. GitHub reposunu bul → **"Import"** tıkla
3. Framework olarak **Next.js** otomatik seçilir

### Adım 3 — Environment Variable ekle
"Environment Variables" bölümüne şunu ekle:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://paragliding-oludeniz.com` |

> Domain'in hazır değilse şimdilik boş bırakabilirsin, sonra eklersin.

### Adım 4 — Deploy et
**"Deploy"** butonuna bas. ~2 dakika bekle.

✅ Site yayında! Vercel sana bir URL verir: `https://paragliding-oludeniz.vercel.app`

---

## Domain Bağlama (Opsiyonel)

Eğer `paragliding-oludeniz.com` gibi bir domain varsa:

1. Vercel Dashboard → Projen → **Settings → Domains**
2. Domain adını yaz → **Add**
3. Domain kayıt firmanın (GoDaddy, Namecheap vb.) DNS panelinde:
   - **A kaydı:** `76.76.21.21`
   - **CNAME:** `cname.vercel-dns.com`
4. Birkaç dakika/saat içinde aktif olur.
5. SSL sertifikası Vercel tarafından **otomatik** verilir.

---

## Her Güncelleme Sonrası

Kod değiştirince:
```bash
git add .
git commit -m "güncelleme açıklaması"
git push
```
Vercel otomatik olarak yeni versiyonu deploy eder. ✨

---

## Önemli Bilgiler

- **Tel:** +90 536 461 6674
- **Email:** info@paragliding-oludeniz.com
- **Framework:** Next.js 14 (App Router)
- **Stil:** Tailwind CSS
- **Deploy:** Vercel (ücretsiz plan yeterli)
- **Sitemap:** Build sırasında otomatik üretilir (`npm run build`)
