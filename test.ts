// En liten demo: bytt mellom to kanaler og blink ikon
TCA9548A.setAddress(0x70)
let p = 0
basic.forever(() => {
    const port = (p++ % 2) ? TCA9548A.Port.S0 : TCA9548A.Port.S1
    TCA9548A.select(port)
    basic.showNumber(port)
    basic.pause(500)
})
