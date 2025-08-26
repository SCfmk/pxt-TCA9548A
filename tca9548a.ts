/**
 * TCA9548A (SparkFun I2C Mux) – MakeCode‑bibliotek for micro:bit
 *
 * Skriver én byte (kanal‑bitmaske) til 7‑bit I²C‑adressen (0x70–0x77).
 * Når en kanal velges eksklusivt, settes kun én bit (1 << kanal).
 * For flere kanaler samtidig, skriv ønsket bitmaske.
 */

//% color=#D83B01 weight=85 icon="\uf0ec" block="TCA9548A"
namespace TCA9548A {
    /** Gyldige 7‑bit adresser for TCA9548A */
    const MIN_ADDR = 0x70
    const MAX_ADDR = 0x77

    let _addr = 0x70
    let _mask = 0x00 // gjeldende aktiv kanalmaske

    /**
     * TCA9548A‑porter (S0..S7)
     */
    //% blockGap=8
    export enum Port {
        //% block="S0"
        S0 = 0,
        //% block="S1"
        S1 = 1,
        //% block="S2"
        S2 = 2,
        //% block="S3"
        S3 = 3,
        //% block="S4"
        S4 = 4,
        //% block="S5"
        S5 = 5,
        //% block="S6"
        S6 = 6,
        //% block="S7"
        S7 = 7
    }

    /** Valider og sett adresse */
    function setAddrInternal(a: number) {
        if (a < MIN_ADDR || a > MAX_ADDR) {
            // fall tilbake på default hvis input er ugyldig
            _addr = 0x70
        } else {
            _addr = a | 0
        }
    }

    /** Skriv bitmaske til mux */
    function writeMask(mask: number) {
        const m = mask & 0xFF
        pins.i2cWriteNumber(_addr, m, NumberFormat.UInt8LE, false)
        _mask = m
        // kort pause hjelper på enkelte oppsett
        basic.pause(1)
    }

    /** Regn ut bit for en port */
    function bitFor(port: Port): number {
        return (1 << (port as number)) & 0xFF
    }

    //% group="Konfigurasjon"
    //% blockId=tca_set_address
    //% block="sett TCA9548A‑adresse til %addr"
    //% addr.min=112 addr.max=119 addr.defl=112
    //% weight=90
    /** Sett 7‑bit I²C‑adresse (0x70–0x77). Default 0x70 (112). */
    export function setAddress(addr: number) {
        setAddrInternal(addr)
    }

    //% group="Kanaler"
    //% blockId=tca_select
    //% block="velg port %port (eksklusiv)"
    //% port.defl=TCA9548A.Port.S0
    //% weight=85
    /** Velg én port eksklusivt (de andre slås av). */
    export function select(port: Port) {
        writeMask(bitFor(port))
    }

    //% group="Kanaler"
    //% blockId=tca_enable
    //% block="slå på port %port (behold andre)"
    //% port.defl=TCA9548A.Port.S0
    //% weight=80
    /** Aktiver en ekstra port uten å endre de som allerede er på. */
    export function enable(port: Port) {
        writeMask(_mask | bitFor(port))
    }

    //% group="Kanaler"
    //% blockId=tca_disable
    //% block="slå av port %port"
    //% port.defl=TCA9548A.Port.S0
    //% weight=75
    /** Deaktiver en enkelt port. */
    export function disable(port: Port) {
        writeMask(_mask & (~bitFor(port)))
    }

    //% group="Kanaler"
    //% blockId=tca_disable_all
    //% block="slå av alle porter"
    //% weight=70
    /** Slå av alle porter (bitmaske = 0). */
    export function disableAll() {
        writeMask(0x00)
    }

    //% group="Kanaler"
    //% blockId=tca_enable_mask
    //% block="skriv bitmaske %mask"
    //% mask.min=0 mask.max=255 mask.defl=1
    //% weight=65 advanced=true
    /** Skriv en vilkårlig bitmaske (for avansert bruk). */
    export function enableMask(mask: number) {
        writeMask(mask)
    }

    //% group="Status"
    //% blockId=tca_get_mask
    //% block="aktiv kanalmaske"
    //% weight=60
    /** Returnerer gjeldende bitmaske for aktive porter. */
    export function activeMask(): number {
        return _mask
    }

    //% group="Hjelpere"
    //% blockId=tca_with_channel
    //% block="midlertidig bruk port %port og kjør"
    //% port.defl=TCA9548A.Port.S0
    //% weight=55 advanced=true
    /**
     * Velg port midlertidig, kjør en funksjon og gjenopprett forrige maske.
     * Brukes slik i TypeScript:
     *   TCA9548A.withChannel(TCA9548A.Port.S1, () => {
     *       // snakk I²C med enheten på S1
     *   })
     */
    export function withChannel(port: Port, body: () => void) {
        const prev = _mask
        select(port)
        body()
        writeMask(prev)
    }
}
