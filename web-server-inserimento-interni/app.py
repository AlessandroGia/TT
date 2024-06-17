from flask import Flask, request, jsonify, session, redirect, url_for, render_template_string
from flask_session import Session
import hashlib
import json
import requests

app = Flask(__name__)

# Configurazione delle sessioni
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Hash semplice della password per l'esempio
hashed_password = hashlib.sha256('pass'.encode()).hexdigest()

@app.route('/')
def index():
    if 'user' in session:
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
    username = request.form['username']
    password = request.form['password']
    json_data = json.dumps({'nomeUtente': username, 'password': password})
    print("username:", username)
    print("password", password)
    print("data:", json_data)

    try:

        response = requests.post('http://ttbackend:8080/api/v1/login/admin', data=json_data, headers={"Content-Type": "application/json"})
        print("..",  response.status_code)
    except Exception as e:


    if username == 'admin' and hashlib.sha256(password.encode()).hexdigest() == hashed_password:
        session['user'] = username
        return redirect(url_for('index'))
    else:
        error_message = "Login non valido"
        return login_page(error=error_message)

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))

@app.route('/submit', methods=['POST'])
def submit():
    if 'user' in session:
        username = request.form['username']
        nome = request.form['firstname']
        cognome = request.form['lastname']
        password = request.form['password']

        if not re.match(r"^[a-zA-Z]\.[a-zA-Z0-9]{1,10}$", username):
            error_message = "Formato nome utente non valido (es: 'm.rossi' o 'm.rossi1')"
            return user_page(error=error_message, nome=nome, cognome=cognome, nomeUtente=username, password=password)
        
        data = {
            'nome': nome,
            'cognome': cognome,
            'nomeUtente': username,
            'password': password
        }

        requests.post(
            'http://ttbackend:8080/api/v1/utente/admin/nuovo',
            data=data
        )
    return 'Non autorizzato', 403

if __name__ == '__main__':
    app.run(debug=True)
