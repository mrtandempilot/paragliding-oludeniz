# Ölüdeniz Paragliding — Kapsamlı Proje Raporu
**Tarih:** 23 Mayıs 2026  
**Proje Sahibi:** Ceyhun (mrtandempilot@gmail.com)  
**Domain:** paragliding-oludeniz.com

---

## 1. PROJE AMACI

Bu proje, Türkiye'nin Ölüdeniz bölgesinde tandem paragliding uçuşları sunan Ceyhun için inşa edilen bir **rezervasyon web uygulamasıdır**.

**Birincil hedef:** Google'da aşağıdaki anahtar kelimeler için **#1 sıraya çıkmak:**
- paragliding Oludeniz
- tandem paragliding Oludeniz
- paragliding Fethiye
- Babadağ paragliding
- Oludeniz paragliding booking

SEO, projedeki **her kararın üzerinde** yer alır. Hiçbir sayfa, bileşen veya içerik SEO etkisi düşünülmeden yapılmaz.

**Ne yapıyor:**
- Turistlerin Babadağ'dan tandem paragliding uçuşu hakkında bilgi edinmesi
- Online rezervasyon yapabilmesi
- Fotoğraf ve yorumları görmesi
- Ceyhun'un admin dashboard üzerinden tüm rezervasyonları yönetmesi

---

## 2. TEKNİK YAPI (TECH STACK)

| Teknoloji | Kullanım Amacı |
|-----------|---------------|
| Next.js 14 (App Router) | Ana framework |
| TypeScript | Programlama dili |
| Tailwind CSS | Stil sistemi |
| tailwind-merge + clsx | Class birleştirme (cn() fonksiyonu) |
| Supabase | Veritabanı ve kimlik doğrulama |
| Anthropic SDK (@anthropic-ai/sdk) | AI agent sistemi |
| Resend + Nodemailer | E-posta gönderimi |
| next-sitemap | Otomatik sitemap oluşturma |
| Lucide React | İkon kütüphanesi |
| Inter + Cal Sans | Fontlar |

---

## 3. MARKA VE TASARIM SİSTEMİ

### Renkler
| İsim | Hex Kodu | Kullanım |
|------|----------|---------|
| brand-orange | #f97316 | Ana buton, vurgu rengi |
| brand-blue | #0369a1 | İkincil vurgu |
| brand-dark | #0f172a | Koyu zemin |

### CSS Sınıfları (globals.css)
| Sınıf | Açıklama |
|-------|---------|
| `.btn-primary` | Turuncu dolgu buton, hover'da yukarı kayma efekti |
| `.btn-secondary` | Beyaz/border buton |
| `.btn-outline-white` | Beyaz çerçeveli buton (hero üzerinde) |
| `.card` | Beyaz, rounded-2xl, shadow-sm, border-slate-100 |
| `.section-padding` | py-16 md:py-24 |
| `.container-default` | max-w-7xl, ortalanmış, responsive padding |
| `.bg-hero` | Siyah gradient overlay (hero arka planı için) |

---

## 4. PROJE DOSYA YAPISI

```
oludeniz project/
├── app/
│   └── globals.css              ✅ Mevcut
├── components/
│   ├── home/
│   │   ├── Hero.tsx             ✅ Mevcut
│   │   ├── WhyOludeniz.tsx      ✅ Mevcut
│   │   ├── FlightTypesGrid.tsx  ✅ Mevcut
│   │   ├── BabadagIntro.tsx     ✅ Mevcut
│   │   └── ReviewsSection.tsx   ✅ Mevcut
│   └── shared/
│       ├── BreadcrumbNav.tsx    ✅ Mevcut
│       └── PageHero.tsx         ✅ Mevcut
├── lib/
│   └── utils.ts                 ✅ Mevcut
├── tailwind.config.ts           ✅ Mevcut
├── tsconfig.json                ✅ Mevcut
├── postcss.config.js            ✅ Mevcut
├── next-sitemap.config.js       ✅ Mevcut
└── node_modules/                ✅ Yüklü
```

---

## 5. YAPILAN BILEŞENLER — DETAYLI AÇIKLAMA

### 5.1 Hero.tsx (`components/home/Hero.tsx`)
Anasayfanın tam ekran giriş bölümü.

**İçerik:**
- Arka plan: Unsplash paragliding fotoğrafı (1920px)
- Badge: "World's Top Paragliding Destination · Babadağ 1960m"
- H1: **"Fly Over the Blue Lagoon of Ölüdeniz"** (turuncu vurgu ile)
- Açıklama metni: Babadağ'dan uçuş, turkuaz sular, Blue Lagoon
- CTA butonları:
  - "Book Your Flight" → `/book-now`
  - "Learn More" → `/tandem-paragliding`
- Güven sinyalleri: Sertifikalı & sigortalı, 4.9/5 puan (2400+ yorum), 25+ yıl deneyim
- Scroll indikatörü (animate-bounce)

**SEO Değeri:** H1 etiketi doğrudan ana keyword içeriyor. "Blue Lagoon", "Ölüdeniz" güçlü location sinyalleri.

---

### 5.2 WhyOludeniz.tsx (`components/home/WhyOludeniz.tsx`)
6 kartlık grid — Neden Ölüdeniz sorusunu yanıtlar.

**Kartlar:**
1. 🏔️ 1960m Launch Altitude — Babadağ dünyanın en yüksek tandem noktalarından biri
2. 💨 Perfect Flying Conditions — Yılda 300+ uçuş günü, mikro iklim
3. 📷 Iconic Scenery — Blue Lagoon, Butterfly Valley, Ege Denizi
4. 🏆 World Competition Venue — Yıllık Ölüdeniz Air Games, 60+ ülke
5. 👥 Expert Local Pilots — Sertifikalı, binlerce saat deneyim
6. 📍 Easy to Reach — Ölüdeniz sahilinden 15 dakika, teleferik

**SEO Değeri:** "Babadağ", "Ölüdeniz", "tandem paragliding", "Blue Lagoon" keywordleri doğal içerikte geçiyor.

---

### 5.3 FlightTypesGrid.tsx (`components/home/FlightTypesGrid.tsx`)
6 uçuş türü kartı — gradient üst, emoji, açıklama, link.

**Uçuş türleri:**
| Tür | Badge | Hedef URL |
|-----|-------|-----------|
| Tandem Paragliding | Most Popular | `/tandem-paragliding` |
| Sunset Flights | Premium | `/tandem-paragliding/sunset-flight` |
| Solo / XC Flying | Licensed Pilots | `/cross-country-flights` |
| Acro Paragliding | Advanced | `/acro-flights` |
| Paramotor | — | `/paramotor` |
| Group Flights | Group Discount | `/tandem-paragliding/group-flights` |

**SEO Değeri:** Her kart bir iç sayfa URL'sine bağlanıyor — Google'ın site yapısını anlamasına yardımcı olur. Long-tail keyword fırsatları (sunset paragliding, acro paragliding Oludeniz...).

---

### 5.4 BabadagIntro.tsx (`components/home/BabadagIntro.tsx`)
2 sütunlu bölüm — solda dağ fotoğrafı, sağda içerik.

**İstatistikler (büyük rakamlar):**
- 1960m — Summit Altitude
- 4 — Launch Points
- 300+ — Flying Days / Year
- 60+ — Countries Represented

**İçerik:** Babadağ hakkında 2 paragraf açıklama, teleferik bilgisi, CTA → `/babadag-guide`

**Floating badge:** Turuncu, sağ-altta, "1960m Above Sea Level"

**SEO Değeri:** "Babadağ" için güçlü içerik sinyali. Ayrı bir Babadağ kılavuz sayfasına iç link.

---

### 5.5 ReviewsSection.tsx (`components/home/ReviewsSection.tsx`)
6 müşteri yorumu — 5 yıldız, isim, ülke, tarih.

**Yorumlar:**
| İsim | Ülke | Tarih |
|------|------|-------|
| Sarah M. | 🇬🇧 United Kingdom | Mayıs 2025 |
| Klaus W. | 🇩🇪 Germany | Nisan 2025 |
| Priya K. | 🇮🇳 India | Haziran 2025 |
| Marco R. | 🇮🇹 Italy | Temmuz 2025 |
| Emma L. | 🇦🇺 Australia | Ağustos 2025 |
| James T. | 🇺🇸 United States | Mayıs 2025 |

**Genel puan:** 4.9 / 5 — 2400+ yorum  
**CTA:** "Read All Reviews" → `/reviews`

**SEO Değeri:** Sosyal kanıt. Farklı ülkelerden yorumlar, uluslararası kitleyi hedefliyor. "Blue Lagoon", "Babadağ", "1700m" keyword'leri yorum metinlerinde geçiyor.

---

### 5.6 BreadcrumbNav.tsx (`components/shared/BreadcrumbNav.tsx`)
Tüm iç sayfalarda kullanılacak breadcrumb navigasyon.

**Özellikler:**
- `items[]` array alır, otomatik olarak başa "Home" ekler
- Lucide `ChevronRight` + `Home` ikonları
- **Otomatik JSON-LD BreadcrumbList schema** üretir (SEO için kritik)
- Son item bold + koyu, öncekiler link olarak render edilir

**Kullanım:**
```tsx
<BreadcrumbNav items={[
  { label: "Tandem Paragliding", href: "/tandem-paragliding" },
  { label: "Sunset Flight" }
]} />
```

---

### 5.7 PageHero.tsx (`components/shared/PageHero.tsx`)
Tüm iç sayfalarda kullanılacak hero bölümü.

**Props:**
| Prop | Tip | Açıklama |
|------|-----|---------|
| title | string | H1 başlık (zorunlu) |
| subtitle | string? | Alt başlık |
| badge | string? | Turuncu badge (üst) |
| bgImage | string? | Arka plan URL (varsayılan: Babadağ) |
| size | sm/md/lg | Hero yüksekliği |

---

### 5.8 lib/utils.ts
Yardımcı fonksiyonlar:
- `cn(...inputs)` — clsx + tailwind-merge birleştirme
- `formatDate(date)` — "May 23, 2026" formatında tarih
- `slugify(text)` — "hello-world" formatında URL-safe metin
- `truncate(text, length)` — "..." ile kırpma

---

## 6. SİTEMAP KONFİGÜRASYONU (`next-sitemap.config.js`)

Domain: `https://paragliding-oludeniz.com`  
Robots.txt: Otomatik oluşturuluyor (API hariç her şey açık)

**URL Öncelikleri:**
| URL | Öncelik | Güncelleme |
|-----|---------|-----------|
| `/` (anasayfa) | 1.0 | Daily |
| `/tandem-paragliding` | 0.9 | Weekly |
| `/babadag-guide` | 0.9 | Weekly |
| `/book-now` | 0.9 | Weekly |
| `/prices` | 0.9 | Weekly |
| `/blog/*` | 0.7 | Monthly |
| Diğerleri | 0.6 | Weekly |

---

## 7. PLANLANMIŞ SAYFALAR (henüz yazılmamış)

Sitemap config'den çıkarılan tüm sayfalar:

| Sayfa | URL | Durum |
|-------|-----|-------|
| Anasayfa | `/` | ❌ Yok |
| Tandem Paragliding | `/tandem-paragliding` | ❌ Yok |
| Babadağ Rehberi | `/babadag-guide` | ❌ Yok |
| Rezervasyon | `/book-now` | ❌ Yok |
| Fiyatlar | `/prices` | ❌ Yok |
| Yorumlar | `/reviews` | ❌ Yok |
| Gün Batımı Uçuşu | `/tandem-paragliding/sunset-flight` | ❌ Yok |
| XC Uçuşları | `/cross-country-flights` | ❌ Yok |
| Acro Paragliding | `/acro-flights` | ❌ Yok |
| Paramotor | `/paramotor` | ❌ Yok |
| Grup Uçuşları | `/tandem-paragliding/group-flights` | ❌ Yok |
| Blog | `/blog/*` | ❌ Yok |

---

## 8. YAPILMAMIŞ / EKSİK OLAN HER ŞEY

### 8.1 Sayfalar
- `app/page.tsx` — Anasayfa (tüm home componentları buraya monte edilecek)
- `app/layout.tsx` — Root layout (metadata, font, global yapı)
- Tüm iç sayfalar (tandem, prices, book-now vs.)

### 8.2 Navigasyon & Footer
- Header / Navbar bileşeni yok
- Footer bileşeni yok
- Mobile menu yok

### 8.3 Rezervasyon Sistemi
- Rezervasyon formu yok
- Uçuş takvimi / tarih seçici yok
- Ödeme entegrasyonu yok
- Konfirmasyon e-postası yok

### 8.4 Admin Dashboard
- Ceyhun'un rezervasyonları göreceği panel yok
- Rezervasyon onaylama/iptal sistemi yok
- İçerik yönetimi yok

### 8.5 Supabase Entegrasyonu
- Veritabanı şeması tasarlanmadı
- Rezervasyon tablosu yok
- Kullanıcı/auth yapısı yok
- API route'ları yok

### 8.6 AI Agent Sistemi
- SEO agenti (planlandı, yazılmadı)
- Fotoğraf yönetim agenti (planlandı, yazılmadı)
- Anthropic SDK entegrasyonu kurulmadı

### 8.7 SEO Teknik Detaylar
- `robots.txt` henüz üretilmedi (build'de oluşacak)
- `sitemap.xml` henüz üretilmedi
- JSON-LD structured data (LocalBusiness, Activity, FAQ) yok
- Open Graph / Twitter Card meta tagları yok
- Google Analytics / Search Console bağlantısı yok

### 8.8 İçerik
- Gerçek fotoğraflar yok (şu an Unsplash placeholder)
- Blog yazıları yok
- Fiyat tablosu içeriği yok

---

## 9. ÖNERİLEN SIRADAKI ADIMLAR

### Öncelik 1 — Site Ayağa Kalkmalı
1. `app/layout.tsx` yaz — metadata, font, HTML yapısı
2. `app/page.tsx` yaz — tüm home componentlarını sırala
3. Header + Footer bileşenleri yaz
4. Siteyi `localhost:3000`'de çalıştır ve gör

### Öncelik 2 — Ana SEO Sayfaları
1. `/tandem-paragliding` sayfası — en önemli landing page
2. `/babadag-guide` sayfası — informational SEO içeriği
3. `/prices` sayfası
4. Her sayfada: title, description, JSON-LD schema

### Öncelik 3 — Rezervasyon Sistemi
1. Supabase şema tasarımı (bookings tablosu)
2. `/book-now` sayfası ve formu
3. E-posta konfirmasyonu (Resend)
4. Admin dashboard

### Öncelik 4 — AI Agentlar
1. SEO agenti — içerik önerileri, keyword analizi
2. Fotoğraf yönetim agenti

---

## 10. SEO STRATEJİSİ ÖZET

### Hedef Keywordler
| Keyword | Arama Hacmi (tahmini) | Öncelik |
|---------|----------------------|---------|
| paragliding oludeniz | Yüksek | 🔴 Kritik |
| tandem paragliding oludeniz | Yüksek | 🔴 Kritik |
| paragliding fethiye | Orta | 🟠 Yüksek |
| babadag paragliding | Orta | 🟠 Yüksek |
| oludeniz paragliding booking | Orta | 🟠 Yüksek |
| sunset paragliding oludeniz | Düşük | 🟡 Orta |
| acro paragliding oludeniz | Düşük | 🟡 Orta |
| paragliding turkey | Yüksek | 🟡 Orta |

### Teknik SEO Checklist
- [ ] Her sayfa için unique title tag (60 karakter)
- [ ] Her sayfa için meta description (155 karakter)
- [ ] H1 → H2 → H3 hiyerarşisi
- [ ] JSON-LD: LocalBusiness, TouristAttraction, ActivityPosting
- [ ] Breadcrumb schema (BreadcrumbNav zaten üretiyor)
- [ ] Open Graph tags (sosyal medya paylaşımları için)
- [ ] Sitemap.xml (next-sitemap ile otomatik)
- [ ] Core Web Vitals optimizasyonu
- [ ] Mobile-first tasarım (Tailwind ile yapılıyor)
- [ ] Sayfa yükleme hızı (Next.js Image optimizasyonu)
- [ ] HTTPS (Vercel ile otomatik)

---

## 11. BAĞIMLILIKLAR VE KURULUM

```bash
# Projeyi çalıştırmak için:
npm run dev        # localhost:3000
npm run build      # Production build
npm run start      # Production sunucu
npm run postbuild  # Sitemap oluşturma
```

**package.json'dan bilinen bağımlılıklar:**
- next, react, react-dom
- typescript, @types/react, @types/node
- tailwindcss, postcss, autoprefixer
- tailwind-merge, clsx
- lucide-react
- @supabase/supabase-js (veya @supabase/ssr)
- @anthropic-ai/sdk
- resend, nodemailer
- next-sitemap

---

## 12. NOTLAR VE KARARLAR

- **Framework seçimi:** Next.js 14 App Router — SEO için server-side rendering, performans için ideal
- **Supabase seçimi:** Hızlı kurulum, yerleşik auth, realtime özellikler
- **Anthropic SDK:** AI agentlar için — SEO otomasyonu ve fotoğraf yönetimi planlanıyor
- **Tailwind:** Hızlı geliştirme, tutarlı tasarım sistemi
- **Domain:** paragliding-oludeniz.com — keyword içeren domain, SEO avantajı var
- **Ceyhun developer değil** — admin dashboard sade ve kullanımı kolay olmalı
- **Dil:** Site İngilizce (uluslararası turist hedef kitle), yönetim paneli Türkçe olabilir

---

*Bu rapor 23 Mayıs 2026 tarihinde, projenin mevcut durumuna göre hazırlanmıştır.*  
*Proje klasörü: `D:\claude projekt\oludeniz project`*
