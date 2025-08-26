# pxt-TCA9548A
Library to use SparkFun I2C-mux with makecode

Created with ChatGPT5

# pxt-tca9548a

Et enkelt MakeCode‑bibliotek for TCA9548A I²C‑multiplexer (SparkFun m.fl.).

## Funksjoner
- `setAddress(addr)` – sett 7‑bit I²C‑adresse (0x70–0x77).
- `select(port)` – velg én port eksklusivt.
- `enable(port)` / `disable(port)` – slå port på/av (kan kombinere flere).
- `disableAll()` – slå av alle.
- `enableMask(mask)` – skriv vilkårlig bitmaske (avansert).
- `activeMask()` – les aktiv maske.
- `withChannel(port, body)` – kjør kode midlertidig på valgt kanal, og gjenopprett.

## Installer som MakeCode‑utvidelse
1. Lag et GitHub‑repo, f.eks. `https://github.com/<bruker>/pxt-tca9548a`.
2. Legg inn filene `pxt.json`, `tca9548a.ts` og `README.md` (og gjerne `test.ts`).
3. I MakeCode for micro:bit: **Extensions** → lim inn repo‑URL → installer.

## Kablet opp
- TCA9548A VCC → 3V på micro:bit
- GND → GND
- SDA → pin 20 (SDA)
- SCL → pin 19 (SCL)
- Legg sensorer/utstyr på S0…S7‑portene.

## Eksempel (TypeScript)
```ts
// Velg mux‑adresse (valgfritt, default er 0x70)
TCA9548A.setAddress(0x70)

// Snakk med en sensor på kanal S2
TCA9548A.select(TCA9548A.Port.S2)
// ... I²C‑operasjoner mot sensoren her ...

// Slå på flere kanaler samtidig
TCA9548A.enable(TCA9548A.Port.S0)
TCA9548A.enable(TCA9548A.Port.S3)

// Bruk hjelpert som gjenoppretter tidligere valg automatisk
TCA9548A.withChannel(TCA9548A.Port.S1, () => {
    // i dette blokket er S1 valgt
    // pins.i2cWriteNumber(0x1E, 0, NumberFormat.UInt8LE) // eksempel
})

// Sjekk hvilke kanaler som er aktive
const mask = TCA9548A.activeMask()
