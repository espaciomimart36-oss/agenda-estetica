(() => {
    const WA_NUM = "5493757671229";
    const WA_MSG = encodeURIComponent("Hola Braulio! 👋 Vi tu trabajo en Espacio Mimar T y me encantó el diseño. Me gustaría tener algo así para mi negocio. ¿Podés contarme más?");
    const WA_URL = `https://wa.me/${WA_NUM}?text=${WA_MSG}`;

    const WA_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.525 5.845L.057 23.928l6.253-1.44A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-4.988-1.362l-.358-.212-3.713.855.882-3.608-.233-.371A9.794 9.794 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182c5.428 0 9.818 4.39 9.818 9.818 0 5.427-4.39 9.818-9.818 9.818z"/></svg>`;

    const CSS = `
        /* ── Popup Braulio ── */
        #pb-popup {
            position: fixed; top: -180px; left: 50%; transform: translateX(-50%);
            z-index: 999999; width: calc(100% - 32px); max-width: 460px;
            background: linear-gradient(135deg, #0d2b1f 0%, #1a4a34 60%, #0f3526 100%);
            border: 1px solid rgba(114,189,153,0.4);
            border-radius: 20px;
            box-shadow: 0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07);
            padding: 16px 18px 14px 16px;
            transition: top 0.5s cubic-bezier(0.34,1.46,0.64,1);
            display: flex; align-items: center; gap: 13px;
        }
        #pb-popup.pb-visible { top: 14px; }
        #pb-popup-icon {
            width: 46px; height: 46px; flex-shrink: 0; border-radius: 13px;
            background: linear-gradient(135deg, #72bd99, #3f8f6f);
            display: flex; align-items: center; justify-content: center;
            font-size: 21px; box-shadow: 0 6px 16px rgba(114,189,153,0.4);
        }
        #pb-popup-body { flex: 1; min-width: 0; }
        #pb-popup-title {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 14px; font-weight: 700; color: #fff;
            margin: 0 0 2px; line-height: 1.3;
        }
        #pb-popup-sub {
            font-size: 10.5px; color: rgba(255,255,255,0.6);
            margin: 0 0 9px; line-height: 1.45;
        }
        #pb-popup-cta {
            display: inline-flex; align-items: center; gap: 5px;
            background: #25D366; color: #fff; border: none;
            padding: 7px 13px; border-radius: 9px;
            font-size: 11.5px; font-weight: 700; cursor: pointer;
            text-decoration: none; transition: filter 0.18s;
            box-shadow: 0 4px 12px rgba(37,211,102,0.35);
        }
        #pb-popup-cta:hover { filter: brightness(1.1); }
        #pb-popup-dismiss {
            position: absolute; top: 9px; right: 11px;
            background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
            color: rgba(255,255,255,0.7); border-radius: 6px;
            font-size: 10px; font-weight: 700; cursor: pointer;
            padding: 3px 8px; line-height: 1.4; letter-spacing: .03em;
            transition: background 0.18s, color 0.18s;
        }
        #pb-popup-dismiss:hover { background: rgba(255,255,255,0.2); color: #fff; }

        /* ── Barra fija inferior ── */
        #pb-bar {
            position: fixed; bottom: 0; left: 0; right: 0;
            z-index: 99998;
            background: linear-gradient(90deg, #0d2b1f 0%, #1b4d36 50%, #0d2b1f 100%);
            border-top: 1px solid rgba(114,189,153,0.35);
            box-shadow: 0 -8px 28px rgba(0,0,0,0.28);
            padding: 10px 16px;
            display: flex; align-items: center; justify-content: center;
            gap: 12px; flex-wrap: wrap;
        }
        #pb-bar-text {
            font-size: 12px; color: rgba(255,255,255,0.82);
            font-family: 'Montserrat', sans-serif; font-weight: 600;
            white-space: nowrap;
        }
        #pb-bar-text strong { color: #a8dfc0; }
        #pb-bar-cta {
            display: inline-flex; align-items: center; gap: 6px;
            background: #25D366; color: #fff; border: none;
            padding: 8px 16px; border-radius: 10px;
            font-size: 12px; font-weight: 700; cursor: pointer;
            text-decoration: none; white-space: nowrap;
            box-shadow: 0 4px 14px rgba(37,211,102,0.4);
            transition: filter 0.18s;
        }
        #pb-bar-cta:hover { filter: brightness(1.1); }
        #pb-bar-close {
            background: none; border: none;
            color: rgba(255,255,255,0.4); font-size: 16px;
            cursor: pointer; padding: 0 4px; line-height: 1;
            flex-shrink: 0;
        }
        #pb-bar-close:hover { color: rgba(255,255,255,0.8); }
        /* Empujar el contenido de la página para que no tape nada */
        body.pb-bar-active { padding-bottom: 52px !important; }

        /* ── Footer card (dentro del contenido) ── */
        .pb-footer-card { margin: 40px auto 0; max-width: 680px; padding: 0 16px 40px; }
        .pb-footer-inner {
            background: linear-gradient(135deg, #0d2b1f 0%, #1a4a34 55%, #163d2c 100%);
            border: 1px solid rgba(114,189,153,0.3); border-radius: 24px;
            padding: 26px 26px 22px; display: flex; gap: 20px; align-items: center;
            box-shadow: 0 16px 48px rgba(0,0,0,0.18); position: relative; overflow: hidden;
        }
        .pb-footer-inner::before {
            content: ""; position: absolute; top: -60px; right: -60px;
            width: 200px; height: 200px; border-radius: 50%;
            background: radial-gradient(circle, rgba(114,189,153,0.14) 0%, transparent 70%);
            pointer-events: none;
        }
        .pb-footer-badge {
            width: 60px; height: 60px; flex-shrink: 0; border-radius: 16px;
            background: linear-gradient(135deg, #72bd99, #3f8f6f);
            display: flex; align-items: center; justify-content: center;
            font-size: 26px; box-shadow: 0 8px 20px rgba(114,189,153,0.4);
        }
        .pb-footer-text { flex: 1; min-width: 0; }
        .pb-footer-tag { font-size: 10px; font-weight: 800; letter-spacing: .12em; color: #72bd99; text-transform: uppercase; margin: 0 0 5px; }
        .pb-footer-title { font-family: 'Playfair Display', Georgia, serif; font-size: 17px; color: #fff; margin: 0 0 6px; line-height: 1.3; }
        .pb-footer-desc { font-size: 12px; color: rgba(255,255,255,0.58); margin: 0 0 14px; line-height: 1.6; }
        .pb-footer-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
        .pb-footer-pill { font-size: 11px; font-weight: 600; background: rgba(114,189,153,0.14); border: 1px solid rgba(114,189,153,0.3); color: #a8dfc0; padding: 3px 10px; border-radius: 20px; }
        .pb-footer-cta {
            display: inline-flex; align-items: center; gap: 8px;
            background: #25D366; color: #fff; border: none;
            padding: 11px 20px; border-radius: 12px; font-size: 13px; font-weight: 700;
            cursor: pointer; text-decoration: none;
            box-shadow: 0 6px 18px rgba(37,211,102,0.35);
            transition: filter 0.2s, transform 0.15s;
        }
        .pb-footer-cta:hover { filter: brightness(1.08); transform: translateY(-1px); }
        @media (max-width: 560px) {
            .pb-footer-inner { flex-direction: column; text-align: center; }
            .pb-footer-pills { justify-content: center; }
            #pb-bar-text { font-size: 11px; }
        }
    `;

    function injectCSS() {
        const s = document.createElement('style');
        s.textContent = CSS;
        document.head.appendChild(s);
    }

    // ── POPUP (aparece en cada scroll) ─────────────────────────
    let popupBuilt = false, popupVisible = false, autoHideTimer = null, scrollDebounce = null;

    function buildPopup() {
        if (popupBuilt) return;
        popupBuilt = true;
        const el = document.createElement('div');
        el.id = 'pb-popup';
        el.innerHTML = `
            <div id="pb-popup-icon">💻</div>
            <div id="pb-popup-body">
                <p id="pb-popup-title">¿Te gusta lo que ves?</p>
                <p id="pb-popup-sub">Agenda online · Panel de gestión · WhatsApp automático<br>Estéticas · Peluquerías · Gastronomía y más.</p>
                <a id="pb-popup-cta" href="${WA_URL}" target="_blank" rel="noopener">
                    ${WA_SVG} Escribile a Braulio
                </a>
            </div>
            <button id="pb-popup-dismiss" aria-label="Omitir">Omitir</button>
        `;
        document.body.appendChild(el);
        document.getElementById('pb-popup-dismiss').onclick = () => {
            hidePopup();
        };
        el.addEventListener('mouseenter', () => clearTimeout(autoHideTimer));
        el.addEventListener('mouseleave', () => scheduleAutoHide(4000));
    }

    function showPopup() {
        if (popupVisible) return;
        buildPopup();
        popupVisible = true;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            document.getElementById('pb-popup')?.classList.add('pb-visible');
        }));
        scheduleAutoHide(7000);
    }

    function hidePopup() {
        popupVisible = false;
        clearTimeout(autoHideTimer);
        const el = document.getElementById('pb-popup');
        if (el) el.classList.remove('pb-visible');
    }

    function scheduleAutoHide(ms) {
        clearTimeout(autoHideTimer);
        autoHideTimer = setTimeout(hidePopup, ms);
    }

    function onScroll() {
        if (window.scrollY < 80) return;
        clearTimeout(scrollDebounce);
        scrollDebounce = setTimeout(showPopup, 600);
    }

    // ── BARRA FIJA INFERIOR ────────────────────────────────────
    function buildBar() {
        if (document.getElementById('pb-bar')) return;
        const bar = document.createElement('div');
        bar.id = 'pb-bar';
        bar.innerHTML = `
            <span id="pb-bar-text">💻 <strong>¿Te gusta lo que ves?</strong> Podemos hacerlo para tu negocio.</span>
            <a id="pb-bar-cta" href="${WA_URL}" target="_blank" rel="noopener">
                ${WA_SVG} Escribile a Braulio
            </a>
            <button id="pb-bar-close" aria-label="Cerrar">✕</button>
        `;
        document.body.appendChild(bar);
        document.body.classList.add('pb-bar-active');
        document.getElementById('pb-bar-close').onclick = () => {
            bar.remove();
            document.body.classList.remove('pb-bar-active');
        };
    }

    // ── FOOTER CARD ────────────────────────────────────────────
    function buildFooterCard() {
        if (document.querySelector('.pb-footer-card')) return;
        const footer = document.querySelector('.footer, footer, #footer');
        if (!footer) return;
        const div = document.createElement('div');
        div.className = 'pb-footer-card';
        div.innerHTML = `
            <div class="pb-footer-inner">
                <div class="pb-footer-badge">💻</div>
                <div class="pb-footer-text">
                    <p class="pb-footer-tag">Desarrollado a medida · Por Braulio</p>
                    <p class="pb-footer-title">¿Te gusta lo que ves? Podemos hacer lo mismo para vos.</p>
                    <p class="pb-footer-desc">Agenda online con recordatorios automáticos, panel de gestión, integración con WhatsApp y diseño premium personalizado.</p>
                    <div class="pb-footer-pills">
                        <span class="pb-footer-pill">✦ Estéticas</span>
                        <span class="pb-footer-pill">✦ Peluquerías</span>
                        <span class="pb-footer-pill">✦ Gastronomía</span>
                        <span class="pb-footer-pill">✦ Salud & Bienestar</span>
                    </div>
                    <a class="pb-footer-cta" href="${WA_URL}" target="_blank" rel="noopener">
                        ${WA_SVG} Quiero algo así — Escribile a Braulio
                    </a>
                </div>
            </div>
        `;
        footer.parentNode.insertBefore(div, footer);
    }

    // ── INIT ───────────────────────────────────────────────────
    function init() {
        injectCSS();
        buildFooterCard();
        buildBar();
        window.addEventListener('scroll', onScroll, { passive: true });
        // Primera aparición al cargar (sin esperar scroll)
        setTimeout(showPopup, 5000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
