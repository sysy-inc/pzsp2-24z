# PZSP2 - Projekt Sensor

## Instrukcja uruchomienia

Całą aplikację lokalnie można uruchomić za pomocą dockera.

```bash
docker compose up
```

W przypadku ewentualnych problemów z uruchomieniem trzeba upewnić się, że porty `3000`, `8000` i `5432` nie są już zajęte.

Przy takim uruchomieniu frontend aplikacji będzie dostępny pod adresem `http://localhost:3000`, a backend pod adresem `http://localhost:8000`.

Baza danych zostanie zasilona przykładowymi danymi w celu umożliwienia przetestowania aplikacji bez konieczności uruchamiania sensorów.

Utrzone zostanie jedno konto administratora:
- login: `test@admin`
- hasło: `admin`
