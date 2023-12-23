Szia Balázs!

---

exchangeRateService.ts:

-   Itt megcsináltam a még el nem készült árfolyam-információs szolgáltatás fake verzióját.

-   Ahhoz, hogy az ADOTT NAPI árfolyamot kapjuk meg, a "getExchangeRate" metódusban szükség van még a "currentDate" paraméterre is,
    ami most hiányzik, így hozzáadtam (nem kötelező, default value: a mai dátum, ha nem adják meg).

-   Ha a fromCurrency - toCurrency pár nem adott találatot, megnéztem megfordítva is (pl. "EUR"-"HUF" helyett "HUF"-"EUR"),
    és ha ott volt találat, az exchange rate reciprokát adtam vissza.

-   Tettem bele "invalid rate"-et is (string-et szám helyett), és hiányzó item is van, hogy azt is lehessen tesztelni.

---

currencyConverter.test.ts:

-   Elkészítettem a Unit Test-eket a happy és error path-okra, csoportosítva.

-   Az it.each-et használtam, hogy minimalizáljam a duplikációt a teszteknél.

---

currencyConverter.ts:

-   A tesztek elkészítésekor az alábbi hiányosságokat találtam (remélem mindegyik valós):

---

A "Convert" metódus

-   return-ölt értéke sokszor egy hosszú, sok tizedesjegyes float szám,
    átírtam, hogy a végeredményt 2 tizedesjegyre kerekítse.

-   Nem volt validálva a fromCurrency és toCurrency, ezért pótoltam ezt, készítettem egy "validateCurrency" metódust,
    amiben akár kisbetűvel, akár nagybetűvel elfogadjuk a currency nevét, ha benne van a "validCurrencies" array-ben,
    amit kiraktam az "src" könyvtárban lévő configData.ts file-ba és onnan importáltam be, mert több helyen kell majd használni a webapp-ban.

-   Nem volt validálva, hogy a fromCurrency és toCurrency azonos-e, erre is készítettem egy "validateCurrencySame" metódust is.

-   Nem volt validálva a currentDate, ezért pótoltam ezt, készítettem egy "validateDate" metódust.

---

A "GenerateConversionReport" metódusnál:

-   Nem volt validálva a startDate és endDate, ezért "validateDate" metódussal validáltam őket.

-   Nem volt validálva, hogy az endDate nagyobb vagy egyenlő-e, mint a startDate, erre is készítettem egy "validateDateRange" metódust is.

-   Nem volt validálva, hogy a fromCurrency és toCurrency azonos-e, validáltam a "validateCurrencySame" metódussal.

-   Közvetlenül volt meghívva az "exchangeRateService", ami szerintem nem hatékony:

    while (currentDate <= endDate) {
    const exchangeRate = this.exchangeRateService.getExchangeRate(......)

átírtam, hogy a helyi "getExchangeRate" metódust hívja meg (az fogja majd meghívni a külső dependency-t):

    while (currentDate <= endDate) {
        const exchangeRate = this.getExchangeRate(......)

-   A startDate és endDate közötti dátumok nem voltak átküldve paraméterként az exchangeRateService-nek,
    így minden egyes dátumra ugyanazt az árfolyamot adta meg,

illetve ha az exchangeRateService nem látja a dátumot, nem is tudja visszaadni az árfolyamot,
csak esetleg a legutolsó v. mai árfolyamot, ha úgy van beállítva.

Például ha 351.27 árfolyamot kaptunk vissza, és ugye a FIXED_AMOUNT-tal, 100-zal szoroztunk, akkor ez lett a végeredmény:
"Conversion Report:\n35127\n35127\n35127"

Tehát szerintem a metódus helytelenül működött (vagy csak valamit félreértettem).

Módosítottam a metódust, és így most már az adott dátumokra vonatkozó árfolyamokat hívja le.

---

A "validateExchangeRate" metódusban

-   ellenőriztem az "exchangeRateService" által return-ölt értéket és attól függően NotFoundError-t, NetworkError-t vagy ValidationError-t dobattam.

---

Nagyon sokat tanultam ebből a feladatból,
és a kurzusból már eddig is,

köszönöm szépen!!

Szabolcs
