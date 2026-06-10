# SEO Audit — Round 3 · Paragliding Ölüdeniz

**Tarih:** 10 Haziran 2026 · **Domain:** paragliding-oludeniz.com
**Kapsam:** Canlı site + kod tabanı (i18n geçişi SONRASI ilk denetim)
**Genel Skor: 70/100** (Round 2'de 88 idi — i18n geçişi sırasında bazı SEO öğeleri kayboldu)

> Özet: Site sağlam bir temele sahip (robots, sitemap, title'lar, OG, içerik kalitesi hepsi iyi).
> Ancak 4 dilli yapıya geçerken Round 1-2'de yapılan bazı düzeltmeler geri gitti.
> Aşağıdaki KRİTİK maddeler düzeltilmeden tr/de/ru sayfaları Google'da SIRALANAMAZ.

---

## KRİTİK (hemen düzeltilmeli)

### 1. Hreflang etiketi hiçbir sayfada yok
4 dilli site ama hiçbir sayfada `hreflang` yok. Google hangi dilin hangi ülkeye ait olduğunu bilmiyor.
Rus/Alman/Türk turist aramalarında tr/de/ru sayfalar görünmeyecek.
**Çözüm:** Her sayfanın `generateMetadata`'sına `alternates.languages` ekle (en/tr/de/ru + x-default).

### 2. Çeviri sayfalarının canonical'ı İngilizce sayfayı gösteriyor
Örnek: `app/[locale]/tandem-paragliding/page.tsx` → canonical SABİT olarak
`https://paragliding-oludeniz.com/tandem-paragliding`. Yani `/tr/tandem-paragliding` Google'a
"ben İngilizce sayfanın kopyasıyım, beni indexleme" diyor. Çeviriler bu yüzden asla sıralanamaz.
**Çözüm:** Canonical locale'e göre dinamik olmalı (`locale === 'en' ? path : '/' + locale + path`).

### 3. ~100 sayfada canonical tamamen yok
Sadece 8 dosyada canonical var (tandem-paragliding, prices, faq, contact, book-now, blog, about-us).
Anasayfa dahil geri kalan tüm sayfalarda yok. Round 2'de "hepsinde var" idi — i18n geçişinde kaybolmuş.

### 4. tr/de/ru sayfaların title ve description'ı İngilizce
`/tr` anasayfasının title'ı hâlâ "Paragliding Oludeniz | Tandem Flights from Babadağ".
İçerik Türkçe ama meta veriler İngilizce — Google ve kullanıcı için tutarsız.
**Çözüm:** generateMetadata içinde çevrilmiş title/description kullan (messages dosyalarına meta alanları ekle).

### 5. `<html lang="en">` tüm dillerde sabit
`app/layout.tsx` → `<html lang="en">`. Türkçe sayfa da kendini İngilizce ilan ediyor.
**Çözüm:** lang'i locale'den al (`<html lang={locale}>` — locale layout'a taşı veya params'tan oku).

### 6. LocalBusiness schema KAYBOLMUŞ (regresyon)
Round 2'de anasayfada vardı. Haziran başındaki site kesintisi onarımında `app/page.tsx`
redirect'e çevrilince schema silindi. Şu an kodda hiçbir yerde LocalBusiness yok
(sadece BreadcrumbList + FAQPage komponentlerde).
**Çözüm:** `app/[locale]/page.tsx`'e LocalBusiness JSON-LD'yi geri ekle (name, address, geo,
telephone, priceRange, aggregateRating, sameAs: Instagram/Facebook).

### 7. Sitemap'te tr/de/ru URL'leri yok
`app/sitemap.ts` sadece İngilizce URL'leri içeriyor. 3 dilin ~300 sayfası sitemap dışında.
**Çözüm:** Her path için 4 dilin URL'ini (veya hreflang alternates'li tek girişi) sitemap'e ekle.

---

## ORTA (yakında düzeltilmeli)

### 8. og:url tüm sayfalarda anasayfayı gösteriyor
`app/layout.tsx` → `openGraph.url` sabit. Her sayfa kendi URL'ini vermeli.

### 9. og:locale tüm dillerde en_US
tr sayfada tr_TR, de'de de_DE, ru'da ru_RU olmalı.

### 10. Özel 404 sayfası yok (`app/not-found.tsx`)
Round 2'den beri açık. Markalı 404 + popüler sayfalara linkler kaybolan ziyaretçiyi kurtarır.

### 11. Round 2'den kalan: ~11 meta description 160 karakterden uzun
Liste SEO-AUDIT-ROUND2.md'de. Hâlâ geçerli olup olmadığı tek tek kontrol edilmeli.

### 12. Service/Offer schema eksik
Ticari sayfalarda (tandem, transfers, training, pilot-services) Service + Offer schema yok.
Fiyatlı zengin sonuç (rich result) şansı kaçıyor.

---

## DÜŞÜK

- Ölü stub dosyalar: `app/<route>/page.tsx` dosyalarının çoğu `redirect('/')` stub'ı.
  Middleware sayesinde çalışmıyorlar ama `redirect('/')` yol bilgisini kaybettiriyor —
  middleware bir gün değişirse tüm sayfalar anasayfaya yönlenir. Temizlenmeli veya
  `redirect` aynı path'in EN versiyonuna gitmeli.
- `loading.tsx`/`error.tsx` yok (blog ve live-weather için CWV iyileştirmesi).
- 3 hero görseli hâlâ CSS background-image (LCP optimizasyonu için next/image'a çevrilmeli).
- H1 anasayfada "Fly Over the Blue Lagoon of Ölüdeniz" — "paragliding" kelimesi H1'de yok.
  "Paragliding in Ölüdeniz — Fly Over the Blue Lagoon" gibi bir varyant ana keyword'ü güçlendirir.
- Yorumlar (reviews) tüm dillerde İngilizce — tr/de/ru için çevrilmiş veya yerel yorumlar daha iyi.

---

## TEMİZ OLANLAR ✅

- robots.txt doğru (admin + api kapalı, sitemap işaretli)
- Sitemap canlıda çalışıyor, blog makaleleri Supabase'den otomatik ekleniyor
- Title'lar 60 karakter altında, keyword'lü, benzersiz
- OG image dinamik üretiliyor (opengraph-image.tsx), boyutlar doğru
- `/en` → `/` redirect doğru (duplicate yok)
- 301 redirectler çalışıyor
- Tek H1 / sayfa, BreadcrumbList + FAQPage schema'ları komponentlerde aktif
- İçerik kalitesi ve sayfa kapsamı (100+ sayfa) rakiplerin çok üstünde

---

## ÖNCELİK SIRASI (önerilen iş planı)

1. **Hreflang + dinamik canonical + lang attribute** (madde 1, 2, 3, 5) — tek seferde yapılır, i18n SEO'nun temeli
2. **Meta çevirileri** (madde 4) — messages dosyalarına meta.title/meta.description ekle
3. **LocalBusiness schema'yı geri getir** (madde 6)
4. **Sitemap'e dil URL'leri** (madde 7)
5. og:url/og:locale düzeltmesi + 404 sayfası (madde 8, 9, 10)
6. Service schema + kalan Round 2 maddeleri

> Not: 1-4 yapılmadan Google'da tr/de/ru pazarlarından trafik beklemek gerçekçi değil.
> Bu düzeltmeler "paragliding oludeniz" ana hedefine de katkı yapar çünkü site genelinde
> duplicate-content sinyallerini temizler.

*Yöntem: canlı site fetch (/, /tr, /en, /tandem-paragliding, robots.txt, sitemap.xml) + kod tabanı statik analizi (106 locale sayfası, layout'lar, sitemap.ts, schema komponentleri).*
