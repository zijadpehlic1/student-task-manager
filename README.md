# Student Task Manager

## Naziv Projekta

Student Task Manager

## Opis Projekta

Student Task Manager je web aplikacija razvijena za predmet **Operativni sistemi i računarstvo u oblaku**. Aplikacija omogućava pregled, dodavanje, uređivanje, brisanje i filtriranje studentskih zadataka vezanih za fakultetske obaveze.

Projekat koristi React frontend, json-server backend, Docker kontejnerizaciju i pripremljen je za deployment na Google Cloud Run.

## Član Tima

| Član tima | Doprinos |
| --- | --- |
| Zijad Pehlic | Frontend, backend, Docker konfiguracija, dokumentacija i priprema cloud deploymenta |

## Korištene Tehnologije

- React
- Vite
- JavaScript
- Plain CSS
- json-server
- Docker
- Docker Compose
- Nginx
- GitHub Actions
- Google Cloud Run
- Artifact Registry

## Arhitektura Aplikacije

Aplikacija je podijeljena na dva odvojena dijela:

- `frontend/` - React aplikacija za korisnički interfejs
- `backend/` - json-server API koji koristi `db.json` kao jednostavnu bazu podataka

Frontend komunicira sa backendom preko HTTP zahtjeva. U lokalnom razvoju koristi se `http://localhost:3001`, dok se u Docker okruženju koristi Nginx `/api` proxy.

```text
+----------------------+        HTTP / API        +----------------------+
| React + Vite frontend|  ----------------------> | json-server backend  |
| localhost:8080       |                          | localhost:3001/tasks |
+----------------------+                          +----------------------+
           |                                                |
           | Nginx /api proxy                               | db.json
           v                                                v
+-----------------------------------------------------------------------+
| Docker Compose: frontend servis, backend servis i named volume za DB   |
+-----------------------------------------------------------------------+
```

## Funkcionalnosti Aplikacije

- Početna stranica sa nazivom aplikacije i dugmetom za nastavak
- Mock login stranica bez stvarne autentifikacije
- Kontrolna ploča sa statistikama zadataka
- Lista zadataka
- Dodavanje novog zadatka
- Uređivanje postojećeg zadatka
- Brisanje zadatka
- Označavanje zadatka kao završenog
- Vraćanje zadatka u status nezavršenog
- Filteri za sve, nezavršene, završene i zadatke visokog prioriteta
- Prikazi za učitavanje, grešku i prazno stanje
- Responzivan dizajn za desktop i mobilne uređaje

## Lokalno Pokretanje Bez Dockera

Backend:

```bash
cd backend
npm install
npm start
```

Backend je dostupan na:

```text
http://localhost:3001/tasks
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend je dostupan na adresi koju prikaže Vite, najčešće:

```text
http://localhost:5173
```

Ako `VITE_API_URL` nije definisan, frontend automatski koristi:

```text
http://localhost:3001
```

## Pokretanje Pomoću Dockera

Pokretanje oba servisa:

```bash
docker compose up --build
```

Adrese servisa:

```text
Frontend: http://localhost:8080
Backend:  http://localhost:3001/tasks
```

Zaustavljanje servisa:

```bash
docker compose down
```

Ako želite ukloniti i named volume sa podacima:

```bash
docker compose down -v
```

## Objašnjenje Dockerfile-ova

### Frontend Dockerfile

Frontend Dockerfile koristi multi-stage build:

1. `node:22-alpine` instalira dependency-je i pokreće `npm run build`
2. `nginx:alpine` servira produkcijski React build
3. Nginx koristi SPA fallback i `/api` proxy prema backend servisu

### Backend Dockerfile

Backend Dockerfile koristi `node:18-alpine`, instalira json-server dependency-je i pokreće json-server na portu `3001`.

U Docker okruženju backend koristi persistent lokaciju:

```text
/data/db.json
```

Ako taj fajl ne postoji, `docker-entrypoint.sh` kopira početne podatke iz seed fajla u persistent lokaciju.

## Objašnjenje docker-compose.yml

`docker-compose.yml` definiše dva servisa:

- `backend` - json-server servis dostupan na portu `3001`
- `frontend` - React/Nginx servis dostupan na portu `8080`

Backend koristi named Docker volume:

```text
backend-db-data:/data
```

Ovaj volume čuva `db.json` podatke izvan lifecycle-a kontejnera. Izmjene zadataka ostaju sačuvane nakon ponovnog pokretanja kontejnera, dok god se volume ne obriše.

Frontend u Dockeru koristi:

```text
VITE_API_URL=/api
```

Nginx prosljeđuje `/api` zahtjeve backend servisu:

```text
http://backend:3001
```

## Korištenje health-check.sh Skripte

Skripta provjerava dostupnost frontend URL-a i backend `/tasks` endpointa.

Prije prvog korištenja na Linux/macOS okruženju:

```bash
chmod +x scripts/health-check.sh
```

Pokretanje sa podrazumijevanim vrijednostima:

```bash
./scripts/health-check.sh
```

Pokretanje sa custom URL adresama:

```bash
sh scripts/health-check.sh http://localhost:8080 http://localhost:3001
```

Skripta vraća non-zero exit code ako neki servis nije dostupan.

## Google Cloud Run Deployment

Koraci za deployment:

1. Kreirati Google Cloud projekat.
2. Omogućiti Cloud Run API.
3. Omogućiti Artifact Registry API.
4. Kreirati Artifact Registry Docker repozitorij.
5. Kreirati service account za deployment.
6. Dodijeliti potrebne permisije za Cloud Run i Artifact Registry.
7. Buildati backend Docker image.
8. Pushati backend image u Artifact Registry.
9. Deployati backend image na Cloud Run sa portom `3001`.
10. Buildati frontend image sa `VITE_API_URL` vrijednošću postavljenom na backend Cloud Run URL.
11. Pushati frontend image u Artifact Registry.
12. Deployati frontend image na Cloud Run sa portom `8080`.

## Artifact Registry

Artifact Registry služi za čuvanje Docker image-a prije deploymenta na Cloud Run.

U ovom projektu se očekuju dva image-a:

- `student-task-manager-backend`
- `student-task-manager-frontend`

GitHub Actions workflow builda image-e, push-a ih u Artifact Registry i zatim ih koristi za Cloud Run deployment.

## GitHub Actions

Workflow se nalazi u:

```text
.github/workflows/deploy.yml
```

Workflow radi sljedeće:

1. Preuzima kod iz repozitorija.
2. Postavlja Docker Buildx.
3. Autentifikuje se na Google Cloud.
4. Konfiguriše Docker za Artifact Registry.
5. Builda backend image.
6. Push-a backend image.
7. Deploy-a backend na Cloud Run.
8. Čita backend Cloud Run URL.
9. Builda frontend image sa backend URL vrijednošću.
10. Push-a frontend image.
11. Deploy-a frontend na Cloud Run.

## Potrebni GitHub Secrets

U GitHub repozitoriju potrebno je dodati sljedeće secrets:

```text
GCP_PROJECT_ID
GCP_REGION
GCP_SERVICE_ACCOUNT_KEY
ARTIFACT_REGISTRY_REPOSITORY
```

## Refleksija

### Šta je naučeno

Tokom izrade projekta naučeno je kako se React frontend povezuje sa jednostavnim REST backendom, kako se aplikacija kontejnerizuje pomoću Dockera i kako se priprema deployment na Google Cloud Run.

### Koji su bili izazovi

Glavni izazovi su bili pravilno povezivanje frontend i backend servisa u Docker Compose okruženju, podešavanje Nginx `/api` proxy-ja i osiguravanje persistencije `db.json` fajla pomoću named Docker volume-a.

### Šta bi se moglo unaprijediti

Aplikacija bi se mogla unaprijediti dodavanjem stvarne autentifikacije, korisničkih računa, naprednijih filtera, testova i povezivanjem sa pravom bazom podataka.
