import textwrap


class HtmlStyle:
    def __init__(self):
        self.__style = """
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 0;
                }
                table {
                    width: 100%;
                    max-width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    table-layout: fixed;
                }
                th, td {
                    border: 1px solid #000;
                    padding: 10px;
                    text-align: center;
                    word-break: break-all;
                    white-space: normal;
                }
                th {
                    background-color: #e0e0e0;
                }
                .custom {
                    min-width: 100px;
                }
                .custom2 {
                    min-width: 90px;
                }
                .custom3 {
                    min-width: 70px;
                }
                .container {
                    max-width: 800px;
                    margin: 50px auto;
                    padding: 30px;
                }
                .container-table {
                    text-align: center;
                    width: 100%;
                    max-width: 900px;
                    margin: auto;
                    padding: 20px;
                }
                .header, .footer {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .header img {
                    width: 100px;
                    margin-bottom: 10px;
                }
                .header h1, .header h2 {
                    margin: 5px 0;
                }
                .form-section {
                    margin: 20px 0;
                    margin-left: 20px;
                    margin-right: 20px;
                }
                .form-group-row {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    margin-bottom: 15px;
                }
                .form-group {
                    flex: 1;
                    min-width: 48%;
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                    font-size: 1.1em;
                    color: #333;
                }
                .form-group .line {
                    border-bottom: 1px solid #333;
                    padding-bottom: 5px;
                    font-size: 1em;
                    color: #333;
                }
                .split {
                    border-top: 2px solid #000;
                    margin-top: 30px;
                    padding-top: 20px;
                }
                .signature-section {
                    text-align: center;
                    margin-top: 40px;
                    margin-left: 10px;
                    margin-right: 10px;
                }
                .signature-section p {
                    font-size: 1.1em;
                }
                .signature-section p span {
                    display: inline-block;
                    width: 300px;
                    border-bottom: 1px solid #000;
                    margin-left: 10px;
                }
                .footer p {
                    font-size: 0.9em;
                    color: #666;
                }
        
                .content-section {
                    margin: 20px 0;
                }
                .content-section h2 {
                    text-align: center;
                    font-size: 1.5em;
                    margin-bottom: 20px;
                    letter-spacing: 0.05em;
                }
                .content-section p {
                    font-size: 1em;
                    line-height: 1.5;
                    text-align: justify;
                    margin-bottom: 20px;
                    letter-spacing: 0.03em;
                }
                .annotation-section {
                    margin-top: 40px;
                }
                .annotation-section h3 {
                    text-align: center;
                    font-size: 1.2em;
                    margin-bottom: 10px;
                    letter-spacing: 0.05em;
                }
                .lines {
                    margin: 10px 0;
                }
                .line {
                    margin-bottom: 10px;
                    border-bottom: 1px solid #000;
                    height: 1.5em;
                    width: 100%;
                }
        
                @media (max-width: 768px) {
                    .form-group {
                        min-width: 100%;
                    }
                }
            </style>
        """

    def __formatta_stringa(self, st: str) -> str:
        return st.encode('ascii', 'xmlcharrefreplace').decode()

    def get_html_page_1(self, data):
        return self.__formatta_stringa(f"""
        <!DOCTYPE html>
        <html lang="it">
            <head>
                <title>Progetto Formativo di Tirocinio - UNIMOL</title>
                {self.__style}
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://www.unimol.it/wp-content/uploads/2014/06/logo-unimol-retin.png" alt="Logo Unimol"/>
                        <h1>UNIVERSITÀ DEGLI STUDI DEL MOLISE</h1>
                        <h2>Progetto Formativo di Tirocinio</h2>
                    </div>
            
                    <div class="form-section">
                        <div class="form-group">
                            <label for="nomeDipartimento">Dipartimento:</label>
                            <div class="line" id="nomeDipartimento">{data["nomeDipartimento"]}</div>
                        </div>
                        <br>
                        <div class="form-group">
                            <label for="nomeCDS">Corso di Studio:</label>
                            <div class="line" id="nomeCDS">{data["nomeCDS"]}</div>
                        </div>
                        <br>
                        <div class="form-group">
                            <label for="nomeCognomeStudente">Nome e Cognome:</label>
                            <div class="line" id="nomeCognomeStudente">{data["nomeCognomeStudente"]}</div>
                        </div>
                        <br>
                        <div class="form-group">
                            <label for="nomeLaboratorio">Nome del Laboratorio:</label>
                            <div class="line" id="nomeLaboratorio">{data["nomeLaboratorio"]}</div>
                        </div>
                        <div class="form-group">
                            <label for="luogoLaboratorio">Luogo del Laboratorio:</label>
                            <div class="line" id="luogoLaboratorio">{data["luogoLaboratorio"]}</div>
                        </div>
                        <br>
                        <div class="form-group">
                            <label for="dataApprovProgForm">Data di Approvazione del Progetto Formativo:</label>
                            <div class="line" id="dataApprovProgForm">{data["dataApprovProgForm"]}</div>
                        </div>
                        <br>
                        <div class="form-group">
                            <label for="tutor">Tutor Aziendale:</label>
                            <div class="line" id="tutor">{data["tutor"]}</div>
                        </div>
                        <div class="form-group">
                            <label for="tutorUniversitario">Tutor Universitario:</label>
                            <div class="line" id="tutorUniversitario">{data["tutorUniversitario"]}</div>
                        </div>
                        <br>
                        <div class="form-group">
                            <label for="dataInizio">Data di Inizio:</label>
                            <div class="line" id="dataInizio">{data["dataInizio"]}</div>
                        </div>
                        <div class="form-group">
                            <label for="dataFine">Data di Fine:</label>
                            <div class="line" id="dataFine">{data["dataFine"]}</div>
                        </div>
                        <p>*Da compilarsi ai sensi dell’art. 6, alinea 6 del 2° comma e dell’art.7 del Regolamento di Ateneo per la disciplina delle attività di tirocinio e di stage</p>
                    </div>
                </div>
            </body>
        </html>
    """)

    def get_html_page_2(self, data):

        attivita = ""
        for att in data['elencoAttivita']:
            attivita += "<tr>"
            attivita += f"<td>{att['data']}</td>"
            attivita += f"<td>{att['orarioEntrata']}</td>"
            attivita += f"<td>{att['orarioUscita']}</td>"
            attivita += f"<td>{att['attivitaSvolta']}</td>"
            attivita += "<td></td>"
            attivita += "<td></td>"
            attivita += "</tr>"

        return self.__formatta_stringa(f"""
            <!DOCTYPE html>
            <html lang="it">
                <head>
                    <title>Progetto Formativo di Tirocinio - UNIMOL</title>
                    {self.__style}
                </head>
                <body>
                    <div class="container-table">
                        <h1>Registro Attività Tirocinio</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th class="custom2">Data</th>
                                    <th class="custom3">Entrata</th>
                                    <th class="custom3">Uscita</th>
                                    <th>Attività svolta</th>
                                    <th class="custom">Firma Tirocinante</th>
                                    <th class="custom">Firma Tutor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {attivita}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </body>
            </html>
        """)

    def get_html_page_3(self, data):
        annotazioni = "".join([f"<div class='line'>{annotazione}</div>" for annotazione in textwrap.wrap(data["annotazioni"], width=108)])

        return self.__formatta_stringa(f"""
            <!DOCTYPE html>
            <html lang="it">
                <head>
                    <title>Progetto Formativo di Tirocinio - UNIMOL</title>
                    {self.__style}
                </head>
                <body>
                    <div class="container">
                        <div class="content-section">
                            <h2>Nota Bene</h2>
                            <p>
                                In caso di assenza per malattia o di interruzioni per motivati impedimenti, il tirocinante è tenuto ad avvertire il Tutor universitario ed il Tutor della struttura ospitante, con i quali concordare le modalità di recupero delle ore di assenza. Lo stagista, invece, è tenuto esclusivamente ad avvertire il Tutor universitario ed il Tutor della struttura ospitante.
                            </p>
                            <p>
                                Il Tutor della struttura ospitante segue “in loco” il tirocinante verificandone la presenza e l’attività presso la struttura ospitante.
                            </p>
                            <p>
                                Il Tutor della struttura ospitante si impegna a sovrintendere all’addestramento del tirocinante all’esercizio delle attività pratiche concordate con il Tutor universitario ed indicate nel progetto formativo individuale.
                            </p>
                            <p>
                                L’eventuale sospensione delle attività di tirocinio o di stage dovrà essere annotata sul libretto-diario e comunicata al Tutor della struttura ospitante e al Tutor aziendale.
                            </p>
                        </div>
                
                        <div class="annotation-section">
                            <h3>ANNOTAZIONI</h3>
                            <div class="lines">
                                {annotazioni}
                            </div>
                        </div>
                    </div>
            
                    <div class="footer">
                        <p>UNIVERSITÀ DEGLI STUDI DEL MOLISE - Via Francesco De Sanctis, 86100 Campobasso, Italia</p>
                    </div>
                </body>
            </html>
        """)
