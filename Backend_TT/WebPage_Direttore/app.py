from flask import Flask, request, jsonify, session, redirect, url_for, render_template_string
from flask_session import Session
import re
import requests
import json

app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


@app.route('/')
def index():
    if 'jwt' in session:
        return user_page()
    return login_page()

def user_page(error=None, success=None, nome='', cognome='', nomeUtente='', password=''):
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Invio Dati</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #002F6C; color: white; text-align: center; padding: 50px; }
            input, button { margin: 10px; padding: 10px; width: 200px; }
            button { background-color: #FFC72C; color: black; border: none; cursor: pointer; }
            .error { color: red; }
            img { margin-bottom: 20px; width: 10%; }
        </style>
    </head>
    <body>
        <img src="/static/logo.png" alt="Logo">
        <h1>TESI & TIROCINI</h1>
        <h2>Inserimento interni</h2>
        <form action="/submit" method="post">
            <input type="text" id="firstname" name="firstname" placeholder="Nome" required value="{{ nome }}">
            <br>
            <input type="text" id="lastname" name="lastname" placeholder="Cognome" required value="{{ cognome }}">
            <br>
            <input type="text" id="username" name="username" placeholder="Nome Utente (es: 'm.rossi1')" required value="{{ nomeUtente }}">
            <br>
            <input type="password" id="password" name="password" placeholder="Password" required value="{{ password }}">
            <br>
            <button type="submit">Invia</button>
            <button type="button" onclick="window.location.href='/logout'">Esci</button>
        </form>
        {% if error %}
            <p class="error">{{ error }}</p>
        {% endif %}
        {% if success %}
            <p class="success">{{ success }}</p>
        {% endif %}
    </body>
    </html>
    """, error=error, nome=nome, cognome=cognome, nomeUtente=nomeUtente, password=password)

def login_page(error=None):
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Login</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #002F6C; color: white; text-align: center; padding: 50px; }
            input { margin: 10px; padding: 10px; width: 200px; }
            button { background-color: #FFC72C; color: black; border: none; padding: 10px 20px; margin: 10px; cursor: pointer; }
            .error { color: red; }
            img { margin-bottom: 20px; width: 10%; }
        </style>
    </head>
    <body>
        <img src="/static/logo.png" alt="Logo">
        <h1>TESI & TIROCINI</h1>
        <h2>LOGIN ADMIN</h2>
        <h2>Inserimento utenti interni</h2>
        <form method="post" action="/login">
            <div>*credenziali dell'admin</div>
            <input type="text" id="username" name="username" placeholder="nome utente" required>
            <input type="password" id="password" name="password" placeholder="password" required>
            <button type="submit">ACCEDI</button>
        </form>
        {% if error %}
            <p class="error">{{ error }}</p>
        {% endif %}
    </body>
    </html>
    """, error=error)

@app.route('/login', methods=['POST'])
def login():
    json_data = json.dumps(
        {
            'nomeUtente': request.form['username'],
             'password': request.form['password']
        }
    )

    try:
        response = requests.post('http://ttbackend:8080/api/v1/login/admin', data=json_data, headers={"Content-Type": "application/json"})
    except Exception as e:
        return login_page(error="Errore di rete")

    if response.status_code == 200:
        session['jwt'] = response.text
        return redirect(url_for('index'))
    elif response.status_code == 401:
        return login_page(error="Credenziali errate")
    elif response.status_code == 403:
        return login_page(error="Non autorizzato")
    else:
        return login_page(error="Errore sconosciuto")


@app.route('/logout')
def logout():
    session.pop('jwt', None)
    return redirect(url_for('index'))

@app.route('/submit', methods=['POST'])
def submit():
    if 'jwt' in session:

        username = request.form['username']
        if not re.match(r"^[a-zA-Z]\.[a-zA-Z0-9]{1,10}$", username):
            return user_page(error="Formato nome utente non valido (es: 'm.rossi' o 'm.rossi1')", nome=nome, cognome=cognome, nomeUtente=username, password=password)

        json_data = json.dumps(
            {
                'nome': request.form['firstname'],
                'cognome': request.form['lastname'],
                'nomeUtente': username,
                'password': request.form['password']
            }
        )

        try:
            response = requests.post('http://ttbackend:8080/api/v1/utente/admin/nuovo', data=json_data, headers={"Content-Type": "application/json", "Authorization": f"Bearer {session['jwt']}"})
        except Exception as e:
            return login_page(error="Errore di rete")

        if response.status_code == 200:
            return user_page(success="Utente inserito correttamente")
        elif response.status_code == 401:
            return login_page(error="Credenziali errate")
        elif response.status_code == 403:
            return login_page(error="Non autorizzato")
        else:
            return login_page(error="Errore sconosciuto")

    return login_page(error="Non autorizzato")

if __name__ == '__main__':
    app.run(debug=True)
