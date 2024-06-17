# Utilizza un'immagine di base di Python
FROM python:3.9-slim

# Imposta una directory di lavoro
WORKDIR /app

# Copia i file necessari nel container
COPY . /app

# Installa le dipendenze
RUN pip install flask flask_session

# Espone la porta 5000
EXPOSE 5000

# Esegue l'applicazione
CMD ["flask", "run", "--host=0.0.0.0"]