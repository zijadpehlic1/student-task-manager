# Student Task Manager

## 1. Naziv Projekta

**Student Task Manager**

GitHub repozitorij: <https://github.com/zijadpehlic1/student-task-manager>

## 2. Opis Projekta

Student Task Manager je web aplikacija za organizaciju studentskih zadataka, rokova i prioriteta. Aplikacija omogućava jednostavno praćenje obaveza kroz pregled zadataka, dodavanje novih zadataka, uređivanje postojećih zadataka, filtriranje i prikaz statistike.

Projekat je izrađen za predmet **Operativni sistemi i računarstvo u oblaku**.

## 3. Uradio

| Ime i prezime | Doprinos |
| --- | --- |
| Zijad Pehlic | Frontend implementacija, backend implementacija, Docker konfiguracija, Docker Compose, health-check skripta, podešavanje GitHub repozitorija, priprema Google Cloud Run deploymenta i deployment dokumentacija |

## 4. Korištene Tehnologije

- React
- Vite
- CSS
- json-server
- Node.js
- Docker
- Docker Compose
- nginx
- Google Cloud Run
- Artifact Registry
- GitHub
- GitHub Actions

## 5. Arhitektura Aplikacije

Aplikacija se sastoji od dva glavna dijela:

- `frontend/` - React/Vite aplikacija za korisnički interfejs
- `backend/` - json-server backend koji simulira REST API i izlaže `/tasks` endpoint

U lokalnom Docker Compose okruženju frontend i backend se pokreću kao odvojeni servisi. Frontend se servira kroz nginx na portu `8080`, a nginx može proslijediti `/api` zahtjeve prema backend servisu.

Na Google Cloud Run deploymentu frontend se builda sa `VITE_API_URL` vrijednošću koja pokazuje na deployment backend servisa. Time frontend direktno koristi javni backend URL.

```text
+------------------------+          HTTP          +-------------------------+
| React/Vite frontend    | ---------------------> | json-server backend     |
| nginx, port 8080       |                        | /tasks, port 3001       |
+------------------------+                        +-------------------------+
          |                                                   |
          | Docker Compose: /api proxy                        | db.json
          v                                                   v
+--------------------------------------------------------------------------+
| Lokalno: frontend + backend servisi, named Docker volume za db.json       |
| Cloud Run: odvojeni frontend i backend servisi sa javnim URL adresama     |
+--------------------------------------------------------------------------+
```

## 6. Funkcionalnosti Aplikacije

- Mock prijava
- Pregled zadataka
- Dodavanje zadatka
- Uređivanje zadatka
- Brisanje zadatka
- Označavanje zadatka kao završen ili nezavršen
- Filtriranje zadataka
- Dashboard/statistika
- Responsive UI

## 7. Lokalno Pokretanje Bez Dockera

Backend:

```bash
cd backend
npm install
npm start
```

Backend lokalni URL:

```text
http://localhost:3001/tasks
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend lokalni URL:

```text
http://localhost:5173
```

## 8. Pokretanje Pomoću Dockera

Pokretanje aplikacije pomoću Docker Compose:

```bash
docker compose up --build
```

Docker URL adrese:

```text
Frontend: http://localhost:8080
Backend:  http://localhost:3001/tasks
```

Zaustavljanje kontejnera:

```bash
docker compose down
```

## 9. Docker Konfiguracija

Backend Dockerfile:

- koristi `node:18-alpine`
- instalira backend dependency-je
- kopira početni `db.json` kao seed fajl
- pokreće json-server na portu `3001`
- koristi persistent lokaciju `/data/db.json` u Docker okruženju

Frontend Dockerfile:

- koristi multi-stage build
- koristi Node.js za build React/Vite aplikacije
- koristi `nginx:alpine` za serviranje produkcijskog builda
- kopira `frontend/nginx.conf`
- izlaže port `8080`
- podržava build argument `VITE_API_URL`

## 10. Docker Compose i Persistencija

`docker-compose.yml` pokreće frontend i backend kao odvojene servise. Frontend servis zavisi od backend servisa i dostupan je na portu `8080`, dok je backend dostupan na portu `3001`.

Backend koristi named Docker volume za persistenciju `db.json` fajla:

```text
backend-db-data:/data
```

Početni `db.json` seed se kopira u persistent lokaciju samo ako `/data/db.json` još ne postoji. Na taj način se lokalni Docker podaci ne prepisuju pri ponovnom pokretanju kontejnera.

## 11. Health-check Skripta

Health-check skripta provjerava:

- frontend URL
- backend `/tasks` endpoint

Lokalna Docker provjera:

```bash
sh scripts/health-check.sh http://localhost:8080 http://localhost:3001
```

Online provjera deploymenta:

```bash
sh scripts/health-check.sh https://student-task-manager-frontend-427616264825.europe-west1.run.app https://student-task-manager-backend-427616264825.europe-west1.run.app
```

## 12. Google Cloud Deployment

Deployment je urađen na Google Cloud Run.

```text
Project ID: student-task-manager-zp-gmail
Region: europe-west1
Artifact Registry repository: student-task-manager-repo
Backend service: student-task-manager-backend
Frontend service: student-task-manager-frontend
Backend URL: https://student-task-manager-backend-427616264825.europe-west1.run.app
Backend /tasks endpoint: https://student-task-manager-backend-427616264825.europe-west1.run.app/tasks
Frontend URL: https://student-task-manager-frontend-427616264825.europe-west1.run.app
```

Deployment tok:

1. Omogućeni su Cloud Run, Artifact Registry i Cloud Build API servisi.
2. Kreiran je Artifact Registry Docker repozitorij.
3. Docker autentifikacija je podešena pomoću `gcloud`.
4. Backend image je buildan lokalno.
5. Backend image je push-an u Artifact Registry.
6. Backend je deployan na Cloud Run.
7. Frontend image je buildan sa `VITE_API_URL` vrijednošću postavljenom na backend Cloud Run URL.
8. Frontend image je push-an u Artifact Registry.
9. Frontend je deployan na Cloud Run.

## 13. Glavne Deployment Komande

Primjer komandi za Windows Command Prompt:

```bat
set PROJECT_ID=student-task-manager-zp-gmail
set REGION=europe-west1
set REPOSITORY=student-task-manager-repo
set BACKEND_SERVICE=student-task-manager-backend
set FRONTEND_SERVICE=student-task-manager-frontend
set BACKEND_URL=https://student-task-manager-backend-427616264825.europe-west1.run.app

gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com

gcloud artifacts repositories create %REPOSITORY% --repository-format=docker --location=%REGION% --description="Docker repository for Student Task Manager"

gcloud auth configure-docker %REGION%-docker.pkg.dev

docker build -t %REGION%-docker.pkg.dev/%PROJECT_ID%/%REPOSITORY%/backend:latest ./backend

docker push %REGION%-docker.pkg.dev/%PROJECT_ID%/%REPOSITORY%/backend:latest

gcloud run deploy %BACKEND_SERVICE% --image %REGION%-docker.pkg.dev/%PROJECT_ID%/%REPOSITORY%/backend:latest --region %REGION% --platform managed --allow-unauthenticated --port 3001

docker build --build-arg VITE_API_URL=%BACKEND_URL% -t %REGION%-docker.pkg.dev/%PROJECT_ID%/%REPOSITORY%/frontend:latest ./frontend

docker push %REGION%-docker.pkg.dev/%PROJECT_ID%/%REPOSITORY%/frontend:latest

gcloud run deploy %FRONTEND_SERVICE% --image %REGION%-docker.pkg.dev/%PROJECT_ID%/%REPOSITORY%/frontend:latest --region %REGION% --platform managed --allow-unauthenticated --port 8080
```

## 14. GitHub Actions

Workflow za CI/CD pripremu nalazi se u:

```text
.github/workflows/deploy.yml
```

Workflow je pripremljen da builda Docker image-e, push-a ih u Artifact Registry i deploya frontend i backend servise na Cloud Run.

Potrebni GitHub Secrets:

```text
GCP_PROJECT_ID
GCP_REGION
GCP_SERVICE_ACCOUNT_KEY
ARTIFACT_REGISTRY_REPOSITORY
```

Manualni deployment je uspješno završen, a GitHub Actions workflow je uključen kao priprema za CI/CD proces.

## 15. Napomena o Bazi Podataka

U projektu se koristi json-server kao jednostavna simulacija backend/API servisa za potrebe kursnog projekta.

U lokalnom Docker okruženju persistencija podataka je riješena pomoću named Docker volume-a. Na Google Cloud Run okruženju container filesystem nije namijenjen kao produkcijska baza podataka. Za stvarnu produkcijsku aplikaciju bilo bi potrebno koristiti managed bazu podataka.

## 16. Refleksija

Tokom izrade projekta naučeno je kako se frontend i backend odvajaju u zasebne servise, kako se pišu Dockerfile konfiguracije i kako se koristi Docker Compose za lokalno pokretanje više servisa.

Također je naučeno kako se koriste Artifact Registry i Google Cloud Run za deployment kontejnerskih aplikacija. Jedan od glavnih izazova bio je pravilno povezivanje frontend i backend dijela u lokalnom Docker okruženju i u Cloud Run deploymentu.

Moguća unapređenja uključuju stvarnu autentifikaciju, korištenje prave baze podataka i dodatne testove za stabilniji razvojni proces.
