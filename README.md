# Menu PDF generator

This small script reads the JS menu data files in `src/data` and generates a PDF with separated headers for Hrana, Drinks and Pizza.

Prerequisites
- Python 3.8+
- Install dependencies (we use reportlab):

```bash
python -m pip install -r requirements.txt
```

Usage

Run from repository root:

```bash
python scripts/convert_menu_to_pdf.py --out menu.pdf
```
or produce a Word document:

```bash
python scripts/convert_menu_to_docx.py --out menu.docx
```

Options:
- `--data-dir` : path to the data directory (default: `src/data`)
- `--out` : output PDF path (default: `menu.pdf`)

DOCX notes
- The DOCX exporter uses `python-docx`. It creates two-column tables for items so the names and prices align nicely. If Croatian characters (č, ć, ž, š, đ) look wrong, pass a system-installed font name with `--font-name` (for example `--font-name "DejaVu Sans"`).

Font / Croatian characters (č ć ž š đ)
- The script attempts to auto-discover a UTF-8-capable TTF (DejaVu, Liberation, Noto, or Arial Unicode) on your system and register it so diacritics render correctly.
- If the PDF still shows wrong characters, install a UTF-8 font such as `DejaVu Sans` and either place the TTF in a standard system font folder or pass the font path explicitly:

```bash
python scripts/convert_menu_to_pdf.py --out menu.pdf --font-path /path/to/DejaVuSans.ttf
```

If you want a different layout or styling (two-column, fonts, spacing), tell me what you prefer and I can tune the script further.

Spacing and overlap fixes
- I increased the column gutter and added extra vertical spacing between section headers, category titles, items and between categories. This should prevent overlapping like in your screenshot. If you still see collisions, I can further increase spacing or render each category as a small table block.

Notes
- The script performs a simple JS-to-JSON conversion tuned for the provided files (it quotes keys, converts single to double quotes, and removes trailing commas). It may not work for arbitrary JS files.
<div align='center'><img style="width:20%"></div>

<h2>Konoba pizzeria River website</h2>

👉 Live Demo: <a href=''>Live Demo</a>

<h3>Build with:</h3>

» Frontend -> react <br>

<h2>Screenshot of Project 📸</h2>
<br>

## Home screen

<div align='center'>

<!-- <img src=""> -->

</div>

<br>

<br>

<h2>Todo: ✔️</h2>
<br>

- [x] Add react router for navbar routes
- [x] Recap section
- [x] Our story section
- [ ] Make menu page using mysql database
- [x] Add onscroll animations and regular animations
- [ ] Make page fully responsive
- [ ] Make reservation form usable using backend nodemailer
- [ ] Add formik validation for reservation form
- [ ] Add 404 error page

<br>
Maybe later
<br>

- [ ] Recenzije section
- [ ] Maybe specialities section

<br>
