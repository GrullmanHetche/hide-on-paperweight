"""Prepare faithful PDF page images and a still GIF preview; keep originals intact.
Run with the bundled Python (Pillow + pypdfium2), passing each source asset.
Output a JSON manifest for the content entry. No browser PDF library is needed.
"""
import json
import sys
from pathlib import Path
from PIL import Image
import pypdfium2 as pdfium

root = Path(__file__).resolve().parents[1]

def prepare(path):
    path = Path(path)
    folder = root / 'public' / 'borrowed' / path.stem
    folder.mkdir(parents=True, exist_ok=True)
    if path.suffix.lower() == '.pdf':
        document = pdfium.PdfDocument(str(path))
        pages = []
        for index in range(len(document)):
            page = document[index]
            width, height = page.get_size()
            bitmap = page.render(scale=1800 / width)
            image = bitmap.to_pil()
            filename = f'page-{index + 1}.webp'
            image.save(folder / filename, quality=95)
            textpage = page.get_textpage()
            text = textpage.get_text_range()
            textpage.close()
            pages.append(dict(file=f'/borrowed/{path.stem}/{filename}', width=image.width, height=image.height, text=text))
            bitmap.close()
            page.close()
        document.close()
        return dict(width=pages[0]['width'], height=pages[0]['height'], pages=pages)
    with Image.open(path) as image:
        result = dict(width=image.width, height=image.height)
        if path.suffix.lower() == '.gif':
            image.seek(0)
            image.convert('RGBA').save(folder / 'still.png')
            result['still'] = f'/borrowed/{path.stem}/still.png'
        return result

if __name__ == '__main__':
    print(json.dumps({Path(path).stem: prepare(path) for path in sys.argv[1:]}, ensure_ascii=False, indent=2))
