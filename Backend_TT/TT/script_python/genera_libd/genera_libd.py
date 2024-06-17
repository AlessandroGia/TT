import pdfkit
from pypdf import PdfReader, PdfWriter
from html_style import HtmlStyle
from io import BytesIO

hs = HtmlStyle()


def unisci_pdf(bestia: list, output_path: str):
    output = PdfWriter()
    for bt in bestia:
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
        print("a")
    return c


def genera_libretto_diario(output_path, data):

    unisci_pdf([
        genera_pdf_da_html(hs.get_html_page_1(data)),
        genera_pdf_da_html(hs.get_html_page_2(data)),
        genera_pdf_da_html(hs.get_html_page_3(data))
    ], output_path)


if __name__ == "__main__":
    data = {
        "output_path": "prova.pdf",
        "nomeDipartimento": "Bioscienze e Territorio",
        "nomeCDS": "Informatica",
        "nomeCognomeStudente": "Mario Rossi",
        "nomeLaboratorio": "Laboratorio di Informatica",
        "luogoLaboratorio": "Roma",
        "dataApprovProgForm": "2024-01-01",
        "tutor": "Prof. Giovanni Verdi",
        "tutorUniversitario": "Prof.ssa Anna Bianchi",
        "dataInizio": "2024-01-15",
        "dataFine": "2024-06-15",
        "elencoAttivita": [
            {
                "data": "2024-01-16",
                "orarioEntrata": "09:00",
                "orarioUscita": "12:00",
                "attivitaSvolta": "ciao... mi manchi."
            },
            {
                "data": "2024-01-17",
                "orarioEntrata": "10:00",
                "orarioUscita": "13:00",
                "attivitaSvolta": "Studio delle Attività tecnologie dhawjgdhjagdhja dadvahjgdadvhjaghjda sdadhjgahjgdhad adhajwgdaujyfgkda"
            },
            {
                "data": "2024-01-18",
                "orarioEntrata": "11:00",
                "orarioUscita": "14:00",
                "attivitaSvolta": "Sviluppo Attività di un progetto"
            }
        ],
        "annotazioni": "Tirocinio svolto con impegno e dedizione."
    }

    genera_libretto_diario("Leonardus.pdf", data)
