# Läsresan

Gratis lästräning för åk 4–6: tolv korta texter i tre nivåer, med tre frågor till varje text.
Ingen inloggning, inga konton, inga kakor och inga externa nätverksanrop. Framstegen sparas bara i
webbläsarens `localStorage`.

Byggd med React + Vite + Tailwind, publicerad som statiska filer. Öppen källkod.

## Så fungerar det

1. Eleven väljer en text på nivå 4, 5 eller 6.
2. Texten läses i lugn takt (19 px, radavstånd 1,7, högst 60 tecken per rad). Uppläsning med
   webbläsarens egen röst (Web Speech API, sv-SE) går att slå på och av – den är helt valfri.
3. Tre frågor, en i taget, med tre svarsalternativ:
   - **På raderna** – svaret står direkt i texten.
   - **Mellan raderna** – svaret kräver slutledning.
   - **Ordförståelse** – vad betyder ordet i det här sammanhanget?
4. Efter varje svar visas rätt/fel och en förklaring. Sedan resultat (x av 3) och möjlighet att läsa
   en text till.
5. Startsidan visar nivå, ämne, om texten är klar och antal rätt, samt "X av 12 texter klara".

## Kom igång

```bash
npm install
npm run dev      # utvecklingsserver
npm run build    # produktionsbygge till dist/
npm run preview  # förhandsgranska bygget
npm run check    # innehållskontroll av texter och frågor
npm run typecheck
```

Node 20 eller senare.

## Innehåll

Alla texter är skrivna för Läsresan och får återanvändas fritt (CC BY 4.0). De ligger i
`src/lib/texts.ts` och är lätta att byta ut eller bygga vidare på. `npm run check` verifierar att
varje text har 80–150 ord, exakt tre frågor (en av varje typ), tre unika alternativ och ett
rätt svar som finns bland alternativen.

| Nivå | Texter | Ämnen                                  |
| ---- | ------ | -------------------------------------- |
| 4    | 4      | vardag, natur, historia                |
| 5    | 4      | empati, natur, historia, teknik        |
| 6    | 4      | empati, natur, historia, teknik        |

## Integritet

- Ingen inloggning, inga konton, inga kakor, ingen spårning.
- Inga anrop till externa servrar. Typsnittet Inter ligger i paketet (`@fontsource/inter`).
- Enda lagringen: `localStorage` med nyckeln `lasresan-v1` (klara texter och antal rätt).
  Raderas den försvinner framstegen – inget skickas någonstans.

## Deploy

`Dockerfile` bygger appen och serverar `dist/` med nginx på port 8080 (`deploy/nginx.conf`).

```bash
docker build -t lasresan .
docker run --rm -p 8080:8080 lasresan
```

## Licens

Koden: MIT. Texterna: CC BY 4.0.