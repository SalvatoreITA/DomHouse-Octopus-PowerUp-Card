# 🐙 DomHouse Octopus PowerUp Card per Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![version](https://img.shields.io/badge/version-v1.0.0-blue.svg)]()
[![maintainer](https://img.shields.io/badge/maintainer-Salvatore_Lentini_--_DomHouse.it-green.svg)](https://www.domhouse.it)

Una Custom Card dal design premium per monitorare in tempo reale le tue sfide **Octopus PowerUp** su Home Assistant.  
Questa card è il compagno visivo perfetto per l'integrazione [Octopus PowerUp Helper](https://github.com/SalvatoreITA/Octopus-PowerUp-Helper/).

<div align="center">
  <img src="screen_octo.PNG" alt="Card Preview" width="300">
</div>

## 🎁 Sconto Octopus

Se devi attivare un nuovo abbonamento con Octopus Energy puoi usare questo [link](https://octopusenergy.it/octo-friends/quiet-gaur-553): otterrai **uno sconto fino a 50 €**

## ✨ Caratteristiche
- 🎨 **Design Moderno:** Effetto "Glassmorphism", sfumature e supporto nativo al Tema Scuro/Chiaro di Home Assistant.
- 🖱️ **Completamente Interattiva:** Clicca sui riquadri degli orari direttamente dalla plancia per modificarli al volo. La card si aggiornerà in un lampo.
- ⚙️ **100% UI Editor:** Nessun codice YAML da scrivere. La card dispone di un editor grafico completo per attivare/disattivare il pannello "Strategia" o forzare il tema scuro.
- 🔌 **Plug & Play:** Rileva automaticamente i sensori creati dall'integrazione ufficiale senza doverli configurare a mano.

## ⚠️ Prerequisiti
Per far funzionare questa card, **DEVI** prima installare il componente base che calcola i dati.
👉 **[Scarica l'integrazione backend da qui](https://github.com/SalvatoreITA/Octopus-PowerUp-Helper/)**.

## 📦 Installazione

### Metodo 1: Tramite HACS (Consigliato)
Poiché la card non è ancora tra i repository predefiniti di HACS, puoi aggiungerla facilmente:

1. Apri **HACS** nel tuo Home Assistant.
2. Vai nella sezione **Frontend** (o Interfaccia Utente).
3. Clicca sui tre puntini in alto a destra e seleziona **Repository personalizzati**.
4. Incolla l'URL di questo repository: `https://github.com/SalvatoreITA/DomHouse-Octopus-PowerUp-Card`
5. Scegli la categoria **Lovelace** (o Dashboard) e clicca su Aggiungi.
6. Cerca "DomHouse Octopus PowerUp", clicca su **Scarica** e ricarica la pagina del browser.

### Metodo 2: Manuale
1. Scarica il file `domhouse-octopus-powerup-card.js` dall'ultima release.
2. Copia il file nella cartella `/config/www/` del tuo Home Assistant.
3. Vai su **Impostazioni > Plance > Risorse** (potresti dover attivare la Modalità Avanzata nel tuo profilo utente per vedere questa voce).
4. Aggiungi una risorsa con URL `/local/domhouse-octopus-powerup-card.js` e seleziona il tipo **Modulo JavaScript**.
5. Ricarica la pagina.

## ⚙️ Come Usarla

1. Vai sulla tua Plancia (Dashboard) di Home Assistant.
2. Clicca sulla matita in alto a destra per **Modificare la plancia**.
3. Clicca su **Aggiungi Scheda**.
4. Scorri l'elenco o cerca **"DomHouse Octopus Card - PowerUp"**.
5. Usa l'editor visivo per personalizzare il titolo o nascondere i suggerimenti di strategia.
6. Salva e goditi il tuo PowerUp!

## 🎁 Bonus: Octopus Power Up - Notifiche Smart (Blueprint)

Un Blueprint per automatizzare le notifiche della tua sessione "Power Up" su Home Assistant. 
Questo strumento gestisce in totale autonomia gli avvisi di inizio e fine evento, calcolando l'esito della tua sfida e il tuo bottino in tempo reale.

## ✨ Cosa fa questo Blueprint?

* **Fischio d'inizio:** Ti invia una notifica nel minuto esatto in cui inizia il Power Up, ricordandoti la tua media storica in kWh (Baseline) in modo da sapere subito qual è la soglia che devi superare.
* **Arbitro a fine partita:** Nell'istante in cui la sfida termina, legge il tuo consumo live e lo confronta con la tua media prima che il sensore si azzeri.
* **Esito dinamico:** A seconda del tuo risultato, riceverai uno dei 2 messaggi personalizzati:
  * 🎉 **Bottino Conquistato:** Se hai superato la tua media, riceverai i complimenti e il calcolo esatto dei kWh di energia gratuita che sei riuscito ad accumulare.
  * ❌ **Power Up Fallito:** Se sei rimasto sotto o in linea con la tua media, ricordandoti che per questa volta non ci sono bonus.

Nella cartella `blueprints` di questo repository troverai i file YAML pronti all'uso.

### 🎉 Blueprint
[![Importa Blueprint in Home Assistant](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https://raw.githubusercontent.com/SalvatoreITA/DomHouse-Octopus-PowerUp-Card/refs/heads/main/blueprints/octopus_power_up_notifiche.yaml)

## ☕ Supporta il Progetto

Ogni piccolo supporto fa un'enorme differenza: mi aiuta a mantenere vivo l'entusiasmo e mi stimola a creare e condividere nuove soluzioni per la community. Grazie di cuore per il tuo aiuto! 🚀

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/salvatore_dh)

## ❤️ Crediti
Sviluppato da [Salvatore Lentini - DomHouse.it](https://www.domhouse.it)
