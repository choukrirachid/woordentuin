# Woordentuin

Kindvriendelijke Arabische leerapp met Nederlandse uitleg.

## Starten

Open de GitHub Pages app via https://choukrirachid.github.io/woordentuin/. Na de eerste download werken de beschikbare boeken ook offline via de geïnstalleerde webapp. De bronbestanden staan los in de repository.

## Inhoud

- Programmakeuze: Al-Arabiyyah Bayna Yaday Awladina en Ik hou van Arabisch, elk met een eigen boekenoverzicht. Bij de eerste reeks is Boek 1 beschikbaar en komen Boeken 2–12 later.
- Al-Arabiyyah Bayna Yaday Awladina: 8 lessen met 63 items. Ik hou van Arabisch, boek 1: 16 lessen met 604 kaarten.
- Flitskaartjes, slepen, woordquiz, Nederlands naar Arabisch, koppelen, memory, woordbouwer, plaatjes raden en luisteren. De kaarten en quizvragen hebben een Arabische luisterknop.
- Arabische tekst met klinkertekens, Nederlandse uitleg en illustraties zonder ogen.
- Geschikt voor desktop en mobiel.

## Bewerken

`index.html`, `app.js`, `data.js`, `ahibb.js`, `ahibb-images-*.js`, `bayna-images.js` en `style.css` vormen samen de app.

`bronbestanden.zip` bevat daarnaast de oorspronkelijke losse bestanden:

- `dist/app.js`: navigatie en oefeningen.
- `dist/data.js`: Arabische woorden, Nederlandse betekenissen en uitleg.
- `dist/style.css`: vormgeving.
- `dist/index.html`: ingang van de modulaire app.
- `dist/assets/`: oorspronkelijke illustraties (in de online app ook gebundeld in `bayna-images.js`).

Na uitpakken kun je met een aanwezige Python-installatie een lokale server starten:

```sh
python -m http.server 8000 --directory dist
```

Open vervolgens http://localhost:8000. Er zijn geen externe JavaScript-pakketten nodig. De losse bestanden in de repository zijn de publicatieversie. Het zipbestand is een kopie van de bronbestanden.

## Huidige grenzen

Oefenstatus blijft bewaard zolang de pagina openstaat. Er zijn geen accounts, tracking of API-sleutels nodig. De app is installeerbaar via Chrome op Android en via Safari → Delen → Zet op beginscherm op iPad. De service worker slaat de beschikbare boeken en alle oefenillustraties offline op. Officiële boekomslagen hebben internet nodig. GitHub Pages publiceert de app vanaf main.

## Controle

Alle acht spelvormen zijn gecontroleerd op afronden en opnieuw starten. Ook de mobiele weergave, afbeeldingen, offlinewerking en exacte overeenkomst van de Arabische broninhoud zijn gecontroleerd.


## Tablet-app

Open https://choukrirachid.github.io/woordentuin/ en kies **Op je tablet**. Wacht op de melding dat oefeningen offline klaar zijn. Installatie moet op de tablet zelf worden bevestigd.

De bestanden manifest.webmanifest, sw.js en icon-*.png horen naast de zelfstandige index.html. Verhoog bij elke nieuwe publicatie de CACHE-versie in sw.js zodat bestaande installaties een update ontvangen.
