// corruption-pages.js — Motor de corrupción genérico para todas las páginas (excepto index.html)
document.addEventListener('DOMContentLoaded', () => {
    const signalStatus = document.getElementById('signal-status');
    const nav = document.getElementById('main-nav');
    const header = document.getElementById('hero-header');
    const pageMain = document.getElementById('page-main');
    const pageFooter = document.getElementById('page-footer');
    const corruptedLink = document.getElementById('corrupted-link');
    const corruptTicker = document.getElementById('corrupt-ticker');
    const tickerTrack = document.getElementById('ticker-track');
    const txLostBanner = document.getElementById('tx-lost-banner');
    const staticBurst = document.getElementById('static-burst');
    const chromaBars = document.getElementById('chroma-bars');
    const tearLine = document.getElementById('tear-line');
    const fatalOverlay = document.getElementById('fatal-overlay');
    const fatalLog = document.getElementById('fatal-log');
    const fatalProgressFill = document.getElementById('fatal-progress-fill');
    const fatalProgressValue = document.getElementById('fatal-progress-value');
    const fatalProgressText = document.getElementById('fatal-progress-text');
    const alertBox = document.querySelector('.alerta-roja');
    const logo = document.querySelector('.logo');
    const navList = nav ? nav.querySelector('ul') : null;
    const footerHeading = pageFooter ? pageFooter.querySelector('h2') : null;
    const textTargets = Array.from(document.querySelectorAll('.data-loss'));
    const cardTargets = Array.from(document.querySelectorAll('.bugged-card'));

    const statusMessages = [
        { text: 'SEÑAL: estable // paquetes perdidos: 03', className: 'is-warning' },
        { text: 'SEÑAL: inestable // recurso no verificado', className: 'is-critical' },
        { text: 'SEÑAL: recuperada // cache corrupta activa', className: 'is-warning' },
        { text: 'SEÑAL: duplicada // nodo espejo detectado', className: '' }
    ];

    const fatalMessages = [
        'panic.render.core :: memory access violation :: reboot in progress',
        'fatal.sync.loss :: mirror node promoted :: restarting public feed',
        'kernel.display.err :: checksum failure :: rebuilding front page',
        'critical.cache.poison :: fallback impossible :: forced restart engaged'
    ];

    const progressStates = [
        { value: 9, label: 'ANALIZANDO NODOS ROTOS' },
        { value: 24, label: 'RECUPERANDO CACHE EDITORIAL' },
        { value: 18, label: 'DESFASE DETECTADO // REINTENTANDO' },
        { value: 41, label: 'PURGANDO BLOQUES CORRUPTOS' },
        { value: 39, label: 'RETROCESO DE PAQUETES // ESPERANDO' },
        { value: 63, label: 'SINCRONIZANDO COPIA ESPEJO' },
        { value: 58, label: 'JITTER DE MEMORIA // CONTINUANDO' },
        { value: 82, label: 'RESTAURANDO INTERFAZ PUBLICA' },
        { value: 97, label: 'FORZANDO REARRANQUE FINAL' },
        { value: 94, label: 'BLOQUEO TRANSITORIO // ULTIMO INTENTO' },
        { value: 100, label: 'REINICIO EJECUTADO' }
    ];

    const INITIAL_CLEAN_DURATION_MS = 20000;
    const SECONDARY_REVEAL_DELAY_MS = 55000;
    const FIRST_RESTART_DELAY_MS = 180000;

    const corruptionPhases = [
        { until: 60000,   actionChance: 0.2,  delayMultiplier: 3.4 },
        { until: 120000,  actionChance: 0.45, delayMultiplier: 2.1 },
        { until: 180000,  actionChance: 0.78, delayMultiplier: 1.25 },
        { until: Infinity, actionChance: 1,   delayMultiplier: 1 }
    ];

    let queueIndex = 0;
    let rebootLocked = false;
    const bootTime = Date.now();

    function pickRandom(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    function nextDelay(minDelay, maxDelay) {
        return minDelay + Math.floor(Math.random() * (maxDelay - minDelay + 1));
    }

    function revealElement(element) {
        if (element) { element.hidden = false; }
    }

    function getCurrentCorruptionPhase() {
        const elapsed = Date.now() - bootTime;
        for (const phase of corruptionPhases) {
            if (elapsed < phase.until) { return phase; }
        }
        return corruptionPhases[corruptionPhases.length - 1];
    }

    function activatePrimaryCorruptionLayer() {
        document.body.classList.remove('index-clean-boot');
        document.body.classList.add('index-corrupted', 'corruption-stage-1');
        revealElement(signalStatus);
    }

    function activateSecondaryCorruptionLayer() {
        document.body.classList.add('corruption-stage-2');
        revealElement(corruptedLink);
        revealElement(corruptTicker);
    }

    function updateFatalProgress(value, label) {
        if (fatalProgressFill) { fatalProgressFill.style.width = value + '%'; }
        if (fatalProgressValue) { fatalProgressValue.textContent = value + '%'; }
        if (fatalProgressText) { fatalProgressText.textContent = label; }
    }

    // ── EFECTOS DE GLITCH ──────────────────────────────────

    function triggerTextGlitch() {
        if (!textTargets.length) { return; }
        const target = pickRandom(textTargets);
        target.classList.add('glitching');
        window.setTimeout(() => { target.classList.remove('glitching'); }, 280);
    }

    function triggerCardDesync() {
        if (!cardTargets.length) { return; }
        const target = pickRandom(cardTargets);
        target.classList.add('card-desync');
        window.setTimeout(() => { target.classList.remove('card-desync'); }, 220);
    }

    function triggerGhostCard() {
        if (!cardTargets.length) { return; }
        const target = pickRandom(cardTargets);
        target.classList.add('card-ghost');
        window.setTimeout(() => { target.classList.remove('card-ghost'); }, 420);
    }

    function flickerScreen() {
        document.body.classList.add('screen-flicker');
        if (header) { header.classList.add('header-desync'); }
        if (alertBox) { alertBox.classList.add('corrupt-alert'); }
        window.setTimeout(() => {
            document.body.classList.remove('screen-flicker');
            if (header) { header.classList.remove('header-desync'); }
            if (alertBox) { alertBox.classList.remove('corrupt-alert'); }
        }, 240);
    }

    function rotateStatus() {
        if (!signalStatus) { return; }
        const nextStatus = pickRandom(statusMessages);
        signalStatus.className = 'signal-status';
        if (nextStatus.className) { signalStatus.classList.add(nextStatus.className); }
        signalStatus.innerHTML = '<strong>' + nextStatus.text.split(':')[0] + ':</strong>' + nextStatus.text.slice(nextStatus.text.indexOf(':') + 1);
    }

    function ruptureNav() {
        if (!nav) { return; }
        nav.classList.add('nav-rupture');
        window.setTimeout(() => { nav.classList.remove('nav-rupture'); }, 380);
    }

    function triggerAmbientDistortion() {
        document.body.classList.add('scan-burst');
        if (Math.random() > 0.45) { document.body.classList.add('vignette-pulse'); }
        if (signalStatus) { signalStatus.classList.add('status-drift'); }
        if (cardTargets.length) { pickRandom(cardTargets).classList.add('card-signal-loss'); }
        window.setTimeout(() => {
            document.body.classList.remove('scan-burst', 'vignette-pulse');
            if (signalStatus) { signalStatus.classList.remove('status-drift'); }
            cardTargets.forEach((c) => c.classList.remove('card-signal-loss'));
        }, 760);
    }

    function triggerLayoutFailure() {
        if (rebootLocked) { return; }
        const failures = [
            () => { if (!header) { return; } header.classList.add('header-fault'); window.setTimeout(() => { header.classList.remove('header-fault'); }, 420); },
            () => { if (!pageMain) { return; } pageMain.classList.add('layout-shift'); window.setTimeout(() => { pageMain.classList.remove('layout-shift'); }, 360); },
            () => { if (!cardTargets.length) { return; } const t = pickRandom(cardTargets); t.classList.add('section-dropout'); window.setTimeout(() => { t.classList.remove('section-dropout'); }, 220); }
        ];
        pickRandom(failures)();
    }

    function triggerLogoPhase() {
        if (!logo) { return; }
        logo.classList.add('logo-phase');
        window.setTimeout(() => { logo.classList.remove('logo-phase'); }, 420);
    }

    function triggerFooterEcho() {
        if (!footerHeading) { return; }
        footerHeading.classList.add('footer-echo');
        window.setTimeout(() => { footerHeading.classList.remove('footer-echo'); }, 520);
    }

    function triggerGhostNavItem() {
        if (!navList || navList.querySelector('.ghost-nav-item')) { return; }
        const ghostItem = document.createElement('li');
        ghostItem.className = 'ghost-nav-item nav-phantom';
        ghostItem.innerHTML = '<a href="#">Archivo 7</a>';
        navList.appendChild(ghostItem);
        window.setTimeout(() => { ghostItem.classList.remove('nav-phantom'); }, 260);
        window.setTimeout(() => { ghostItem.remove(); }, 1400);
    }

    function triggerConsoleLeak() {
        const leakMessages = [
            '[mirror-node] checksum drift detected in public shell',
            '[omega-route] alternate channel standby: disabled until fault threshold',
            '[renderer] stale frame promoted from cache layer 7',
            '[weazel-core] unresolved diff kept alive for public continuity',
            '[censor-node] editorial.override received :: 3 blocks suppressed',
            '[access-log] unauthorized read on expediente_007 :: source masked',
            '[integrity-check] ghost-article-02 :: hash mismatch :: serving cached copy',
            '[signal-router] public.feed redirect pending :: awaiting clearance from: ████████',
            '[ticker] injecting fallback content :: original payload rejected by filter',
            '[archive] classified segment detected in news-feed.bin :: quarantine active'
        ];
        const styles = [
            'color:#ffd36f;font-family:monospace',
            'color:#7dffb2;font-family:monospace',
            'color:#ff9e9e;font-family:monospace'
        ];
        console.log('%c' + pickRandom(leakMessages), pickRandom(styles));
    }

    function triggerStaticBurst() {
        if (!staticBurst) { return; }
        staticBurst.classList.add('static-on');
        window.setTimeout(() => { staticBurst.classList.remove('static-on'); }, 120 + Math.floor(Math.random() * 180));
    }

    function triggerTxLostBanner() {
        if (!txLostBanner || Math.random() > 0.35) { return; }
        txLostBanner.classList.add('tx-active');
        window.setTimeout(() => { txLostBanner.classList.remove('tx-active'); }, 280 + Math.floor(Math.random() * 220));
    }

    function corruptTickerEffect() {
        if (!tickerTrack) { return; }
        if (Math.random() < 0.5) {
            tickerTrack.classList.add('ticker-glitch');
            window.setTimeout(() => { tickerTrack.classList.remove('ticker-glitch'); }, 480);
        } else {
            tickerTrack.classList.add('ticker-critical');
            window.setTimeout(() => { tickerTrack.classList.remove('ticker-critical'); }, 380);
        }
    }

    function triggerChromaBars() {
        if (!chromaBars) { return; }
        chromaBars.classList.add('bars-on');
        window.setTimeout(() => { chromaBars.classList.remove('bars-on'); }, 260);
    }

    function triggerTearLine() {
        if (!tearLine) { return; }
        tearLine.classList.add('tear-active');
        window.setTimeout(() => { tearLine.classList.remove('tear-active'); }, 440);
    }

    function triggerHeroGhosting() {
        if (!header) { return; }
        header.classList.add('hero-ghosting');
        window.setTimeout(() => { header.classList.remove('hero-ghosting'); }, 360);
    }

    function triggerNavScramble() {
        if (!navList) { return; }
        navList.classList.add('nav-scramble');
        window.setTimeout(() => { navList.classList.remove('nav-scramble'); }, 340);
    }

    function triggerSignalJump() {
        if (!signalStatus) { return; }
        signalStatus.classList.add('signal-jump');
        window.setTimeout(() => { signalStatus.classList.remove('signal-jump'); }, 250);
    }

    function triggerCardInvert() {
        if (!cardTargets.length) { return; }
        const target = pickRandom(cardTargets);
        target.classList.add('card-inverted');
        window.setTimeout(() => { target.classList.remove('card-inverted'); }, 240);
    }

    function triggerPhaseTear() {
        document.body.classList.add('phase-tear');
        if (pageMain) { pageMain.classList.add('main-bleed'); }
        window.setTimeout(() => {
            document.body.classList.remove('phase-tear');
            if (pageMain) { pageMain.classList.remove('main-bleed'); }
        }, 320);
    }

    function triggerHeaderDrift() {
        if (!header) { return; }
        header.classList.add('header-background-drift');
        window.setTimeout(() => { header.classList.remove('header-background-drift'); }, 600);
    }

    // ── COLA DE EFECTOS ────────────────────────────────────

    const glitchQueue = [
        { action: triggerTextGlitch,      minDelay: 260, maxDelay: 620 },
        { action: triggerCardDesync,      minDelay: 340, maxDelay: 760 },
        { action: triggerGhostCard,       minDelay: 380, maxDelay: 860 },
        { action: flickerScreen,          minDelay: 700, maxDelay: 1300 },
        { action: rotateStatus,           minDelay: 420, maxDelay: 900 },
        { action: ruptureNav,             minDelay: 760, maxDelay: 1450 },
        { action: triggerAmbientDistortion, minDelay: 360, maxDelay: 820 },
        { action: triggerLayoutFailure,   minDelay: 820, maxDelay: 1500 },
        { action: triggerLogoPhase,       minDelay: 540, maxDelay: 1120 },
        { action: triggerFooterEcho,      minDelay: 820, maxDelay: 1560 },
        { action: triggerGhostNavItem,    minDelay: 1200, maxDelay: 2200 },
        { action: triggerConsoleLeak,     minDelay: 900, maxDelay: 1800 },
        { action: triggerStaticBurst,     minDelay: 180, maxDelay: 520 },
        { action: triggerTxLostBanner,    minDelay: 1800, maxDelay: 3400 },
        { action: corruptTickerEffect,    minDelay: 380, maxDelay: 920 },
        { action: triggerChromaBars,      minDelay: 340, maxDelay: 760 },
        { action: triggerTearLine,        minDelay: 760, maxDelay: 1450 },
        { action: triggerHeroGhosting,    minDelay: 520, maxDelay: 980 },
        { action: triggerNavScramble,     minDelay: 700, maxDelay: 1320 },
        { action: triggerSignalJump,      minDelay: 320, maxDelay: 700 },
        { action: triggerCardInvert,      minDelay: 420, maxDelay: 880 },
        { action: triggerPhaseTear,       minDelay: 820, maxDelay: 1500 },
        { action: triggerHeaderDrift,     minDelay: 640, maxDelay: 1260 }
    ];

    function runGlitchLoop() {
        if (rebootLocked) { return; }
        const current = glitchQueue[queueIndex % glitchQueue.length];
        const phase = getCurrentCorruptionPhase();
        queueIndex += 1;
        if (Math.random() <= phase.actionChance) { current.action(); }
        const minDelay = Math.max(160, Math.floor(current.minDelay * phase.delayMultiplier));
        const maxDelay = Math.max(minDelay, Math.floor(current.maxDelay * phase.delayMultiplier));
        window.setTimeout(runGlitchLoop, nextDelay(minDelay, maxDelay));
    }

    // ── REINICIO FATAL ─────────────────────────────────────

    function startFatalRestartSequence() {
        if (rebootLocked) { return; }
        rebootLocked = true;

        if (fatalLog) { fatalLog.textContent = pickRandom(fatalMessages); }
        if (fatalOverlay) {
            fatalOverlay.classList.add('visible', 'system-collapse');
            fatalOverlay.setAttribute('aria-hidden', 'false');
        }

        document.body.classList.add('screen-flicker', 'scan-burst', 'vignette-pulse');
        triggerStaticBurst();
        triggerChromaBars();
        triggerTearLine();
        window.setTimeout(triggerStaticBurst, 320);
        window.setTimeout(triggerChromaBars, 460);
        window.setTimeout(triggerStaticBurst, 720);
        window.setTimeout(triggerTearLine, 860);
        if (txLostBanner) {
            txLostBanner.classList.add('tx-active');
            window.setTimeout(() => { txLostBanner.classList.remove('tx-active'); }, 1400);
        }
        if (tickerTrack) { tickerTrack.classList.add('ticker-critical'); }
        if (header) { header.classList.add('header-fault'); }
        if (pageMain) { pageMain.classList.add('layout-shift'); }

        const shutdownSequence = [signalStatus, nav, header, pageMain, pageFooter, corruptedLink].filter(Boolean);
        progressStates.forEach((state, index) => {
            window.setTimeout(() => { updateFatalProgress(state.value, state.label); }, 420 * index);
        });
        shutdownSequence.forEach((node, index) => {
            window.setTimeout(() => { node.classList.add('node-fractured'); }, 180 * index);
            window.setTimeout(() => { node.classList.add('node-offline'); }, 180 * index + 220);
        });

        if (fatalLog) {
            window.setTimeout(() => { fatalLog.textContent = 'public.interface.shutdown :: blocks offline sequentially :: restart imminent'; }, 1100);
            window.setTimeout(() => { fatalLog.textContent = 'rebuild stalled :: rolling back one frame :: retrying'; }, 2300);
            window.setTimeout(() => { fatalLog.textContent = 'last safe frame lost :: forcing reboot now'; }, 3700);
        }

        window.setTimeout(() => { window.location.reload(); }, 5200);
    }

    // ── ARRANQUE ───────────────────────────────────────────

    window.setTimeout(activatePrimaryCorruptionLayer, INITIAL_CLEAN_DURATION_MS);
    window.setTimeout(activateSecondaryCorruptionLayer, SECONDARY_REVEAL_DELAY_MS);
    window.setTimeout(runGlitchLoop, INITIAL_CLEAN_DURATION_MS + 600);
    window.setTimeout(startFatalRestartSequence, FIRST_RESTART_DELAY_MS);
});
