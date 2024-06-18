import json
import pdfkit
from pypdf import PdfReader, PdfWriter

from html_style import HtmlStyle
from io import BytesIO
import os
import sys

hs = HtmlStyle()


def unisci_pdf(byts: list, output_path: str):
    output = PdfWriter()
    for bt in byts:
        reader = PdfReader(BytesIO(bt))
        for page_num in range(len(reader.pages)):
            output.add_page(reader.pages[page_num])
    with open(output_path, "wb") as output_stream:
        output.write(output_stream)


def genera_pdf_da_html(html):
    c = 1
    try:
        c = pdfkit.from_string(html, False)
    except Exception as e:
        print(e)
    return c


def genera_libretto_diario(id_tirocinio, data):

    dir = os.path.dirname(os.path.abspath(__file__))
    out = os.sep + os.path.join(*dir.split(os.sep)[:-2], "allegati", "tirocini", str(id_tirocinio), "libretto_diario", f"{id_tirocinio}.pdf")
    unisci_pdf([
        genera_pdf_da_html(hs.get_html_page_1(data)),
        genera_pdf_da_html(hs.get_html_page_2(data)),
        genera_pdf_da_html(hs.get_html_page_3(data))
    ], out)


if __name__ == "__main__":

    input_json = sys.stdin.read()
    data = json.loads(input_json)

    genera_libretto_diario(data['idTirocinio'], data)
