console.info("%c 🐙 DOMHOUSE OCTOPUS POWER UP CARD v1.1.0 (WITH BASELINE) IS LOADED ", "color: white; background: #eab308; font-weight: bold; border: 1px solid white; padding: 2px 6px; border-radius: 4px;");

const LitElement = customElements.get("ha-panel-lovelace")
  ? Object.getPrototypeOf(customElements.get("ha-panel-lovelace"))
  : Object.getPrototypeOf(customElements.get("hc-lovelace"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

class DomHouseOctopusPowerUpCard extends LitElement {
  static get properties() { return { _config: {}, hass: {} }; }
  static getConfigElement() { return document.createElement("domhouse-octopus-powerup-card-editor"); }

  static getStubConfig() {
    return { title: "⚡ Octopus Power Up", theme_mode: "default", show_strategy: true };
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this._config = config;
  }

  getStringValue(entityId, fallback = '--:--') {
    if (!entityId || !this.hass || !this.hass.states[entityId]) return fallback;
    let val = this.hass.states[entityId].state;
    return val.length === 8 && val.includes(':') ? val.substring(0, 5) : val;
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

    const titleHtml = this._config.title ? html`<div class="card-header-main">${this._config.title}</div>` : html``;
    const themeMode = this._config.theme_mode || "default";
    const cardClass = themeMode === "dark" ? "force-dark" : "theme-default";
    const showStrategy = this._config.show_strategy !== false;

    // Lettura delle entità
    const t_inizio = this.getStringValue("time.inizio_powerup");
    const t_fine = this.getStringValue("time.fine_powerup");
    const baseline_val = this.getNumberValue("sensor.octopus_powerup_baseline_media", 3);
    let live_val = this.getNumberValue("sensor.octopus_powerup_live_consumption", 3);

    const d_pu = this.getStringValue("date.data_powerup", "");
    let data_formattata = "--/--/----";
    if (d_pu !== "" && d_pu !== "unknown" && d_pu !== "--:--") {
      const parts = d_pu.split("-");
      if (parts.length === 3) data_formattata = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    let is_active = false;
    if (d_pu !== "" && d_pu !== "unknown") {
      const now = new Date();
      const startStr = `${d_pu}T${t_inizio}:00`;
      const endStr = `${d_pu}T${t_fine}:00`;
      const startDate = new Date(startStr);
      const endDate = new Date(endStr);
      if (now >= startDate && now <= endDate) is_active = true;
    }

    const live_num = parseFloat(live_val) || 0;
    
    const max_target = 5.0; 
    let progress_percent = (live_num / max_target) * 100;
    if (progress_percent > 100) progress_percent = 100;

    let bar_color = "#eab308"; 
    let status_text = "🚀 Accendi tutto! Devi superare la tua media per guadagnare.";
    let status_color = "#eab308";
    let is_pulsing = "pulse-gold";

    if (!is_active) {
      live_val = "--";
      progress_percent = 0;
      bar_color = "transparent";
      status_text = "💤 Power Up non attivo in questo momento";
      status_color = "var(--secondary-text-color)";
      is_pulsing = "";
    } else {
        // Se in diretta stai superando la media, cambia testo!
        if (live_num > parseFloat(baseline_val)) {
            status_text = "🎉 Ottimo! Stai ufficialmente accumulando energia gratis!";
            bar_color = "#00e676";
            status_color = "#00e676";
        }
    }

    // Banner
    const bannerBox = html`
      <div class="glass-box bordered" style="padding: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; cursor: pointer;" @click=${() => window.open("https://octopusenergy.it/blog/power-up", "_blank")}>
        <img src="https://raw.githubusercontent.com/SalvatoreITA/DomHouse-Octopus-PowerUp-Card/refs/heads/main/power_up.PNG" style="width: 100%; display: block; filter: brightness(0.9);" alt="Octopus PowerUP Banner">
      </div>
    `;

    const orariBox = html`
      <div class="glass-box bordered">
        <div class="clickable-box" style="background: var(--secondary-background-color); padding: 12px; border-radius: 10px; text-align: center; margin-bottom: 10px;" @click=${() => this._openMoreInfo("date.data_powerup")}>
          <div style="color: var(--secondary-text-color); margin-bottom: 5px; font-weight: bold;">📅 Data Evento</div>
          <div style="font-size: 20px; font-weight: bold; color: #00d1ff;">${data_formattata}</div>
        </div>
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

    // ECCO IL BLOCCO DELLA MEDIA STORICA REINSERITO!
    const baselineBox = html`
      <div class="glass-box bordered">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid var(--divider-color); padding-bottom: 10px;">
          <div style="font-size: 18px; font-weight: bold; color: #00d1ff;">📊 LA TUA MEDIA (10 GG)</div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; padding: 5px 0 5px 0;">
          <div style="font-size: 32px; font-weight: 900; color: var(--primary-text-color);">
            ${baseline_val} <span style="font-size: 16px; font-weight: normal; color: var(--secondary-text-color);">kWh</span>
          </div>
          <div style="color: var(--secondary-text-color); margin-top: 4px; font-size: 13px; font-weight: bold; text-align: center;">Tutto ciò che consumi sopra questo valore è gratis!</div>
        </div>
      </div>
    `;

    const liveBox = html`
      <div class="glass-box bordered ${is_pulsing}" style="background: transparent;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="font-size: 16px; font-weight: bold; color: var(--primary-text-color);">💰 CONSUMO LIVE</div>
          <div style="font-size: 24px; font-weight: 900; color: ${status_color};">${live_val} <span style="font-size: 14px; font-weight: normal; color: var(--secondary-text-color);">${is_active ? 'kWh' : ''}</span></div>
        </div>
        <div style="width: 100%; height: 26px; background: rgba(0,0,0,0.3); border-radius: 13px; overflow: hidden; position: relative; margin-bottom: 12px; border: 1px solid var(--divider-color);">
           <div style="height: 100%; width: ${progress_percent}%; background: ${bar_color}; transition: width 0.5s ease-in-out, background 0.5s ease-in-out;"></div>
        </div>
        <div style="text-align: center; font-size: 14px; font-weight: bold; color: ${status_color};">${status_text}</div>
      </div>
    `;

    const infoBox = html`
      <div class="glass-box bordered" style="box-shadow: var(--ha-card-box-shadow, 0 4px 15px rgba(0,0,0,0.2));">
        <div style="font-size: 16px; font-weight: bold; color: var(--primary-text-color); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">🎯 Strategia</div>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: var(--primary-text-color);">
          <div style="background: var(--secondary-background-color); padding: 10px; border-radius: 8px; border-left: 4px solid #eab308;">
            <b style="color: #eab308;">REGOLA D'ORO:</b> Più consumi oltre la tua media, più risparmi! Durante queste ore l'energia è letteralmente in regalo. Accendi lavatrice, asciugatrice, forno e ricarica i tuoi dispositivi.
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
          ${liveBox}
          ${showStrategy ? infoBox : html``}
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host { display: block; font-family: var(--primary-font-family, sans-serif); }
      ha-card { border-radius: 20px; padding: 20px; box-sizing: border-box; transition: background 0.3s ease; }
      ha-card.force-dark {
        background: linear-gradient(145deg, #1a1a1a, #282828); color: white;
        --primary-text-color: #ffffff; --secondary-text-color: #aaaaaa;
        --secondary-background-color: rgba(0,0,0,0.2); --divider-color: rgba(255,255,255,0.1);
        --ha-card-box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      }
      ha-card.force-dark .glass-box { background: rgba(255, 255, 255, 0.05); }
      .card-header-main { font-weight: 800; font-size: 24px; color: var(--primary-text-color); padding-bottom: 5px; }
      .main-container { display: flex; flex-direction: column; gap: 20px; margin-top: 20px; }
      .glass-box { background: transparent; padding: 15px; box-sizing: border-box; border-radius: 15px; }
      .bordered { border: 1px solid var(--divider-color); box-shadow: var(--ha-card-box-shadow, 0 4px 15px rgba(0,0,0,0.1)); }
      div { box-sizing: border-box; }
      .clickable-box { cursor: pointer; transition: all 0.2s ease-in-out; }
      .clickable-box:hover { opacity: 0.8; transform: scale(0.98); }
      .clickable-box:active { transform: scale(0.95); }
      @keyframes pulseGold {
        0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(234, 179, 8, 0); }
        100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
      }
      .pulse-gold { animation: pulseGold 2s infinite; border-color: rgba(234, 179, 8, 0.7) !important; }
    `;
  }
}
customElements.define("domhouse-octopus-powerup-card", DomHouseOctopusPowerUpCard);

class DomHouseOctopusPowerUpCardEditor extends LitElement {
  static get properties() { return { hass: {}, _config: {} }; }
  setConfig(config) { this._config = config; }
  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    const target = ev.target;
    const configValue = target.configValue;
    if (!configValue) return;
    let newValue = ev.detail && ev.detail.value !== undefined ? ev.detail.value : target.value;
    if (this._config[configValue] === newValue) return;
    const newConfig = { ...this._config };
    if (newValue === "" || newValue === undefined || newValue === null) { delete newConfig[configValue]; } else { newConfig[configValue] = newValue; }
    this._config = newConfig;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
  }
  render() {
    if (!this.hass || !this._config) return html``;
    return html`
      <div class="card-config">
        <div class="vertical-inputs">
            <ha-selector .hass=${this.hass} .selector=${{ text: {} }} .value=${this._config.title !== undefined ? this._config.title : '⚡ Octopus Power Up'} .configValue=${"title"} .label=${"Titolo Card"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ select: { options: [{value: "default", label: "Segui Tema Home Assistant"}, {value: "dark", label: "Tema Scuro (Statico)"}] } }} .value=${this._config.theme_mode || 'default'} .configValue=${"theme_mode"} .label=${"Stile Sfondo Card"} @value-changed=${this._valueChanged}></ha-selector>
            <ha-selector .hass=${this.hass} .selector=${{ boolean: {} }} .value=${this._config.show_strategy !== false} .configValue=${"show_strategy"} .label=${"Mostra pannello 'Strategia'"} @value-changed=${this._valueChanged}></ha-selector>
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
customElements.define("domhouse-octopus-powerup-card-editor", DomHouseOctopusPowerUpCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "domhouse-octopus-powerup-card",
  name: "DomHouse Octopus Card - Power Up",
  description: "Monitoraggio interattivo del bottino gratuito per le sfide Octopus Power Up.",
  preview: true,
});