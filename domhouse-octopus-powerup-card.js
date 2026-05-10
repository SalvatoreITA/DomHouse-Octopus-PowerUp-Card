console.info("%c 🐙 DOMHOUSE OCTOPUS POWERUP CARD v1.3.1 (HA 2026.5 FIX) IS LOADED ", "color: white; background: #00d1ff; font-weight: bold; border: 1px solid white; padding: 2px 6px; border-radius: 4px;");

const LitElement = customElements.get("ha-panel-lovelace")
  ? Object.getPrototypeOf(customElements.get("ha-panel-lovelace"))
  : Object.getPrototypeOf(customElements.get("hc-lovelace"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

// =============================================================================
//  CARD: OCTOPUS POWER UP (domhouse-octopus-powerup-card)
// =============================================================================
class DomHouseOctopusPowerupCard extends LitElement {
  static get properties() { return { _config: {}, hass: {} }; }
  static getConfigElement() { return document.createElement("domhouse-octopus-powerup-card-editor"); }

  static getStubConfig() {
    return {
      title: "🐙 Octopus PowerUp Card",
      theme_mode: "default",
      show_strategy: true
    };
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this._config = config;
  }

  getStringValue(entityId, fallback = '--:--') {
    if (!entityId || !this.hass || !this.hass.states[entityId]) return fallback;
    let val = this.hass.states[entityId].state;
    return val.length === 8 ? val.substring(0, 5) : val;
  }

  getNumberValue(entityId, decimals, fallbackStr = '0.000') {
    if (!entityId || !this.hass || !this.hass.states[entityId]) return fallbackStr;
    const num = parseFloat(this.hass.states[entityId].state);
    return isNaN(num) ? fallbackStr : num.toFixed(decimals);
  }

  _openMoreInfo(entityId) {
    const event = new Event("hass-more-info", { bubbles: true, cancelable: false, composed: true });
    event.detail = { entityId: entityId };
    this.dispatchEvent(event);
  }

  render() {
    if (!this._config || !this.hass) return html``;

    const titleHtml = this._config.title
        ? html`<div class="card-header-main">${this._config.title}</div>`
        : html``;

    const themeMode = this._config.theme_mode || "default";
    const cardClass = themeMode === "dark" ? "force-dark" : "theme-default";

    // Controlla se la strategia deve essere mostrata (default true)
    const showStrategy = this._config.show_strategy !== false;

    // Lettura entità FISSE
    const t_inizio = this.getStringValue("time.inizio_powerup");
    const t_fine = this.getStringValue("time.fine_powerup");
    const baseline_val = this.getNumberValue("sensor.baseline_octopus_10_giorni", 3);

    // BOX 1: Banner Immagine Ufficiale
    const bannerBox = html`
      <div class="glass-box bordered" style="padding: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; cursor: pointer;" @click=${() => window.open("https://octopusenergy.it/blog/power-up", "_blank")}>
        <img src="https://assets.octopusenergy.it/2500x834/0c9bb63b35/header_blogpost-power-up.png" style="width: 100%; display: block; filter: brightness(0.9);" alt="Octopus Power Up Banner">
      </div>
    `;

    // BOX 2: Orari Selezionati
    const orariBox = html`
      <div class="glass-box bordered">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; color: var(--primary-text-color);">
          <div class="clickable-box" style="background: var(--secondary-background-color); padding: 12px; border-radius: 10px; text-align: center;" @click=${() => this._openMoreInfo("time.inizio_powerup")}>
            <div style="color: var(--secondary-text-color); margin-bottom: 5px; font-weight: bold;">🟢 Inizio</div>
            <div style="font-size: 20px; font-weight: bold; color: #00e676;">${t_inizio}</div>
          </div>
          <div class="clickable-box" style="background: var(--secondary-background-color); padding: 12px; border-radius: 10px; text-align: center;" @click=${() => this._openMoreInfo("time.fine_powerup")}>
            <div style="color: var(--secondary-text-color); margin-bottom: 5px; font-weight: bold;">🔴 Fine</div>
            <div style="font-size: 20px; font-weight: bold; color: #ff5252;">${t_fine}</div>
          </div>
        </div>
      </div>
    `;

    // BOX 3: Baseline
    const baselineBox = html`
      <div class="glass-box bordered">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid var(--divider-color); padding-bottom: 10px;">
          <div style="font-size: 18px; font-weight: bold; color: #ff00ff;">⚡ CONSUMO MEDIO</div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; padding: 10px 0;">
          <div style="color: var(--secondary-text-color); margin-bottom: 8px; font-size: 13px; font-weight: bold;">Media da superare (ultimi 10 gg)</div>
          <div style="font-size: 42px; font-weight: 900; color: #00d1ff;">
            ${baseline_val} <span style="font-size: 18px; font-weight: normal; color: var(--secondary-text-color);">kWh</span>
          </div>
        </div>
      </div>
    `;

    // BOX 4: Strategia / Verdetto (Visibilità condizionale)
    const infoBox = html`
      <div class="glass-box bordered" style="box-shadow: var(--ha-card-box-shadow, 0 4px 15px rgba(0,0,0,0.2));">
        <div style="font-size: 16px; font-weight: bold; color: var(--primary-text-color); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
          🎯 Strategia
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: var(--primary-text-color);">
          <div style="background: var(--secondary-background-color); padding: 10px; border-radius: 8px; border-left: 4px solid #00e676;">
            <b style="color: #00e676;">REGOLA D'ORO:</b> Spostare i consumi può farti risparmiare. Tutto il prelievo che supererà i <b>${baseline_val} kWh</b> in questa fascia oraria ti sarà azzerato in bolletta. Accendi i carichi pesanti!
          </div>
        </div>
      </div>
    `;

    return html`
      <ha-card class="${cardClass}">
        ${titleHtml}
        <div class="main-container" style="${!this._config.title ? 'margin-top: 0;' : ''}">
          ${bannerBox}
          ${orariBox}
          ${baselineBox}
          ${showStrategy ? infoBox : html``}
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host { display: block; font-family: var(--primary-font-family, sans-serif); }
      ha-card { border-radius: 20px; padding: 20px; box-sizing: border-box; transition: background 0.3s ease; }

      /* OVERRIDE FOR DARK THEME */
      ha-card.force-dark {
        background: linear-gradient(145deg, #1a1a1a, #282828);
        color: white;
        --primary-text-color: #ffffff;
        --secondary-text-color: #aaaaaa;
        --secondary-background-color: rgba(0,0,0,0.2);
        --divider-color: rgba(255,255,255,0.1);
        --ha-card-box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      }
      ha-card.force-dark .glass-box { background: rgba(255, 255, 255, 0.05); }

      .card-header-main { font-weight: 800; font-size: 24px; color: var(--primary-text-color); padding-bottom: 5px; }
      .main-container { display: flex; flex-direction: column; gap: 20px; margin-top: 20px; }
      .glass-box { background: transparent; padding: 15px; box-sizing: border-box; border-radius: 15px; }
      .bordered { border: 1px solid var(--divider-color); box-shadow: var(--ha-card-box-shadow, 0 4px 15px rgba(0,0,0,0.1)); }
      div { box-sizing: border-box; }

      .clickable-box {
        cursor: pointer;
        transition: all 0.2s ease-in-out;
      }
      .clickable-box:hover {
        opacity: 0.8;
        transform: scale(0.98);
      }
      .clickable-box:active {
        transform: scale(0.95);
      }
    `;
  }
}
customElements.define("domhouse-octopus-powerup-card", DomHouseOctopusPowerupCard);

// =============================================================================
//  EDITOR PER LA CARD
// =============================================================================
class DomHouseOctopusPowerupCardEditor extends LitElement {
  static get properties() { return { hass: {}, _config: {} }; }
  setConfig(config) { this._config = config; }

  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    const target = ev.target;
    const configValue = target.configValue;
    if (!configValue) return;

    // Logica compatibile per leggere i valori dai selettori aggiornati
    let newValue = ev.detail && ev.detail.value !== undefined ? ev.detail.value : target.value;

    if (this._config[configValue] === newValue) return;

    const newConfig = { ...this._config };
    if (newValue === "" || newValue === undefined || newValue === null) {
        delete newConfig[configValue];
    } else {
        newConfig[configValue] = newValue;
    }

    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }

  render() {
    if (!this.hass || !this._config) return html``;
    return html`
      <div class="card-config">
        <div class="vertical-inputs">

            <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${this._config.title !== undefined ? this._config.title : '🐙 Octopus PowerUp Helper'}
                .configValue=${"title"}
                .label=${"Titolo Card (lascia vuoto per nasconderlo)"}
                @value-changed=${this._valueChanged}>
            </ha-selector>

            <ha-selector .hass=${this.hass} .selector=${{ select: { options: [{value: "default", label: "Segui Tema Home Assistant"}, {value: "dark", label: "Tema Scuro (Statico)"}] } }} .value=${this._config.theme_mode || 'default'} .configValue=${"theme_mode"} .label=${"Stile Sfondo Card"} @value-changed=${this._valueChanged}></ha-selector>

            <ha-selector .hass=${this.hass} .selector=${{ boolean: {} }} .value=${this._config.show_strategy !== false} .configValue=${"show_strategy"} .label=${"Mostra pannello 'Strategia'"} @value-changed=${this._valueChanged}></ha-selector>
        </div>

        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid var(--divider-color); text-align: center; opacity: 0.7; font-size: 0.9em;">
            <p>I sensori della baseline e degli orari sono gestiti in modo completamente automatico dall'integrazione. <strong>Clicca sui riquadri dell'orario nella plancia per modificarli.</strong></p>
            Powered by <a href="https://www.domhouse.it" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: bold;">DomHouse.it</a>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .card-config { padding: 10px; color: var(--primary-text-color); }
      .vertical-inputs { display: flex; flex-direction: column; gap: 12px; width: 100%; }
      ha-selector { width: 100%; display: block; }
    `;
  }
}
customElements.define("domhouse-octopus-powerup-card-editor", DomHouseOctopusPowerupCardEditor);

// =============================================================================
//  REGISTRAZIONE UI HOME ASSISTANT
// =============================================================================
window.customCards = window.customCards || [];

window.customCards.push({
  type: "domhouse-octopus-powerup-card",
  name: "DomHouse Octopus Card - PowerUp",
  description: "Monitoraggio interattivo della baseline per le sfide Octopus PowerUp.",
  preview: true,
  documentationURL: "https://www.domhouse.it",
});
