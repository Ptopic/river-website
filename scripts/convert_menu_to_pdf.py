#!/usr/bin/env python3
"""
Convert the JS menu data files into a single PDF with separated headers.

Usage:
  python scripts/convert_menu_to_pdf.py --out menu.pdf

By default, it looks for the files in `src/data/hrana.js`, `src/data/drinks.js`,
and `src/data/pizzaData.js` relative to the repository root.
"""
import json
import re
from pathlib import Path
import argparse

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import getSampleStyleSheet
import platform


def extract_js_array_text(text: str) -> str:
    """Extract the substring that contains the top-level array (from first '[' to matching last ']')."""
    start = text.find("[")
    if start == -1:
        raise ValueError("No array bracket '[' found in file content")
    # find last ']' (assume the file ends with '];')
    end = text.rfind("]")
    if end == -1:
        raise ValueError("No closing array bracket ']' found in file content")
    return text[start:end+1]


def js_array_to_python(obj_text: str):
    """Very small JS->JSON -> Python converter tuned for these data files.

    Steps:
    - Quote unquoted object keys (e.g. id: -> "id":)
    - Convert single quotes to double quotes
    - Remove trailing commas before } and ]
    """
    s = obj_text
    # Quote keys like: id:  or name:  -> "id":
    s = re.sub(r"(\b\w+\b)\s*:", r'"\1":', s)
    # convert single quotes to double quotes
    s = s.replace("'", '"')
    # remove trailing commas before } or ]
    s = re.sub(r",\s*([}\]])", r"\1", s)
    # Some JS files may have comments or other JS-isms; we assume data is simple
    return json.loads(s)


def load_js_data(path: Path):
    text = path.read_text(encoding="utf-8")
    arr_text = extract_js_array_text(text)
    return js_array_to_python(arr_text)


def draw_section(c: canvas.Canvas, x: float, y: float, width: float, section_title: str, data: list):
    """Draw a section starting at (x,y). Returns new y."""
    # Section title
    # Title uses the registered font if available
    title_font = "MenuFont-Bold" if "MenuFont-Bold" in pdfmetrics.getRegisteredFontNames() else "MenuFont"
    if title_font not in pdfmetrics.getRegisteredFontNames():
        title_font = "Helvetica-Bold"
    c.setFont(title_font, 16)
    c.setFillColor(colors.darkblue)
    c.drawString(x, y, section_title)
    y -= 10 * mm

    # For each category in the section
    for category in data:
        if y < 30 * mm:
            c.showPage(); setup_page(c)
            y = A4[1] - 30 * mm
        # Category name
        c.setFont(title_font if title_font in pdfmetrics.getRegisteredFontNames() else "Helvetica-Bold", 12)
        c.setFillColor(colors.black)
        c.drawString(x, y, category.get("name", ""))
        y -= 6 * mm

        # Items
        item_font = "MenuFont" if "MenuFont" in pdfmetrics.getRegisteredFontNames() else "Helvetica"
        c.setFont(item_font, 10)
        for item in category.get("content", []):
            if y < 25 * mm:
                c.showPage(); setup_page(c)
                y = A4[1] - 30 * mm
            # Name left, price right
            name = item.get("name", "")
            price = item.get("price", "")
            kol = item.get("kol", "")
            jumbo = item.get("jumbo", "")

            # Draw name
            c.drawString(x + 4*mm, y, name)
            # Draw price aligned to right margin of the content width
            price_x = x + width - 20*mm
            c.drawRightString(price_x + 40*mm, y, price)
            y -= 4.5 * mm

            # Draw kol / jumbo in smaller text if present
            extras = []
            if kol:
                extras.append(kol)
            if jumbo:
                extras.append(jumbo)
            if extras:
                # use the same font family but italic if available
                italic_font = item_font + "-Italic" if (item_font + "-Italic") in pdfmetrics.getRegisteredFontNames() else item_font
                c.setFont(italic_font, 9)
                c.setFillColor(colors.grey)
                c.drawString(x + 8*mm, y, " ".join(extras))
                c.setFillColor(colors.black)
                c.setFont(item_font, 10)
                y -= 4 * mm

        y -= 3 * mm

    return y


def setup_page(c: canvas.Canvas):
    # optional header on each page
    header_font = "MenuFont-Bold" if "MenuFont-Bold" in pdfmetrics.getRegisteredFontNames() else "Helvetica-Bold"
    c.setFont(header_font, 20)
    c.setFillColor(colors.black)
    c.drawCentredString(A4[0]/2, A4[1] - 20 * mm, "River - Menu")
    # footer / page number
    page_num = c.getPageNumber()
    c.setFont("Helvetica", 8)
    c.setFillColor(colors.grey)
    c.drawRightString(A4[0] - 15*mm, 12*mm, f"Page {page_num}")


def find_font_path(preferred: list):
    # Search common font locations for a preferred font filename
    search_dirs = []
    system = platform.system()
    if system == "Darwin":
        search_dirs = ["/System/Library/Fonts", "/Library/Fonts", str(Path.home() / "Library/Fonts")]
    elif system == "Windows":
        search_dirs = [str(Path("C:/Windows/Fonts"))]
    else:
        search_dirs = ["/usr/share/fonts", "/usr/local/share/fonts", str(Path.home() / ".fonts")]

    for d in search_dirs:
        for name in preferred:
            p = Path(d) / name
            if p.exists():
                return p
    return None


def register_menu_font(font_path: Path = None):
    # Try to register a UTF-8-capable TTF font for proper diacritics
    # We register up to two font names: MenuFont (regular) and MenuFont-Bold if bold available
    if font_path and font_path.exists():
        try:
            pdfmetrics.registerFont(TTFont("MenuFont", str(font_path)))
            # naive bold name handling
            bold_path = None
            if str(font_path).lower().endswith(".ttf"):
                bold_path = str(font_path).replace('.ttf', ' Bold.ttf')
                if Path(bold_path).exists():
                    pdfmetrics.registerFont(TTFont("MenuFont-Bold", bold_path))
            return True
        except Exception:
            return False

    # Try common font families
    candidates = [
        "DejaVuSans.ttf",
        "DejaVuSans.ttf",
        "LiberationSans-Regular.ttf",
        "NotoSans-Regular.ttf",
        "Arial Unicode.ttf",
        "ArialUnicodeMS.ttf",
    ]
    found = find_font_path(candidates)
    if found:
        try:
            pdfmetrics.registerFont(TTFont("MenuFont", str(found)))
            return True
        except Exception:
            return False
    return False


def generate_pdf(hrana, drinks, pizza, out_path: Path, font_path: str = None):
    c = canvas.Canvas(str(out_path), pagesize=A4)

    # register font if possible
    registered = False
    if font_path:
        registered = register_menu_font(Path(font_path))
    else:
        registered = register_menu_font()

    margin = 18 * mm
    gutter = 12 * mm  # wider gutter to avoid overlap between columns
    col_width = (A4[0] - 2 * margin - gutter) / 2
    top_y = A4[1] - 36 * mm  # slightly lower top to leave header breathing room
    bottom_margin = 26 * mm  # increase bottom margin to avoid footer overlap

    def new_page():
        c.showPage()
        setup_page(c)
        return top_y

    # start first page
    setup_page(c)
    cur_x = margin
    cur_y = top_y
    col = 0

    sections = [("Hrana", hrana), ("Drinks", drinks), ("Pizza", pizza)]

    title_font = "MenuFont-Bold" if "MenuFont-Bold" in pdfmetrics.getRegisteredFontNames() else ("MenuFont" if "MenuFont" in pdfmetrics.getRegisteredFontNames() else "Helvetica-Bold")
    item_font = "MenuFont" if "MenuFont" in pdfmetrics.getRegisteredFontNames() else "Helvetica"

    for section_title, section_data in sections:
        # draw section header
        c.setFont(title_font, 16)
        c.setFillColor(colors.darkblue)
        if cur_y < bottom_margin + 40:
            cur_y = new_page()
            col = 0; cur_x = margin
        c.drawString(cur_x, cur_y, section_title)
        cur_y -= 12 * mm  # add extra space after section header

        for category in section_data:
            # category title
            if cur_y < bottom_margin + 36:
                if col == 0:
                    # move to second column with a little top offset so header doesn't clash
                    col = 1
                    cur_x = margin + col * (col_width + gutter)
                    cur_y = top_y - 6 * mm
                else:
                    cur_y = new_page(); col = 0; cur_x = margin
            c.setFont(title_font, 12)
            c.setFillColor(colors.black)
            c.drawString(cur_x, cur_y, category.get("name", ""))
            cur_y -= 5 * mm

            c.setFont(item_font, 10)
            for item in category.get("content", []):
                # check available vertical space, move to next column/page if needed
                if cur_y < bottom_margin + 28:
                    if col == 0:
                        col = 1
                        cur_x = margin + col * (col_width + gutter)
                        cur_y = top_y - 6 * mm
                    else:
                        cur_y = new_page(); col = 0; cur_x = margin

                name = item.get("name", "")
                price = item.get("price", "")
                kol = item.get("kol", "")
                jumbo = item.get("jumbo", "")

                c.setFont(item_font, 10)
                c.setFillColor(colors.black)
                c.drawString(cur_x + 2*mm, cur_y, name)
                c.drawRightString(cur_x + col_width - 2*mm, cur_y, price)
                cur_y -= 6 * mm  # increase item line spacing to avoid overlap
                extras = []
                if kol: extras.append(kol)
                if jumbo: extras.append(jumbo)
                if extras:
                    c.setFont(item_font, 9)
                    c.setFillColor(colors.grey)
                    c.drawString(cur_x + 5*mm, cur_y, " ".join(extras))
                    cur_y -= 5 * mm

            cur_y -= 6 * mm  # extra gap after category

        cur_y -= 6 * mm

    c.save()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", default="src/data", help="Path to data directory (default: src/data)")
    parser.add_argument("--out", default="menu.pdf", help="Output PDF file (default: menu.pdf)")
    args = parser.parse_args()

    base = Path(__file__).resolve().parents[1]
    data_dir = (base / args.data_dir).resolve()

    hrana_path = data_dir / "hrana.js"
    drinks_path = data_dir / "drinks.js"
    pizza_path = data_dir / "pizzaData.js"

    if not hrana_path.exists() or not drinks_path.exists() or not pizza_path.exists():
        print("One or more data files missing in:", data_dir)
        print("Expected: hrana.js, drinks.js, pizzaData.js")
        return

    hrana = load_js_data(hrana_path)
    drinks = load_js_data(drinks_path)
    pizza = load_js_data(pizza_path)

    out_path = Path(args.out).resolve()
    generate_pdf(hrana, drinks, pizza, out_path)
    print(f"PDF written to {out_path}")


if __name__ == "__main__":
    main()
