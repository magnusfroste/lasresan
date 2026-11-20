# Läsresan

Gratis lästräning för åk 4–6: tolv korta texter i tre nivåer, med tre frågor till varje text.
Ingen inloggning, inga konton, inga kakor och inga externa nätverksanrop. Framstegen sparas bara i
webbläsarens `localStorage`.

**Spela:** https://lasresan.skolappar.com · En del av [Skolappar](https://www.skolappar.com) – pedagogiska appar av föräldrar · öppen källkod (MIT)

Byggd med React + Vite + Tailwind, publicerad som statiska filer.

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

Dockerfilen bygger med Node 22.

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
- Inga anrop till externa servrar. Typsnittet Fredoka ligger i appen (`public/fonts/`);
  `@fontsource/inter` följer också med i bygget. Inga typsnitt hämtas utifrån.
- Enda lagringen: `localStorage` med nyckeln `lasresan-v1` (klara texter och antal rätt).
  Raderas den försvinner framstegen – inget skickas någonstans.

## Docker

`Dockerfile` bygger appen och serverar `dist/` med nginx på port 8080 (`deploy/nginx.conf`).

```bash
docker build -t lasresan .
docker run --rm -p 8080:8080 lasresan
```

## Struktur

```
src/App.tsx              vyer: startsida och läsning
src/components/Home.tsx  textval per nivå med framsteg
src/components/Reader.tsx text, uppläsning, frågor och resultat
src/lib/texts.ts         de tolv texterna med frågor
src/lib/speech.ts        uppläsning med Web Speech API
src/lib/progress.ts      framsteg i localStorage (lasresan-v1)
scripts/verify-texts.mjs innehållskontroll
```

## Licens

Koden: MIT – se [LICENSE](LICENSE). Texterna: CC BY 4.0.
