#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Mifa Life Shop — Final Project Report Generator (Turkish, PDF)"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os, sys

# ── Output path ──────────────────────────────────────────────────────────────
OUT = r"C:\Users\pc\Documents\GitHub\Mifa_Life_shop\Mifa_Life_Final_Raporu.pdf"

# ── Colour palette ────────────────────────────────────────────────────────────
GREEN  = colors.HexColor("#009739")   # Mali green
YELLOW = colors.HexColor("#FCD116")   # Mali yellow
RED    = colors.HexColor("#CE1126")   # Mali red
DARK   = colors.HexColor("#1a2332")
GREY   = colors.HexColor("#F3F4F6")
DGREY  = colors.HexColor("#6B7280")
BLACK  = colors.HexColor("#111827")
WHITE  = colors.white
TEAL   = colors.HexColor("#00A896")

# ── Register a Unicode-capable font ──────────────────────────────────────────
# Try common system fonts on Windows that support Turkish characters
FONT_PATHS = [
    r"C:\Windows\Fonts\arial.ttf",
    r"C:\Windows\Fonts\calibri.ttf",
    r"C:\Windows\Fonts\segoeui.ttf",
    r"/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    r"/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
]
FONT_BOLD_PATHS = [
    r"C:\Windows\Fonts\arialbd.ttf",
    r"C:\Windows\Fonts\calibrib.ttf",
    r"C:\Windows\Fonts\segoeuib.ttf",
    r"/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    r"/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]
FONT_ITALIC_PATHS = [
    r"C:\Windows\Fonts\ariali.ttf",
    r"C:\Windows\Fonts\calibrii.ttf",
    r"/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf",
    r"/usr/share/fonts/truetype/liberation/LiberationSans-Italic.ttf",
]
MONO_PATHS = [
    r"C:\Windows\Fonts\cour.ttf",
    r"C:\Windows\Fonts\consola.ttf",
    r"/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    r"/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf",
]

def find_font(paths):
    for p in paths:
        if os.path.exists(p):
            return p
    return None

reg_path   = find_font(FONT_PATHS)
bold_path  = find_font(FONT_BOLD_PATHS)
italic_path= find_font(FONT_ITALIC_PATHS)
mono_path  = find_font(MONO_PATHS)

if reg_path:
    pdfmetrics.registerFont(TTFont("UniFont", reg_path))
if bold_path:
    pdfmetrics.registerFont(TTFont("UniFont-Bold", bold_path))
if italic_path:
    pdfmetrics.registerFont(TTFont("UniFont-Italic", italic_path))
if mono_path:
    pdfmetrics.registerFont(TTFont("UniMono", mono_path))

BASE_FONT  = "UniFont"      if reg_path   else "Helvetica"
BOLD_FONT  = "UniFont-Bold" if bold_path  else "Helvetica-Bold"
ITALIC_FONT= "UniFont-Italic" if italic_path else "Helvetica-Oblique"
MONO_FONT  = "UniMono"      if mono_path  else "Courier"

# ── Styles ────────────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

def S(name, **kw):
    base = kw.pop("parent", "Normal")
    ps = ParagraphStyle(name, parent=styles[base], **kw)
    return ps

sNormal  = S("sNormal",  fontName=BASE_FONT,  fontSize=10, leading=15, textColor=BLACK, spaceAfter=4)
sBody    = S("sBody",    fontName=BASE_FONT,  fontSize=10, leading=16, textColor=BLACK, spaceAfter=6, alignment=TA_JUSTIFY)
sBullet  = S("sBullet",  fontName=BASE_FONT,  fontSize=10, leading=15, textColor=BLACK, leftIndent=14, spaceAfter=3)
sH1      = S("sH1",      fontName=BOLD_FONT,  fontSize=18, leading=24, textColor=GREEN,  spaceBefore=20, spaceAfter=10)
sH2      = S("sH2",      fontName=BOLD_FONT,  fontSize=13, leading=18, textColor=DARK,   spaceBefore=14, spaceAfter=6)
sH3      = S("sH3",      fontName=BOLD_FONT,  fontSize=11, leading=16, textColor=TEAL,   spaceBefore=10, spaceAfter=4)
sCode    = S("sCode",    fontName=MONO_FONT,  fontSize=8,  leading=12, textColor=BLACK, backColor=GREY, leftIndent=8, rightIndent=8, spaceAfter=8, spaceBefore=4)
sTOC     = S("sTOC",     fontName=BASE_FONT,  fontSize=11, leading=18, textColor=BLACK)
sTOCH    = S("sTOCH",    fontName=BOLD_FONT,  fontSize=14, leading=20, textColor=GREEN, spaceAfter=12)
sCaption = S("sCaption", fontName=ITALIC_FONT,fontSize=9,  leading=13, textColor=DGREY, spaceAfter=8, alignment=TA_CENTER)
sCover1  = S("sCover1",  fontName=BOLD_FONT,  fontSize=24, leading=30, textColor=GREEN, alignment=TA_CENTER, spaceAfter=6)
sCover2  = S("sCover2",  fontName=BOLD_FONT,  fontSize=15, leading=22, textColor=DARK,  alignment=TA_CENTER, spaceAfter=4)
sCover3  = S("sCover3",  fontName=BASE_FONT,  fontSize=12, leading=18, textColor=DGREY, alignment=TA_CENTER, spaceAfter=6)
sFooter  = S("sFooter",  fontName=BASE_FONT,  fontSize=8,  leading=11, textColor=DGREY, alignment=TA_CENTER)

# ── Page template with header/footer ─────────────────────────────────────────
PAGE_W, PAGE_H = A4

def add_header_footer(canvas, doc):
    canvas.saveState()
    # Footer
    canvas.setFont(BASE_FONT, 8)
    canvas.setFillColor(DGREY)
    footer_text = "BM3012 — Bilgisayar Mühendisliği Uygulamaları I  |  Steeve Donald Compaoré  |  2025–2026"
    canvas.drawCentredString(PAGE_W / 2, 1.5 * cm, footer_text)
    # Page number
    canvas.drawRightString(PAGE_W - 2 * cm, 1.5 * cm, f"Sayfa {doc.page}")
    # Top thin Mali stripe
    stripe_w = PAGE_W / 3
    canvas.setFillColor(GREEN)
    canvas.rect(0, PAGE_H - 4, stripe_w, 4, fill=1, stroke=0)
    canvas.setFillColor(YELLOW)
    canvas.rect(stripe_w, PAGE_H - 4, stripe_w, 4, fill=1, stroke=0)
    canvas.setFillColor(RED)
    canvas.rect(stripe_w * 2, PAGE_H - 4, stripe_w, 4, fill=1, stroke=0)
    canvas.restoreState()

def add_cover_decorations(canvas, doc):
    canvas.saveState()
    # Bottom Mali stripe
    stripe_w = PAGE_W / 3
    canvas.setFillColor(GREEN)
    canvas.rect(0, 0, stripe_w, 8, fill=1, stroke=0)
    canvas.setFillColor(YELLOW)
    canvas.rect(stripe_w, 0, stripe_w, 8, fill=1, stroke=0)
    canvas.setFillColor(RED)
    canvas.rect(stripe_w * 2, 0, stripe_w, 8, fill=1, stroke=0)
    # Top stripe
    canvas.setFillColor(GREEN)
    canvas.rect(0, PAGE_H - 8, stripe_w, 8, fill=1, stroke=0)
    canvas.setFillColor(YELLOW)
    canvas.rect(stripe_w, PAGE_H - 8, stripe_w, 8, fill=1, stroke=0)
    canvas.setFillColor(RED)
    canvas.rect(stripe_w * 2, PAGE_H - 8, stripe_w, 8, fill=1, stroke=0)
    canvas.restoreState()

# ── Helpers ───────────────────────────────────────────────────────────────────
def HR(color=GREEN, thickness=1.5):
    return HRFlowable(width="100%", thickness=thickness, color=color, spaceAfter=8, spaceBefore=4)

def SP(h=0.3):
    return Spacer(1, h * cm)

def p(text, style=None):
    return Paragraph(text, style or sBody)

def h1(text):
    return [HR(GREEN, 2), Paragraph(text, sH1)]

def h2(text):
    return [Paragraph(text, sH2)]

def h3(text):
    return [Paragraph(text, sH3)]

def bullet(text):
    return Paragraph(f"•  {text}", sBullet)

def code_block(lines):
    """Wrap code text in a styled table cell."""
    text = "\n".join(lines)
    # Escape XML chars
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    # Replace newlines with <br/>
    text = text.replace("\n", "<br/>")
    inner = Paragraph(text, sCode)
    t = Table([[inner]], colWidths=[16.5 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GREY),
        ("BOX",        (0, 0), (-1, -1), 0.5, colors.HexColor("#D1D5DB")),
        ("TOPPADDING",    (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING",   (0, 0), (-1, -1), 10),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 10),
    ]))
    return t

def data_table(headers, rows, col_widths=None):
    data = [headers] + rows
    if col_widths is None:
        col_widths = [16.5 / len(headers) * cm] * len(headers)
    t = Table(data, colWidths=col_widths)
    style = TableStyle([
        ("BACKGROUND",   (0, 0), (-1, 0),  GREEN),
        ("TEXTCOLOR",    (0, 0), (-1, 0),  WHITE),
        ("FONTNAME",     (0, 0), (-1, 0),  BOLD_FONT),
        ("FONTSIZE",     (0, 0), (-1, 0),  9),
        ("FONTNAME",     (0, 1), (-1, -1), BASE_FONT),
        ("FONTSIZE",     (0, 1), (-1, -1), 9),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [WHITE, colors.HexColor("#F0FDF4")]),
        ("GRID",         (0, 0), (-1, -1), 0.5, colors.HexColor("#D1D5DB")),
        ("TOPPADDING",   (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 6),
        ("LEFTPADDING",  (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("VALIGN",       (0, 0), (-1, -1), "MIDDLE"),
    ])
    t.setStyle(style)
    return t

# ── Build story ───────────────────────────────────────────────────────────────
story = []

# ═══════════════════════════════════════════════════════════════
# COVER PAGE
# ═══════════════════════════════════════════════════════════════
story.append(SP(3))

# University badge box
badge_data = [[
    Paragraph(
        "<b>GAZİ ÜNİVERSİTESİ</b><br/>"
        "Mühendislik Fakültesi<br/>"
        "Bilgisayar Mühendisliği Bölümü",
        ParagraphStyle("badge", fontName=BOLD_FONT, fontSize=13, leading=20,
                       alignment=TA_CENTER, textColor=WHITE)
    )
]]
badge_t = Table(badge_data, colWidths=[12 * cm])
badge_t.setStyle(TableStyle([
    ("BACKGROUND", (0,0),(-1,-1), GREEN),
    ("BOX",        (0,0),(-1,-1), 2, WHITE),
    ("TOPPADDING",    (0,0),(-1,-1), 16),
    ("BOTTOMPADDING", (0,0),(-1,-1), 16),
    ("LEFTPADDING",   (0,0),(-1,-1), 24),
    ("RIGHTPADDING",  (0,0),(-1,-1), 24),
    ("ALIGN",      (0,0),(-1,-1), "CENTER"),
]))
# Center the badge
cover_wrapper = Table([[badge_t]], colWidths=[16.5 * cm])
cover_wrapper.setStyle(TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER")]))
story.append(cover_wrapper)

story.append(SP(2))
story.append(HR(GREEN, 3))
story.append(SP(0.5))

story.append(Paragraph("BM3012", sCover1))
story.append(Paragraph("BİLGİSAYAR MÜHENDİSLİĞİ UYGULAMALARI I", sCover2))
story.append(SP(0.5))
story.append(HR(YELLOW, 2))
story.append(SP(1.5))

story.append(Paragraph("Dönem Sonu Proje Raporu", sCover3))
story.append(SP(1))

# Project title box
proj_data = [[
    Paragraph(
        "MİFA LİFE SHOP",
        ParagraphStyle("pt", fontName=BOLD_FONT, fontSize=22, leading=28,
                       alignment=TA_CENTER, textColor=WHITE)
    ),
    ],
    [Paragraph(
        "Mali Premium E-Ticaret Platformu",
        ParagraphStyle("ps", fontName=BASE_FONT, fontSize=13, leading=18,
                       alignment=TA_CENTER, textColor=colors.HexColor("#D1FAE5"))
    )]
]
proj_t = Table(proj_data, colWidths=[14 * cm])
proj_t.setStyle(TableStyle([
    ("BACKGROUND",    (0,0),(-1,-1), DARK),
    ("BOX",           (0,0),(-1,-1), 2, GREEN),
    ("TOPPADDING",    (0,0),(-1,-1), 18),
    ("BOTTOMPADDING", (0,0),(-1,-1), 18),
    ("LEFTPADDING",   (0,0),(-1,-1), 24),
    ("RIGHTPADDING",  (0,0),(-1,-1), 24),
    ("ALIGN",         (0,0),(-1,-1), "CENTER"),
]))
proj_wrap = Table([[proj_t]], colWidths=[16.5*cm])
proj_wrap.setStyle(TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER")]))
story.append(proj_wrap)

story.append(SP(2))
story.append(HR(RED, 1))
story.append(SP(1))

# Student info table
info_data = [
    [Paragraph("<b>Öğrenci Adı:</b>", ParagraphStyle("il", fontName=BOLD_FONT, fontSize=11, leading=16)),
     Paragraph("Steeve Donald Compaoré", ParagraphStyle("iv", fontName=BASE_FONT, fontSize=11, leading=16))],
    [Paragraph("<b>Ders Kodu:</b>", ParagraphStyle("il", fontName=BOLD_FONT, fontSize=11, leading=16)),
     Paragraph("BM3012", ParagraphStyle("iv", fontName=BASE_FONT, fontSize=11, leading=16))],
    [Paragraph("<b>Teslim Tarihi:</b>", ParagraphStyle("il", fontName=BOLD_FONT, fontSize=11, leading=16)),
     Paragraph("7 Haziran 2026", ParagraphStyle("iv", fontName=BASE_FONT, fontSize=11, leading=16))],
    [Paragraph("<b>Akademik Yıl:</b>", ParagraphStyle("il", fontName=BOLD_FONT, fontSize=11, leading=16)),
     Paragraph("2025–2026", ParagraphStyle("iv", fontName=BASE_FONT, fontSize=11, leading=16))],
]
info_t = Table(info_data, colWidths=[5*cm, 9*cm])
info_t.setStyle(TableStyle([
    ("TOPPADDING",    (0,0),(-1,-1), 8),
    ("BOTTOMPADDING", (0,0),(-1,-1), 8),
    ("LEFTPADDING",   (0,0),(-1,-1), 0),
    ("GRID",          (0,0),(-1,-1), 0.5, colors.HexColor("#E5E7EB")),
    ("BACKGROUND",    (0,0),(0,-1), colors.HexColor("#F0FDF4")),
]))
info_wrap = Table([[info_t]], colWidths=[16.5*cm])
info_wrap.setStyle(TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER")]))
story.append(info_wrap)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════
# TABLE OF CONTENTS
# ═══════════════════════════════════════════════════════════════
story.append(Paragraph("İÇİNDEKİLER", sTOCH))
story.append(HR(GREEN, 2))
story.append(SP(0.5))

toc_entries = [
    ("1.", "Proje Amacı", "3"),
    ("2.", "Çalışma Takvimi", "4"),
    ("3.", "Proje Sonuç Verileri", "5"),
    ("4.", "Önemli Kod Blokları", "6"),
    ("5.", "Veri Tabanı Tasarımı", "8"),
]
for num, title, pg in toc_entries:
    toc_row_data = [[
        Paragraph(f"<b>{num}</b>", ParagraphStyle("tn", fontName=BOLD_FONT, fontSize=11, leading=18, textColor=GREEN)),
        Paragraph(title, ParagraphStyle("tt", fontName=BASE_FONT, fontSize=11, leading=18)),
        Paragraph(pg, ParagraphStyle("tp", fontName=BASE_FONT, fontSize=11, leading=18, alignment=TA_CENTER, textColor=DGREY)),
    ]]
    toc_t = Table(toc_row_data, colWidths=[1.2*cm, 13.3*cm, 2*cm])
    toc_t.setStyle(TableStyle([
        ("TOPPADDING",    (0,0),(-1,-1), 6),
        ("BOTTOMPADDING", (0,0),(-1,-1), 6),
        ("LINEBELOW",     (0,0),(-1,-1), 0.5, colors.HexColor("#E5E7EB")),
    ]))
    story.append(toc_t)

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════
# SECTION 1: PROJE AMACI
# ═══════════════════════════════════════════════════════════════
for el in h1("1. Proje Amacı"):
    story.append(el)

story.append(p(
    "Mifa Life Shop, Mali (Batı Afrika) pazarını hedefleyen, yerel üreticileri ve zanaatçâları "
    "destekleyen modern bir e-ticaret platformudur. Projenin temel amacı, Afrika’da dijital ekonomiyi "
    "güçlendirmek, yerel ürünleri küresel bir pazara taşımak ve kullanıcı dostu bir alışveriş "
    "deneyimi sunmaktır. Platform, Batı Afrika’nın en büyük ekonomilerinden birine hitap ederek "
    "geleneksel e-ticareti modern web teknolojileriyle birleştirmektedir."
))
story.append(SP(0.4))

for el in h2("1.1 Proje Hedefleri"):
    story.append(el)
goals = [
    "Mali ve Batı Afrika pazarına yönelik modern bir e-ticaret sitesi oluşturmak",
    "Supabase (PostgreSQL) veritabanı ile dinamik ürün yönetimi sağlamak",
    "Next.js 15 ve Tailwind CSS ile hızlı ve duyarlı (responsive) bir arayüz geliştirmek",
    "E-posta tabanlı kimlik doğrulama (Magic Link / OTP) sistemi entegre etmek",
    "Vercel platformunda canlı dağıtım gerçekleştirmek",
    "React Context API ile sepet (cart) yönetim sistemi oluşturmak",
    "20'den fazla HTML sayfa prototipi geliştirmek (katalog, ödeme, blog, dashboard vb.)",
]
for g in goals:
    story.append(bullet(g))
story.append(SP(0.4))

for el in h2("1.2 Kullanılan Teknolojiler"):
    story.append(el)

tech_data = [
    [Paragraph("<b>Katman</b>", ParagraphStyle("th", fontName=BOLD_FONT, fontSize=9, textColor=WHITE)),
     Paragraph("<b>Teknoloji</b>", ParagraphStyle("th", fontName=BOLD_FONT, fontSize=9, textColor=WHITE)),
     Paragraph("<b>Açıklama</b>", ParagraphStyle("th", fontName=BOLD_FONT, fontSize=9, textColor=WHITE))],
    ["Frontend", "Next.js 15 (App Router), TypeScript", "SSR/SSG ile hızlı arayüz"],
    ["Stil", "Tailwind CSS", "Utility-first CSS framework"],
    ["Veritabanı", "Supabase (PostgreSQL)", "Gerçek zamanlı DB + Auth"],
    ["Kimlik Doğrulama", "Supabase Auth — Magic Link, OTP", "Parasız e-posta doğrulama"],
    ["Dağıtım", "Vercel", "Otomatik CI/CD deploy"],
    ["Versiyon Kontrolü", "GitHub", "Kaynak kod yönetimi"],
]
# Convert string cells to Paragraphs
tech_rows = []
for row in tech_data[1:]:
    tech_rows.append([
        Paragraph(str(row[0]), ParagraphStyle("tc", fontName=BASE_FONT, fontSize=9, leading=13)),
        Paragraph(str(row[1]), ParagraphStyle("tc", fontName=BASE_FONT, fontSize=9, leading=13)),
        Paragraph(str(row[2]), ParagraphStyle("tc", fontName=BASE_FONT, fontSize=9, leading=13)),
    ])
story.append(data_table(tech_data[0], tech_rows, [3.5*cm, 6.5*cm, 6.5*cm]))
story.append(SP(0.3))
story.append(p("• GitHub: <b>https://github.com/dosteeve2-hash/Mifa_Life_shop</b>"))
story.append(p("• Canlı Site: <b>https://mifa-life-shop-9k55.vercel.app/</b>"))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════
# SECTION 2: ÇALIŞMA TAKVİMİ
# ═══════════════════════════════════════════════════════════════
for el in h1("2. Çalışma Takvimi"):
    story.append(el)

story.append(p(
    "Aşağıdaki tablo, projenin başlangıcından teslim tarihine kadar yapılan çalışmaları "
    "ay bazında özetlemektedir. Her aşamada GitHub commit geçmişi esas alınmıştır."
))
story.append(SP(0.4))

periods = [
    ("Şubat 2026",
     "Başlangıç ve Temel Kurulum",
     GREEN,
     [
        "İlk commit: Proje yapısı oluşturuldu (Next.js, package.json, konfigürasyonlar)",
        "Supabase bağlantısı kuruldu, .env.local yapılandırıldı",
        "Temel HTML arayüzü tasarlandı (index.html — ana sayfa prototipi)",
        "GitHub deposu oluşturuldu ve Azure CI/CD pipeline eklendi",
        "Dinamik Supabase bağlantısı ile ürünler veritabanından çekilmeye başladı",
     ]),
    ("Mart 2026",
     "Kimlik Doğrulama ve Sayfa Geliştirme",
     TEAL,
     [
        "Supabase Auth entegrasyonu: Magic Link ve Email OTP akışı",
        "Login sayfası geliştirildi, auth callback rotası eklendi",
        "Dinamik ürün detay sayfaları oluşturuldu (/shop/[id])",
        "OAuth sağlayıcıları etkinleştirildi (Google, GitHub)",
        "Middleware ile auth yönlendirme mantığı geliştirildi",
        "Vercel dağıtım hataları giderildi (tip güvenliği, build hataları)",
     ]),
    ("Nisan 2026",
     "UI Geliştirme ve Responsive Tasarım",
     colors.HexColor("#7C3AED"),
     [
        "Mali ulusal renkleri (Yeşil #009739, Sarı #FCD116, Kırmızı #CE1126) entegre edildi",
        "Tam responsive tasarım — mobil ve masaüstü uyumlu layout",
        "Navbar bileşeni geliştirildi (sticky, mobil hamburger menü)",
        "Sepet (Cart) Context API ile yönetimi kuruldu",
        "Ürün grid düzeni (Tailwind CSS grid) optimize edildi",
     ]),
    ("Mayıs 2026",
     "Nihai Entegrasyon ve Test",
     RED,
     [
        "CartContext ile shop butonları bağlandı",
        "AddToCartButton bileşeni oluşturuldu (geri bildirim animasyonu ile)",
        "Stitch tasarım prototipleri (desktop ve mobile) entegre edildi",
        "20+ HTML sayfası tamamlandı: about, admin, auth, blog, catalogue, checkout, contact, dashboard, faq...",
        "index.html son güncellemeler yapıldı",
        "Proje canlı ortamda test edildi: https://mifa-life-shop-9k55.vercel.app/",
     ]),
]

for period, title, color, items in periods:
    period_header = Table([[
        Paragraph(f"<b>{period}</b>", ParagraphStyle("ph", fontName=BOLD_FONT, fontSize=11, leading=16, textColor=WHITE)),
        Paragraph(title, ParagraphStyle("pt2", fontName=BASE_FONT, fontSize=11, leading=16, textColor=colors.HexColor("#D1FAE5"))),
    ]], colWidths=[4*cm, 12.5*cm])
    period_header.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), color),
        ("TOPPADDING",    (0,0),(-1,-1), 8),
        ("BOTTOMPADDING", (0,0),(-1,-1), 8),
        ("LEFTPADDING",   (0,0),(-1,-1), 10),
        ("RIGHTPADDING",  (0,0),(-1,-1), 10),
    ]))
    story.append(period_header)
    for item in items:
        story.append(Paragraph(f"•  {item}", ParagraphStyle(
            "pi", fontName=BASE_FONT, fontSize=9.5, leading=14, leftIndent=12, spaceAfter=2, textColor=BLACK
        )))
    story.append(SP(0.3))

story.append(SP(0.3))
story.append(p(f"<b>Toplam commit sayısı:</b> 50+  —  Versiyon kontrolü: GitHub"))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════
# SECTION 3: PROJE SONUÇ VERİLERİ
# ═══════════════════════════════════════════════════════════════
for el in h1("3. Proje Sonuç Verileri"):
    story.append(el)

story.append(p(
    "Proje, akademik dönem boyunca planlanan tüm özelliklerin başarıyla tamamlanmasıyla sonuçlandırılmıştır. "
    "Aşağıda teslim edilen özellikler ve proje istatistikleri özetlenmektedir."
))
story.append(SP(0.4))

for el in h2("3.1 Teslim Edilen Özellikler"):
    story.append(el)

features = [
    ("✓ Ana Sayfa", "Hero bölümü, kategori kartları, öne çıkan ürünler, CTA — (index.html + Next.js)"),
    ("✓ Mağaza Sayfası", "Supabase’den dinamik ürün listesi, arama ve kategori filtresi (/shop)"),
    ("✓ Ürün Detay Sayfaları", "Dinamik yönlendirme ile ürün detayları (/shop/[id])"),
    ("✓ Sepet Sistemi", "React Context API ile tam durum yönetimi"),
    ("✓ Kimlik Doğrulama", "Supabase Auth: Magic Link + Email OTP"),
    ("✓ Responsive Tasarım", "Mobil ve masaüstü tam uyumlu (Tailwind CSS)"),
    ("✓ Canlı Dağıtım", "Vercel — https://mifa-life-shop-9k55.vercel.app/"),
    ("✓ 20+ HTML Sayfa", "about, admin, auth, blog, catalogue, checkout, contact, dashboard, faq, flash, gift-cards..."),
]
feat_rows = [[
    Paragraph(f[0], ParagraphStyle("fb", fontName=BOLD_FONT, fontSize=9, leading=14, textColor=GREEN)),
    Paragraph(f[1], ParagraphStyle("fd", fontName=BASE_FONT, fontSize=9, leading=14)),
] for f in features]
feat_hdrs = [
    Paragraph("<b>Özellik</b>", ParagraphStyle("fh", fontName=BOLD_FONT, fontSize=9, textColor=WHITE)),
    Paragraph("<b>Detay</b>",        ParagraphStyle("fh", fontName=BOLD_FONT, fontSize=9, textColor=WHITE)),
]
story.append(data_table(feat_hdrs, feat_rows, [4.5*cm, 12*cm]))
story.append(SP(0.6))

for el in h2("3.2 Proje İstatistikleri"):
    story.append(el)

stats_data = [
    [Paragraph("<b>Metrik</b>", ParagraphStyle("sh", fontName=BOLD_FONT, fontSize=9, textColor=WHITE)),
     Paragraph("<b>Değer</b>", ParagraphStyle("sh", fontName=BOLD_FONT, fontSize=9, textColor=WHITE))],
    [Paragraph("Toplam commit sayısı", ParagraphStyle("s1", fontName=BASE_FONT, fontSize=9, leading=14)),
     Paragraph("<b>50+</b>", ParagraphStyle("s2", fontName=BOLD_FONT, fontSize=9, leading=14, textColor=GREEN))],
    [Paragraph("Tamamlanan HTML sayfası", ParagraphStyle("s1", fontName=BASE_FONT, fontSize=9, leading=14)),
     Paragraph("<b>20+</b>", ParagraphStyle("s2", fontName=BOLD_FONT, fontSize=9, leading=14, textColor=GREEN))],
    [Paragraph("Next.js rotası", ParagraphStyle("s1", fontName=BASE_FONT, fontSize=9, leading=14)),
     Paragraph("<b>5</b> (/, /shop, /shop/[id], /login, /cart)", ParagraphStyle("s2", fontName=BASE_FONT, fontSize=9, leading=14))],
    [Paragraph("Veritabanı tablosu", ParagraphStyle("s1", fontName=BASE_FONT, fontSize=9, leading=14)),
     Paragraph("products, auth.users (Supabase)", ParagraphStyle("s2", fontName=BASE_FONT, fontSize=9, leading=14))],
    [Paragraph("Dağıtım platformu", ParagraphStyle("s1", fontName=BASE_FONT, fontSize=9, leading=14)),
     Paragraph("Vercel (otomatik CI/CD)", ParagraphStyle("s2", fontName=BASE_FONT, fontSize=9, leading=14))],
    [Paragraph("GitHub repo", ParagraphStyle("s1", fontName=BASE_FONT, fontSize=9, leading=14)),
     Paragraph("https://github.com/dosteeve2-hash/Mifa_Life_shop", ParagraphStyle("s2", fontName=BASE_FONT, fontSize=9, leading=14))],
    [Paragraph("Canlı URL", ParagraphStyle("s1", fontName=BASE_FONT, fontSize=9, leading=14)),
     Paragraph("https://mifa-life-shop-9k55.vercel.app/", ParagraphStyle("s2", fontName=BASE_FONT, fontSize=9, leading=14))],
]
story.append(data_table(stats_data[0], stats_data[1:], [7*cm, 9.5*cm]))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════
# SECTION 4: ÖNEMLİ KOD BLOKLARI
# ═══════════════════════════════════════════════════════════════
for el in h1("4. Önemli Kod Blokları"):
    story.append(el)

story.append(p(
    "Bu bölümde projenin temel bileşenlerini oluşturan önemli kod parçaları incelenmektedir. "
    "Her kod bloğunun amacı ve işleyişi açıklanmaktadır."
))
story.append(SP(0.3))

# 4.1 Navbar
for el in h2("4.1 Navbar Bileşeni (Navbar.tsx) — React + Tailwind + Next.js"):
    story.append(el)
story.append(p(
    "Navbar bileşeni, <b>usePathname</b> hook’u ile aktif rotayı takip eder. "
    "Mali bayrağının ç rengini (yeşil, sarı, kırmızı) temsil eden dekoratif bant, "
    "markanın kimliğini pekiştirir. Mobil için hamburger menü animasyonu uygulanmıştır."
))
story.append(code_block([
    "'use client';",
    "import { useState } from 'react';",
    "import Link from 'next/link';",
    "import { usePathname } from 'next/navigation';",
    "import { useCart } from '@/context/CartContext';",
    "",
    "const NAV_LINKS = [",
    "  { href: '/',      label: 'Accueil'   },",
    "  { href: '/shop',  label: 'Boutique'  },",
    "  { href: '/login', label: 'Connexion' },",
    "];",
    "",
    "export default function Navbar() {",
    "  const [open, setOpen] = useState(false);",
    "  const pathname = usePathname();",
    "  const { totalItems } = useCart();",
    "",
    "  return (",
    "    <>",
    "      {/* Mali Bayragi Bant - 3 renk */}",
    "      <div className='flex h-[3px] w-full'>",
    "        <span className='flex-1 bg-[#009739]' />   {/* Yesil */}",
    "        <span className='flex-1 bg-[#FCD116]' />   {/* Sari  */}",
    "        <span className='flex-1 bg-[#CE1126]' />   {/* Kirmizi */}",
    "      </div>",
    "      <header className='sticky top-0 z-50 bg-white/95 backdrop-blur-md'>",
    "        {/* ... Navlink'ler, sepet ikonu, mobil hamburger menu ... */}",
    "      </header>",
    "    </>",
    "  );",
    "}",
]))
story.append(SP(0.3))

# 4.2 Shop page
for el in h2("4.2 Mağaza Sayfası — Supabase Veri Çekme (page.tsx)"):
    story.append(el)
story.append(p(
    "Next.js App Router’ın Server Component’i olarak çalışan bu sayfa, "
    "Supabase’den ürünleri sunucu tarafında çeker. Arama ve kategori filtreleme "
    "<b>ilike</b> ve <b>eq</b> sorgu operatorleri ile uygulanmıştır."
))
story.append(code_block([
    "import { createServerSupabaseClient } from '@/lib/supabase/server';",
    "",
    "export const dynamic = 'force-dynamic';",
    "",
    "export default async function ShopPage({ searchParams }) {",
    "  const supabase = await createServerSupabaseClient();",
    "  const params = await searchParams;",
    "",
    "  // Urunleri veritabanindan cek",
    "  let query = supabase",
    "    .from('products')",
    "    .select('id,name,price_cfa,original_price_cfa,stock,category,image_url')",
    "    .eq('active', true)",
    "    .order('created_at', { ascending: false });",
    "",
    "  if (params.q)   query = query.ilike('name', `%${params.q}%`);",
    "  if (params.cat) query = query.eq('category', params.cat);",
    "",
    "  const { data: products } = await query;",
    "  // ... JSX render edilir",
    "}",
]))
story.append(SP(0.3))

# 4.3 AddToCartButton
for el in h2("4.3 Sepete Ekle Butonu (AddToCartButton.tsx)"):
    story.append(el)
story.append(p(
    "Client bileşeni olarak çalışan bu buton, CartContext’ten <b>addItem</b> metodunu "
    "alır. Kullanıcı deneyimini iyileştirmek için 1.5 saniyelik ‘Eklendi!’ geri bildirim "
    "animasyonu uygulanmıştır."
))
story.append(code_block([
    "'use client';",
    "import { useState } from 'react';",
    "import { useCart } from '@/context/CartContext';",
    "",
    "export default function AddToCartButton({ product }) {",
    "  const { addItem } = useCart();",
    "  const [added, setAdded] = useState(false);",
    "",
    "  function handle() {",
    "    addItem({ id: product.id, name: product.name,",
    "              price_cfa: product.price_cfa, image_url: product.image_url });",
    "    setAdded(true);",
    "    setTimeout(() => setAdded(false), 1500); // 1.5s geri bildirim",
    "  }",
    "",
    "  return (",
    "    <button onClick={handle}",
    "      className={added ? 'bg-emerald-600 scale-95' : 'bg-[#009739] hover:bg-[#007a2e]'}>",
    "      {added ? 'Eklendi!' : '+ Ekle'}",
    "    </button>",
    "  );",
    "}",
]))
story.append(SP(0.3))

# 4.4 CSS Design system
for el in h2("4.4 HTML Ana Sayfa CSS Tasarım Sistemi (index.html)"):
    story.append(el)
story.append(p(
    "Ana HTML sayfası, CSS Custom Properties (değişkenler) ile merkezi bir tasarım sistemi "
    "kullanmaktadır. Bu yaklaşım, tüm renklerin tek bir noktadan yönetilmesini sağlar."
))
story.append(code_block([
    ":root {",
    "  --em: #00A896;   /* Ana renk - zumrut yesili */",
    "  --or: #FF6B35;   /* Vurgu rengi - turuncu    */",
    "  --sl: #2F3E46;   /* Koyu gri-mavi             */",
    "  --mu: #F5CB5C;   /* Altin sarisi              */",
    "}",
    "",
    "/* Sticky Navbar */",
    "#nav {",
    "  position: sticky; top: 0; z-index: 500;",
    "  background: #fff;",
    "  border-bottom: 1px solid var(--bg3);",
    "  transition: all .3s;",
    "}",
    "#nav.sc { backdrop-filter: blur(24px); box-shadow: var(--shm); }",
    "",
    "/* Premium Buton */",
    ".btn-p {",
    "  background: linear-gradient(135deg, var(--em), var(--em-d));",
    "  border-radius: 50px;",
    "  box-shadow: 0 3px 10px rgba(0,168,150,.2);",
    "}",
    ".btn-p:hover { transform: translateY(-1px); }",
]))

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════
# SECTION 5: VERİ TABANI TASARIMI
# ═══════════════════════════════════════════════════════════════
for el in h1("5. Veri Tabanı Tasarımı"):
    story.append(el)

story.append(p(
    "Proje, Backend-as-a-Service (BaaS) çözümü olarak <b>Supabase</b> kullanmaktadır. "
    "Supabase, PostgreSQL veritabanı üzerine inşa edilmiş olup gerçek zamanlı veri "
    "senkronizasyonu, RowLevel Security ve yerleşik kimlik doğrulama hizmetleri sunmaktadır."
))
story.append(p("<b>Supabase Proje Dashboard:</b> https://supabase.com/dashboard/project/ywophjfwhyqubpitqhrm"))
story.append(SP(0.4))

for el in h2("5.1 Products Tablosu"):
    story.append(el)

db_hdrs = [
    Paragraph("<b>Sütun Adı</b>", ParagraphStyle("dh", fontName=BOLD_FONT, fontSize=9, textColor=WHITE)),
    Paragraph("<b>Veri Tipi</b>",          ParagraphStyle("dh", fontName=BOLD_FONT, fontSize=9, textColor=WHITE)),
    Paragraph("<b>Kısıtlamalar</b>", ParagraphStyle("dh", fontName=BOLD_FONT, fontSize=9, textColor=WHITE)),
    Paragraph("<b>Açıklama</b>",  ParagraphStyle("dh", fontName=BOLD_FONT, fontSize=9, textColor=WHITE)),
]
db_rows_raw = [
    ("id",                 "integer",      "PRIMARY KEY, AUTO",   "Birincil anahtar"),
    ("name",               "text",         "NOT NULL",            "Ürün adı"),
    ("price_cfa",          "integer",      "NOT NULL",            "Fiyat (CFA Frangı)"),
    ("original_price_cfa", "integer",      "NULL",                "Orijinal fiyat (indirim)"),
    ("stock",              "integer",      "NOT NULL, DEFAULT 0", "Stok miktarı"),
    ("category",           "text",         "NULL",                "Ürün kategorisi"),
    ("image_url",          "text",         "NULL",                "Ürün görseli URL"),
    ("shipping_days",      "text",         "NOT NULL",            "Kargo süresi"),
    ("active",             "boolean",      "DEFAULT true",        "Ürün aktif mi?"),
    ("created_at",         "timestamptz",  "DEFAULT now()",       "Oluşturulma tarihi"),
]
db_rows = [[
    Paragraph(r[0], ParagraphStyle("dc", fontName=MONO_FONT,  fontSize=8.5, leading=13)),
    Paragraph(r[1], ParagraphStyle("dc", fontName=MONO_FONT,  fontSize=8.5, leading=13, textColor=TEAL)),
    Paragraph(r[2], ParagraphStyle("dc", fontName=BASE_FONT,  fontSize=8.5, leading=13, textColor=DGREY)),
    Paragraph(r[3], ParagraphStyle("dc", fontName=BASE_FONT,  fontSize=8.5, leading=13)),
] for r in db_rows_raw]
story.append(data_table(db_hdrs, db_rows, [3.5*cm, 2.5*cm, 3.5*cm, 7*cm]))
story.append(SP(0.5))

for el in h2("5.2 Supabase Auth — Kullanıcı Tablosu"):
    story.append(el)
story.append(p(
    "Kullanıcı yönetimi için Supabase’in yerleşik <b>auth.users</b> tablosu kullanılmıştır. "
    "Bu tablo PostgreSQL’in ayrı bir şemasında saklanır ve doğrudan yönetilemez."
))
auth_hdrs = [
    Paragraph("<b>Sütun</b>",    ParagraphStyle("ah", fontName=BOLD_FONT, fontSize=9, textColor=WHITE)),
    Paragraph("<b>Tip</b>",           ParagraphStyle("ah", fontName=BOLD_FONT, fontSize=9, textColor=WHITE)),
    Paragraph("<b>Açıklama</b>", ParagraphStyle("ah", fontName=BOLD_FONT, fontSize=9, textColor=WHITE)),
]
auth_rows_raw = [
    ("id",              "uuid",          "Kullanıcı benzersiz kimliği"),
    ("email",           "text",          "E-posta adresi (Magic Link için)"),
    ("created_at",      "timestamptz",   "Hesap oluşturma tarihi"),
    ("last_sign_in_at", "timestamptz",   "Son giriş tarihi"),
    ("role",            "text",          "Kullanıcı rolü (anon / authenticated)"),
]
auth_rows = [[
    Paragraph(r[0], ParagraphStyle("ac", fontName=MONO_FONT, fontSize=9, leading=13)),
    Paragraph(r[1], ParagraphStyle("ac", fontName=MONO_FONT, fontSize=9, leading=13, textColor=TEAL)),
    Paragraph(r[2], ParagraphStyle("ac", fontName=BASE_FONT, fontSize=9, leading=13)),
] for r in auth_rows_raw]
story.append(data_table(auth_hdrs, auth_rows, [4*cm, 3.5*cm, 9*cm]))
story.append(SP(0.5))

for el in h2("5.3 Row Level Security (RLS) Politikaları"):
    story.append(el)
story.append(p(
    "Supabase’in RLS özelliği, veritabanı seviyesinde güvenlik sağlar. "
    "Ürünler herkese okunabilirken, yazma işlemleri sadece yetkili kullanıcılara açıktır."
))
rls_hdrs = [
    Paragraph("<b>Tablo</b>",     ParagraphStyle("rh", fontName=BOLD_FONT, fontSize=9, textColor=WHITE)),
    Paragraph("<b>İşlem</b>", ParagraphStyle("rh", fontName=BOLD_FONT, fontSize=9, textColor=WHITE)),
    Paragraph("<b>Politika</b>",  ParagraphStyle("rh", fontName=BOLD_FONT, fontSize=9, textColor=WHITE)),
]
rls_rows = [
    [Paragraph("products", ParagraphStyle("rc", fontName=MONO_FONT, fontSize=9, leading=13)),
     Paragraph("SELECT",   ParagraphStyle("rc", fontName=MONO_FONT, fontSize=9, leading=13, textColor=GREEN)),
     Paragraph("Herkes okuyabilir (anon dahil)", ParagraphStyle("rc", fontName=BASE_FONT, fontSize=9, leading=13))],
    [Paragraph("products", ParagraphStyle("rc", fontName=MONO_FONT, fontSize=9, leading=13)),
     Paragraph("INSERT / UPDATE", ParagraphStyle("rc", fontName=MONO_FONT, fontSize=9, leading=13, textColor=RED)),
     Paragraph("Sadece authenticated admin kullanıcılar", ParagraphStyle("rc", fontName=BASE_FONT, fontSize=9, leading=13))],
    [Paragraph("auth.users", ParagraphStyle("rc", fontName=MONO_FONT, fontSize=9, leading=13)),
     Paragraph("ALL",        ParagraphStyle("rc", fontName=MONO_FONT, fontSize=9, leading=13, textColor=TEAL)),
     Paragraph("Supabase Auth tarafından yönetilir", ParagraphStyle("rc", fontName=BASE_FONT, fontSize=9, leading=13))],
]
story.append(data_table(rls_hdrs, rls_rows, [3.5*cm, 3.5*cm, 9.5*cm]))
story.append(SP(0.5))

for el in h2("5.4 Veritabanı İlişki Diyagramı"):
    story.append(el)
story.append(code_block([
    "  auth.users                  products",
    "  +-----------+               +-----------+",
    "  | id (uuid) |               | id (int)  |",
    "  | email     |               | name      |",
    "  | created_at|               | price_cfa |",
    "  +-----------+               | stock     |",
    "       |                      | category  |",
    "       | 1                    | image_url |",
    "       |                      | active    |",
    "       v N                    +-----------+",
    "  orders / cart                    | N",
    "  +-----------+                    |",
    "  | user_id   |--------------------+",
    "  | product_id|   (cart_items / order_items)",
    "  | quantity  |",
    "  +-----------+",
]))
story.append(SP(0.5))

# Final summary box
summary_data = [[
    Paragraph(
        "<b>PROJE ÖZETİ</b><br/><br/>"
        "GitHub: https://github.com/dosteeve2-hash/Mifa_Life_shop<br/>"
        "Canlı Uygulama: https://mifa-life-shop-9k55.vercel.app/<br/>"
        "Supabase: https://supabase.com/dashboard/project/ywophjfwhyqubpitqhrm<br/><br/>"
        "Teknoloji: Next.js 15 • TypeScript • Tailwind CSS • Supabase • Vercel",
        ParagraphStyle("summ", fontName=BASE_FONT, fontSize=10, leading=18, textColor=WHITE)
    )
]]
summ_t = Table(summary_data, colWidths=[16.5*cm])
summ_t.setStyle(TableStyle([
    ("BACKGROUND",    (0,0),(-1,-1), DARK),
    ("BOX",           (0,0),(-1,-1), 2, GREEN),
    ("TOPPADDING",    (0,0),(-1,-1), 16),
    ("BOTTOMPADDING", (0,0),(-1,-1), 16),
    ("LEFTPADDING",   (0,0),(-1,-1), 20),
    ("RIGHTPADDING",  (0,0),(-1,-1), 20),
]))
story.append(summ_t)

# ── Build PDF ─────────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUT,
    pagesize=A4,
    leftMargin=2*cm, rightMargin=2*cm,
    topMargin=2.5*cm, bottomMargin=2.5*cm,
    title="Mifa Life Shop - Final Proje Raporu",
    author="Steeve Donald Compaore",
    subject="BM3012 Donem Sonu Raporu",
)

def on_page(canvas, doc):
    if doc.page == 1:
        add_cover_decorations(canvas, doc)
    else:
        add_header_footer(canvas, doc)

doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
print(f"PDF basariyla olusturuldu: {OUT}")
