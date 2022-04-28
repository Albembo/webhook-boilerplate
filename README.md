# Google Action, Express & Webhooks

> Una guida introduttiva su come configurare la tua action per utilizzare i webhook utilizzando express.js

## Requisiti

- Un progetto Google Action già avviato
- La libreria [@assistant/conversation](https://www.npmjs.com/package/@assistant/conversation)

### Disclaimer
Questa guida presuppone che ci sia già un server [express](https://www.npmjs.com/package/express) implementato. Inoltre, non verranno approfonditi argomenti che riguardano express in quanto si presuppone che si abbia già una buona padronazza della libreria.

## Hello world 🌎

### Backend side

Creare il tuo primo webhook è davvero molto semplice, quasi quanto creare una route per express.js!

Iniziamo a creare un nuovo file e chiamiamolo `myFirstWebhook.js`. Il nome del file non è importante, puoi sceglierlo a tuo piacimento (che ne diresti di `ILovePizza.js` ? 🍕😋)

Il nostro file è un po' vuoto, quindi diamoci da fare! 

```js
const { conversation } = require('@assistant/conversation');

// Init the webhook entry point
const app = conversation({ debug: false });

// Exports the webhook
module.exports = app;
```

Qui non facciamo nulla di particolare. Come è facilmente intuibile, non facciamo altro che importare conversation, inizializzare il webhook ed esportarlo.
> L'opzione `debug` posta a _false_ serve ad evitare che venga loggata ogni richiesta in console. Se vuoi, sei libero di abilitare il log delle richieste impostanto il valore `debug` a _true_

A questo punto ti chiederai: _Si, tutto molto bello. Ma che esempio è se non c'è scritto "Hello World" da nessuna parte?_ Beh, hai ragione!

Aggiungiamo quindi il codice necessario per scrivere il messaggio più famoso del mondo:

```js
// When this webhook is called, the action says "Hello World"
app.handle('hello_world', async conversation => {
    // Add an element to the conversation
    conversation.add('Hello World');
});
```
Per istruire il nostro webhook sulla gestione di una determinata richiesta, si utilizza la funzione `app.handle()`.

Dal momento in cui si possono avere più webhook nell'applicazione, è necessario identificarli e lo si fa attraverso una stringa, il primo argomento della funzione. In questo caso abbiamo scelto `hello_world` (che fantasia!). E' buona norma inserire una stringa che rispetti la naming convention *snake_case* (niente _camelCase_ qui 🐪⛔)

Il secondo argomento che la funzione _handle_ accetta è una funzione. Questa funzione (che deve essere **sempre** asincrona) gestisce la logica del webhook. Qui possiamo svolgere tutte le operazioni necessarie. In questo caso abbiamo chiesto alla action di aggiungere un semplice 'Hello World'.

Perfetto! Ora il nostro file dovrebbe assomigliare a qualcosa del genere:

```js
const { conversation } = require('@assistant/conversation');

// Init the webhook entry point
const app = conversation({ debug: false });

// When this webhook is called, the action says "Hello World"
app.handle('hello_world', async conversation => {
    // Add an element to the conversation
    conversation.add('Hello World');
});

// Exports the webhook
module.exports = app;
```

> E' importante che tutti i webhook siano dichiarati prima dell'export

Ok, ci siamo quasi! Ora non ci resta che andare sull'entry point del tuo server express ed aggiungere queste linee di codice:

```js
// Other imports...
const myFirstWebhook = require('my/path/to/myFirstWebhook');

// Some cool stuff here

// Add the route
app.use('/action', myFirstWebhook);

// Code required to start the server here
```

Fatto! Il nostro server è pronto a gestire le chiamate ai webhook!
> Ricorda che `/action` è il path a cui è possibile accedere all'endpoint. Quindi se pensi che un nome come `/pizza` sia più appropriato, sei libero di cambiarlo 😀

### Action side

Ok, il nostro server è pronto, spostiamoci sulla action. 

- Accediamo al nostro progetto attraverso la [console](https://console.actions.google.com/) e rechiamoci nella sezione _develop_, presente nel menù in alto.
- Apriamo il menu laterale e rechiamoci nella sezione "webhooks". Se è la prima volta che ti rechi in questa sezione, potrebbe apparire un modal nel quale ti chiede di selezionare il "Fulfillment method" che preferisci. Seleziona "HTTPS endpont".
- A questo punto non ci resta che inserire l'endpoint HTTPS al nostro server e premere su salva.

> L'endpoint deve essere necessariamente HTTPS e deve puntare all'entry point del webhook (e.g. https://myserver.com/action). Se sei in locale e vuoi testare il tutto, puoi usare strumenti come [ngrok](https://ngrok.com/) per effettuare un tunneling a localhost

Ultimo passaggio e ci siamo! 

Recati sulla scena della action su cui vuoi inserire il webhook.

Come sappiamo, i webhook possono essere inseriti in 5 punti differenti della scena:

1. **On enter**: Viene chiamato appena si entra nella scena 
1. Su una determinata **condition**: Quando viene fatto il match di una condition, verrà chiamato il tuo webhook
1. **Slot validation**: Viene chiamato quando si deve verificare che un determinato valore inserito dall'utente sia valido o meno
1. **User intent handling**: Viene chiamato quando viene matchato un determinato intent
1. **Error and status handling**: Viene chiamato quando viene matchato un determinato intent di sistema

Scegli dove inserirlo in base alle tue esigenze. Per questo esempio però, lo inseriremo sull'_On enter_. Quindi clicchiamo su "On enter" e spuntiamo la casella "Call your webhook". 
Il nome da inserire è lo stesso scelto nella definizione dell' `app.hanlde()` (*hello_world* nel nostro caso). 

🎉 Fine! 🎉

Abbiamo creato il nostro primo webhook!

## Ulteriori approfondimenti 🔍

Quando si iniziano a scrivere webhook complessi, è facile trovarsi in una situazione come questa:

File `myFirstWebhook.js`
```js
const { conversation } = require('@assistant/conversation');

// Init the webhook entry point
const app = conversation({ debug: false });

// When this webhook is called, the action says "Hello World"
app.handle('hello_world', async conversation => {
    // Add an element to the conversation
    conversation.add('Hello World');
});

// Some complex webhooks
app.handle('complex_code', async conversation => {
    // Very long code here
});

app.handle('long_webhook', async conversation => {
    // Very very long code here
});

app.handle('very_very_long_webhook', async conversation => {
    // Very very long code here
});

app.handle('huge_webhook', async conversation => {
    // Huge amount of code here
});

// Exports the webhook
module.exports = app;
```

L'aggiunta di tanti webhook insieme alla presenza di tante linee di codice rende il nostro file poco leggibile. 

E' buona norma separare il codice dei webhooks dalla definzione dei webhook stessi. Quindi meglio scrivere le nostre funzioni da parte. Per esempio, potremmo realizzare una cosa del genere:

<pre>
.
|--📂 handlers
|  |--📄 helloHandler.js
|  |--📄 longHandler.js
|--📂 routes
   |--📄 myFirstWebhook.js
</pre>

File `helloHandler.js`
```js
// When this webhook is called, the action says "Hello World"
exports.hello_world = async conversation => {
    // Add an element to the conversation
    conversation.add('Hello World');
});
```

File `longHandler.js`
```js
// Some complex webhooks
exports.complex_code = async conversation => {
    // Very long code here
});

exports.long_webhook = async conversation => {
    // Very very long code here
});

exports.very_very_long_webhook = async conversation => {
    // Very very long code here
});

exports.huge_webhook = async conversation => {
    // Huge amount of code here
});
```

File `myFirstWebhook.js`
```js
const { conversation } = require('@assistant/conversation');
const {
    hello_world,
} = require('../handlers/helloHandler');
const {
    complex_code,
    long_webhook,
    very_very_long_webhook,
    huge_webhook
} = require('../handlers/longHandler');

// Init the webhook entry point
const app = conversation({ debug: false });

// Hello world handlers
app.handle('hello_world', hello_world);

// Long Handlers
app.handle('complex_code', complex_code);
app.handle('long_webhook', long_webhook);
app.handle('very_very_long_webhook', very_very_long_webhook);
app.handle('huge_webhook', huge_webhook);

// Exports the webhook
module.exports = app;
```

Come notiamo ora il codice è molto più pulito sul nostro file `myFirstWebhook.js` e la suddivisione in file diversi aiuta la manutenibilità del nostro codice! 