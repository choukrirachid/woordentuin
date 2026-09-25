# Woordentuin

Kindvriendelijke Arabische leerapp met Nederlandse uitleg.

## Starten

Download `index.html` via de knop **Download raw file** op GitHub en open het bestand in je browser. De app werkt offline, zonder installatie. Alle afbeeldingen, teksten en spelvormen zitten in dit bestand.

## Inhoud

- Boekenoverzicht: Boek 1 beschikbaar; Boeken 2–12 komen binnenkort.
- 8 lessen met 63 woordenschatitems.
- Flitskaartjes, slepen, woordquiz, Nederlands naar Arabisch, koppelen, memory, woordbouwer en plaatjes raden.
- Arabische tekst met klinkertekens, Nederlandse uitleg en illustraties zonder ogen.
- Geschikt voor desktop en mobiel.

## Bewerken

`index.html` bevat de complete app, inclusief bewerkbare HTML, CSS en JavaScript.

`bronbestanden.zip` bevat daarnaast de oorspronkelijke losse bestanden:

- `dist/app.js`: navigatie en oefeningen.
- `dist/data.js`: Arabische woorden, Nederlandse betekenissen en uitleg.
- `dist/style.css`: vormgeving.
- `dist/index.html`: ingang van de modulaire app.
- `dist/assets/`: illustraties.

Na uitpakken kun je met een aanwezige Python-installatie een lokale server starten:

```sh
python -m http.server 8000 --directory dist
```

Open vervolgens http://localhost:8000. Er zijn geen externe JavaScript-pakketten nodig. De losse bestanden en de zelfstandige HTML zijn twee versies van dezelfde app; wijzigingen moeten in beide worden verwerkt.

## Huidige grenzen

Oefenstatus blijft bewaard zolang de pagina openstaat. Er zijn geen accounts, tracking of API-sleutels nodig. De app is installeerbaar via Chrome op Android en via Safari → Delen → Zet op beginscherm op iPad. De service worker slaat Boek 1 en alle oefenillustraties offline op. Officiële boekomslagen hebben internet nodig. GitHub Pages publiceert de app vanaf main.

## Controle

Alle acht spelvormen zijn gecontroleerd op afronden en opnieuw starten. Ook de mobiele weergave, afbeeldingen, offlinewerking en exacte overeenkomst van de Arabische broninhoud zijn gecontroleerd.


## Tablet-app

Open https://choukrirachid.github.io/woordentuin/ en kies **Op je tablet**. Wacht op de melding dat oefeningen offline klaar zijn. Installatie moet op de tablet zelf worden bevestigd.

De bestanden manifest.webmanifest, sw.js en icon-*.png horen naast de zelfstandige index.html. Verhoog bij elke nieuwe publicatie de CACHE-versie in sw.js zodat bestaande installaties een update ontvangen.
