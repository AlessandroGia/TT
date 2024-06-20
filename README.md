
# TT (Tesi & Tirocini)

Questo progetto è un'applicazione full-stack costruita con un frontend Ionic/Angular e un backend Spring Boot, il tutto containerizzato usando Docker. Il frontend è progettato per funzionare su entrambe le piattaforme iOS e Android, mentre il backend è un server API robusto.

L'applicazione si occupa della gestione di tesi e tirocini per l'[Università degli Studi del Molise](https://www3.unimol.it), consentendo l'interazione e lo scambio di materiali e documenti tra docenti, studenti e eventuali collaboratori.


## Indice

- [Prerequisiti](#prerequisiti)
- [Installazione](#installazione)
- [Configurazione del Backend](#configurazione-del-backend)
- [Configurazione del Frontend](#configurazione-del-frontend)
  - [Build per iOS](#build-per-ios)
  - [Build per Android](#build-per-android)
- [Uso](#uso)
- [Contributi](#contributi)

## Prerequisiti

Prima di iniziare, assicurati di aver soddisfatto i seguenti requisiti:

- **Docker**: [Installa Docker](https://docs.docker.com/get-docker/)
- **Node.js & npm**: [Installa Node.js e npm](https://nodejs.org/)
- **Ionic CLI**: Installa Ionic CLI globalmente usando npm
  ```sh
  npm install -g @ionic/cli
  ```
- **Android Studio** (per build Android): [Installa Android Studio](https://developer.android.com/studio)
- **Xcode** (per build iOS): [Installa Xcode](https://developer.apple.com/xcode/)

## Installazione

Clona questo repository sulla tua macchina locale:

```sh
git clone https://github.com/AlessandroGia/TT.git
cd TT
```

## Configurazione del Backend

Il backend è un'applicazione Spring Boot che può essere eseguita utilizzando Docker.

1. Naviga nella directory del backend:

    ```sh
    cd Backend_TT
    ```
    
2. Crea un file .env con questo contenuto:
    ```sh
    MARIADB_DATABASE="tt"
    MARIADB_USER="tt"
    MARIADB_PASSWORD="tt"
    MARIADB_ROOT_PASSWORD="tt"
    ```

3. Costruisci e avvia il backend usando Docker Compose:

    ```sh
    docker-compose up --build
    ```

Questo comando costruirà le immagini Docker e avvierà i container. Il backend sarà disponibile su `http://{TUO_INDIRIZZO_IP}:8080`.

## Configurazione del Frontend

Il frontend è un'applicazione Ionic/Angular.

1. Naviga nella directory del frontend:

    ```sh
    cd Frontend_TT
    ```

2. Installa le dipendenze necessarie:

    ```sh
    npm install
    ```

### Build per iOS

1. Aggiungi la piattaforma iOS:

    ```sh
    ionic capacitor add ios
    ```

2. Esegui la build in Xcode:

    ```sh
    ionic cap build ios
    ```


### Build per Android

1. Aggiungi la piattaforma Android:

    ```sh
    ionic capacitor add android
    ```

2. Esegui la build in Android Studio:

    ```sh
    ionic cap build android
    ```


## Uso

Dopo aver configurato sia il backend che il frontend, puoi iniziare a utilizzare l'applicazione.

- L'API del backend sarà in esecuzione su `http://{TUO_INDIRIZZO_IP}:8080`.
- Il frontend può essere testato utilizzando un emulatore o un dispositivo reale tramite Xcode o Android Studio.
- Prima dell'utilizzo, assicurarsi che in Frontend_TT/src/app/services/api/api-service.service.ts le variabili ip e porta siano avvalorate con il corretto indirizzo del backend.
- La Web App per il direttore sarà in esecuzione su `http://{TUO_INDIRIZZO_IP}:5050`.
- Phpmyadmin sarà in esecuzione su `http://{TUO_INDIRIZZO_IP}:8090`.

## Team di Realizzazione

Il progetto è stato realizzato da:

1. **Alessandro Giacento**
   - Ruolo: Frontend
   - [Mail](mailto:a.giacento@studenti.unimol.it)

2. **Maria Laura Di Lello**
   - Ruolo: Frontend
   - [Mail](mailto:m.dilello@studenti.unimol.it)

3. **Robero Casale**
   - Ruolo: Backend
   - [Mail](mailto:r.casale1@studenti.unimol.it)

4. **Leonardo Prioriello**
   - Ruolo: Backend
   - [Mail](mailto:l.prioriello@studenti.unimol.it)

## Contributi

I contributi sono benvenuti! Si prega di forkare questo repository e inviare una pull request per qualsiasi miglioramento.
