# Tennis-Website
## Av Dennis Hankvist

2022-11-01 - 2022-12-08

För javascript och html-kurs.

Den här hemsidan ska representera en tennisförening. 
Föreningen äger en stor byggnad som hyser 4 inomhus-tennisplaner,
ett klubbhus som innehåller en bastu samt 7 stycken utomhus-tennisplaner.

Uppgiften var att tillse att det ska kunna gå att **boka dessa banor, bastun samt omklädningsrum för herrar och damer**.
Utöver detta **skall sidan vara responsiv och visas snyggt** i olika storlekar på olika enheter och webläsare.

### Responsivitet
Min sida är responsiv och har ett flertal olika lägen:
- Headern justeras i flera olika steg
- Marginal justeras vid mindre skärm
- Stycken som är horizonellt uppdelade ändras till vertikal uppdelning vid mindre skärm

### Javascript
Uppgiften säger att det räcker med ett bokningsformulär med validering, men för att lära mig Javascript har jag
utvecklat det hela mycket mer än så.

- Jag använder mig av **OOP** för att bygga ett bokninssystem som *hanterar bokningar över flera dagar*
- Jag har skrivit **egna valideringsmetoder** för många av fälten i bokningsformuläret som är *mer invecklade än de inbyggda i input-elementen*
- Jag använder **session-storage** för att tillfälligt lagra validera formulärvärden som sedan laddas in om sidan råkar uppdateras
- 

*Notera att jag ibland mergar in branches som är under utveckling, för att du/ni ska kunna följa utvecklingen.*
