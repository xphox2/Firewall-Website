/* ==========================================================================
   FIREWALL-MON INTERACTIVE CONTROLLER
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Copy CLI command helper
    setupClipboards();

    // 2. Quickstart tabs
    setupQuickstartTabs();

    // 3. Live Dashboard Simulator
    setupDashboardSimulator();

    // 4. Config Diff Tabs
    setupConfigDiffTabs();

    // 5. sFlow Spike Triage Anomaly
    setupFlowTriage();

    // 6. Security Audit Dots Generator
    generateAuditDots();

    // 7. Mobile Navigation Toggle
    setupMobileNav();
});

/**
 * Clipboard & copy button handlers
 */
function setupClipboards() {
    // Hero command copy
    const btnCopy = document.getElementById("btn-copy");
    const cliCmd = document.getElementById("cli-cmd");
    
    if (btnCopy && cliCmd) {
        btnCopy.addEventListener("click", () => {
            navigator.clipboard.writeText(cliCmd.textContent.trim()).then(() => {
                const originalText = window.t ? window.t("hero.copy_btn") : btnCopy.querySelector(".copy-text").textContent;
                btnCopy.querySelector(".copy-text").textContent = window.t ? window.t("hero.copied_btn") : "Copied!";
                btnCopy.style.borderColor = "var(--success)";
                btnCopy.style.color = "var(--success)";
                
                setTimeout(() => {
                    btnCopy.querySelector(".copy-text").textContent = originalText;
                    btnCopy.style.borderColor = "";
                    btnCopy.style.color = "";
                }, 2000);
            });
        });
    }

    // Code blocks copying in Quick Start
    document.querySelectorAll(".btn-copy-code").forEach(btn => {
        btn.addEventListener("click", () => {
            const clipText = btn.getAttribute("data-clipboard");
            if (clipText) {
                navigator.clipboard.writeText(clipText).then(() => {
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    `;
                    btn.style.borderColor = "var(--success)";
                    
                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                        btn.style.borderColor = "";
                    }, 2000);
                });
            }
        });
    });
}

/**
 * Toggles for installation options
 */
function setupQuickstartTabs() {
    const tabs = document.querySelectorAll(".qs-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active states
            tabs.forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".qs-pane").forEach(p => p.classList.add("hidden"));
            
            // Add active state to clicked
            tab.classList.add("active");
            const paneId = tab.getAttribute("data-qs");
            const targetPane = document.getElementById(paneId);
            if (targetPane) {
                targetPane.classList.remove("hidden");
            }
        });
    });
}

/**
 * Interactive Dashboard Simulator logic
 */
function setupDashboardSimulator() {
    const devices = {
        "hq-fortigate": {
            name: "HQ-FortiGate-01",
            vendor: "Fortinet SNMP Profile (FortiOS v7.2.4)",
            cpu: 24,
            sessions: "41,208",
            vpn: "12 / 12",
            ha: "Active-Passive",
            haTrend: "Synced (Peer OK)",
            logs: [
                "[INFO] Poller cycle complete for device HQ-FortiGate-01. All OIDs matching vendor profile.",
                "[TRAP] FortiOS: HA status verified healthy. Active node in primary unit.",
                "[INFO] sFlow interface raw batch pushed to PostgreSQL flow_samples (Pgx batch INSERT: OK)",
                "[WARN] FortiOS: SSH Login attempted from 10.100.12.80 - authentication failed."
            ]
        },
        "branch-opnsense": {
            name: "Branch-OPNsense-02",
            vendor: "OPNsense SNMP Profile (AMD64)",
            cpu: 12,
            sessions: "8,940",
            vpn: "2 / 2",
            ha: "CARP Backup",
            haTrend: "Peer Active (10.200.2.1)",
            logs: [
                "[INFO] Poller cycle complete for device Branch-OPNsense-02.",
                "[INFO] CPU core temperatures retrieved: Core0: 42°C, Core1: 45°C.",
                "[INFO] Ingesting flow batch via X-Probe-Batch-ID: e82f1b40",
                "[TRAP] OPNsense carp: link state changed on interface wan: BACKUP"
            ]
        },
        "colo-paloalto": {
            name: "Colo-PaloAlto-01",
            vendor: "Palo Alto Networks SNMP Profile (PAN-OS 10.2)",
            cpu: 48,
            sessions: "114,800",
            vpn: "48 / 50",
            ha: "Active-Active",
            haTrend: "Sessions synced. 0 packet drops",
            logs: [
                "[INFO] Poller cycle complete for device Colo-PaloAlto-01.",
                "[INFO] Session limit: 500,000. Current usage: 22%. Performance threshold normal.",
                "[TRAP] PAN-OS: Tunnel 'vpn-branch-32' state changed to DOWN. Triggering AlertManager route.",
                "[INFO] NetFlow v9 template refreshed; App-ID field (IE 56701) decoded for 114,800 flows."
            ]
        },
        "dc-ciscoasa": {
            name: "DC-CiscoASA-01",
            vendor: "Cisco ASA SNMP Profile (ASA 9.18)",
            cpu: 33,
            sessions: "72,540",
            vpn: "24 / 24",
            ha: "Active-Standby",
            haTrend: "Failover healthy (peer standby)",
            logs: [
                "[INFO] Poller cycle complete for device DC-CiscoASA-01. Cisco enterprise MIBs matched.",
                "[INFO] CISCO-FIREWALL-MIB: connection count 72,540 (cfwConnectionStatValue).",
                "[TRAP] NSEL flow DENIED: 185.112.145.4 → 10.100.4.7:23 (firewall_event=denied).",
                "[INFO] CISCO-MEMORY-POOL-MIB: pool 41% used. Failover pair synchronized."
            ]
        },
        "edge-sonicwall": {
            name: "Edge-SonicWall-03",
            vendor: "SonicWall SNMP Profile (SonicOS v7.0)",
            cpu: 82,
            sessions: "28,450",
            vpn: "1 / 4",
            ha: "Standalone",
            haTrend: "HA not configured",
            logs: [
                "[INFO] Poller cycle complete for device Edge-SonicWall-03.",
                "[WARN] SonicOS CPU usage spike detected: 82%. Hardware SPU ASIC load normal.",
                "[TRAP] SonicOS: Tunnel 'HQ-Core-IPsec' state changed to REKEYING.",
                "[DANGER] SonicOS: Core VPN gateway failed to negotiate IKE Phase 2. Relink scheduled."
            ]
        },
        "home-pfsense": {
            name: "Home-pfSense-01",
            vendor: "pfSense SNMP Profile (pfSense Plus v23.05)",
            cpu: 8,
            sessions: "1,240",
            vpn: "1 / 1",
            ha: "Standalone",
            haTrend: "HA not configured",
            logs: [
                "[INFO] Poller cycle complete for device Home-pfSense-01.",
                "[INFO] Interface wan speed verified: 1000 Mbps full-duplex.",
                "[INFO] Cron task: package update manager returned exit status 0.",
                "[INFO] flow_samples rollup task running: aggregated 5-min flows."
            ]
        },
        "lab-firewalla": {
            name: "Lab-Firewalla-01",
            vendor: "Firewalla SNMP Profile (Linux Kernel 5.15)",
            cpu: 5,
            sessions: "450",
            vpn: "0 / 0",
            ha: "Standalone",
            haTrend: "HA not configured",
            logs: [
                "[INFO] Poller cycle complete for device Lab-Firewalla-01.",
                "[INFO] Remote probe relay ping complete: handshake schema version v0.11.31 verified.",
                "[INFO] CPU memory footprint: 1.2GB/4GB (30% consumed).",
                "[INFO] Flow database vacuum complete. Cleaned 0 rows."
            ]
        }
    };

    let activeDeviceKey = "hq-fortigate";
    const deviceItems = document.querySelectorAll("#sim-device-list .device-item");
    const activeNameEl = document.getElementById("sim-active-name");
    const activeVendorEl = document.getElementById("sim-active-vendor");
    const cpuValEl = document.getElementById("sim-cpu-val");
    const cpuTrendEl = document.getElementById("sim-cpu-trend");
    const sessionsValEl = document.getElementById("sim-sessions-val");
    const vpnValEl = document.getElementById("sim-vpn-val");
    const vpnTrendEl = document.getElementById("sim-vpn-trend");
    const haValEl = document.getElementById("sim-ha-val");
    const haTrendEl = document.getElementById("sim-ha-trend");
    const consoleBodyEl = document.getElementById("sim-console-body");
    const lastPollEl = document.getElementById("sim-last-poll");

    // Dynamic poller simulator timer
    let pollCounter = 0;
    setInterval(() => {
        pollCounter++;
        if (lastPollEl) {
            const agoStr = window.t ? window.t("demo.ago") : "ago";
            lastPollEl.textContent = `${pollCounter}s ${agoStr}`;
        }
        
        // Randomly fluctuate active metric values slightly to make it feel alive
        if (devices[activeDeviceKey]) {
            const dev = devices[activeDeviceKey];
            
            // Fluctuate CPU
            let newCpu = dev.cpu + Math.floor(Math.random() * 7) - 3;
            newCpu = Math.max(1, Math.min(99, newCpu));
            if (cpuValEl) cpuValEl.textContent = newCpu;
            
            if (cpuTrendEl) {
                if (newCpu > 70) {
                    cpuTrendEl.textContent = window.t ? window.t("demo.cpu_trend_high") : "↑ High CPU warning";
                    cpuTrendEl.className = "metric-trend text-danger";
                } else {
                    cpuTrendEl.textContent = window.t ? window.t("demo.cpu_trend_normal") : "↓ Normal load";
                    cpuTrendEl.className = "metric-trend text-success";
                }
            }
            
            // Animate SVG graph paths slightly
            randomizeChartPaths();
        }
        
        // Trigger a fake new log occasionally
        if (Math.random() > 0.6) {
            addNewLogLine();
        }
        
        if (pollCounter >= 30) {
            pollCounter = 0;
            if (lastPollEl) lastPollEl.textContent = window.t ? window.t("demo.just_now") : "Just now";
            const initMsg = window.t ? window.t("demo.initiating_poller_cycle") : "Initiating global poller cycle for device fleet.";
            addNewLogLine("[INFO] " + initMsg);
        }
    }, 1000);

    // Listen for language changes to update simulator strings
    window.addEventListener('languageChanged', () => {
        updateSimulatorUI(devices[activeDeviceKey]);
        const intervalEl = document.querySelector('.poll-interval');
        if (intervalEl) {
            intervalEl.innerHTML = window.t ? window.t("demo.poll_interval") : "Poll interval: <strong>30s</strong>";
        }
    });

    // Switch active device
    deviceItems.forEach(item => {
        item.addEventListener("click", () => {
            deviceItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            
            const deviceKey = item.getAttribute("data-device");
            activeDeviceKey = deviceKey;
            pollCounter = 0;
            if (lastPollEl) lastPollEl.textContent = "Just now";
            
            updateSimulatorUI(devices[deviceKey]);
        });
    });

    function updateSimulatorUI(devData) {
        if (!devData) return;
        
        // Update labels
        if (activeNameEl) activeNameEl.textContent = devData.name;
        if (activeVendorEl) activeVendorEl.textContent = window.t ? window.t(`devices.${activeDeviceKey}.vendor`) : devData.vendor;
        if (cpuValEl) cpuValEl.textContent = devData.cpu;
        
        // CPU trend
        if (cpuTrendEl) {
            if (devData.cpu > 70) {
                cpuTrendEl.textContent = window.t ? window.t("demo.cpu_trend_high") : "↑ High CPU warning";
                cpuTrendEl.className = "metric-trend text-danger";
            } else {
                cpuTrendEl.textContent = window.t ? window.t("demo.cpu_trend_normal") : "↓ Normal load";
                cpuTrendEl.className = "metric-trend text-success";
            }
        }
        
        // Sessions
        if (sessionsValEl) sessionsValEl.textContent = devData.sessions;
        
        // VPN — parse "up / total" so any healthy pair reads as UP (not just
        // the two hardcoded strings the old logic checked for).
        if (vpnValEl) vpnValEl.textContent = devData.vpn;
        if (vpnTrendEl) {
            const parts = String(devData.vpn).split("/").map(s => parseInt(s.trim(), 10));
            const up = parts[0], total = parts[1];
            if (Number.isFinite(total) && total === 0) {
                vpnTrendEl.textContent = window.t ? window.t("demo.vpn_trend_none") : "No tunnels defined";
                vpnTrendEl.className = "metric-trend text-muted";
            } else if (Number.isFinite(up) && Number.isFinite(total) && up >= total) {
                vpnTrendEl.textContent = window.t ? window.t("demo.vpn_trend_up") : "All tunnels UP";
                vpnTrendEl.className = "metric-trend text-success";
            } else {
                vpnTrendEl.textContent = window.t ? window.t("demo.vpn_trend_alert") : "Tunnel degradation Alert";
                vpnTrendEl.className = "metric-trend text-warning";
            }
        }
        
        // HA
        if (haValEl) {
            haValEl.textContent = window.t ? window.t(`devices.${activeDeviceKey}.ha`) : devData.ha;
            if (devData.ha.includes("Active-Passive") || devData.ha.includes("Active-Active") || devData.ha.includes("Active-Standby")) {
                haValEl.className = "metric-value text-success";
            } else if (devData.ha.includes("CARP Backup") || devData.ha.includes("CARP Master")) {
                haValEl.className = "metric-value text-warning";
            } else {
                haValEl.className = "metric-value text-secondary";
            }
        }
        if (haTrendEl) {
            haTrendEl.textContent = window.t ? window.t(`devices.${activeDeviceKey}.haTrend`) : devData.haTrend;
            if (devData.ha.includes("Standalone")) {
                haTrendEl.className = "metric-trend text-muted";
            } else {
                haTrendEl.className = "metric-trend text-success";
            }
        }
        
        // Populate fresh logs
        if (consoleBodyEl) {
            consoleBodyEl.innerHTML = "";
            const localizedLogs = window.t ? window.t(`devices.${activeDeviceKey}.logs`) : devData.logs;
            localizedLogs.forEach((log, index) => {
                const logLine = document.createElement("div");
                logLine.className = "console-line";
                
                const timeStamp = getFormattedTime();
                const originalLog = devData.logs[index] || log;
                const isTrap = originalLog.includes("[TRAP]") || originalLog.includes("TRAP");
                const isWarn = originalLog.includes("[WARN]") || originalLog.includes("WARN");
                const isDanger = originalLog.includes("[DANGER]") || originalLog.includes("DANGER");
                
                let tag = '<span class="line-tag info">[INFO]</span>';
                if (isTrap) tag = '<span class="line-tag success">[TRAP]</span>';
                if (isWarn) tag = '<span class="line-tag warning">[WARN]</span>';
                if (isDanger) tag = '<span class="line-tag danger">[DANGER]</span>';
                
                const cleanMsg = log.replace("[INFO] ", "").replace("[TRAP] ", "").replace("[WARN] ", "").replace("[DANGER] ", "");
                
                logLine.innerHTML = `<span class="line-time">[${timeStamp}]</span> ${tag} <span class="line-content">${cleanMsg}</span>`;
                consoleBodyEl.appendChild(logLine);
            });
        }

        randomizeChartPaths();
    }

    function randomizeChartPaths() {
        const pathInEl = document.getElementById("sim-chart-in");
        const pathOutEl = document.getElementById("sim-chart-out");
        
        if (pathInEl && pathOutEl) {
            // Generate a random wavy line
            let ptIn = "M 0,135 ";
            let ptOut = "M 0,140 ";
            
            const steps = 10;
            const stepWidth = 500 / steps;
            
            for (let i = 1; i <= steps; i++) {
                const x = i * stepWidth;
                
                // Active metrics scale height
                const amp = activeDeviceKey === "edge-sonicwall" ? 90 : 50;
                const offset = activeDeviceKey === "home-pfsense" ? 110 : 80;
                
                const yIn = offset - Math.floor(Math.random() * amp);
                const yOut = offset + 20 - Math.floor(Math.random() * (amp / 2));
                
                ptIn += `Q ${(x - stepWidth/2)},${(yIn - 10)} ${x},${yIn} `;
                ptOut += `Q ${(x - stepWidth/2)},${(yOut - 5)} ${x},${yOut} `;
            }
            
            ptIn += "L 500,150 L 0,150 Z";
            ptOut += "L 500,150 L 0,150 Z";
            
            pathInEl.setAttribute("d", ptIn);
            pathOutEl.setAttribute("d", ptOut);
        }
    }

    function addNewLogLine(customMsg = null) {
        if (!consoleBodyEl) return;
        
        const dev = devices[activeDeviceKey];
        let msg = customMsg;
        let originalMsg = customMsg;
        
        if (!msg && dev) {
            const localizedLogs = window.t ? window.t(`devices.${activeDeviceKey}.logs`) : dev.logs;
            const index = Math.floor(Math.random() * localizedLogs.length);
            msg = localizedLogs[index];
            originalMsg = dev.logs[index];
        }
        
        if (!msg) return;
        
        const logLine = document.createElement("div");
        logLine.className = "console-line";
        
        const timeStamp = getFormattedTime();
        const checkMsg = originalMsg || msg;
        const isTrap = checkMsg.includes("[TRAP]") || checkMsg.includes("TRAP");
        const isWarn = checkMsg.includes("[WARN]") || checkMsg.includes("WARN");
        const isDanger = checkMsg.includes("[DANGER]") || checkMsg.includes("DANGER");
        
        let tag = '<span class="line-tag info">[INFO]</span>';
        if (isTrap) tag = '<span class="line-tag success">[TRAP]</span>';
        if (isWarn) tag = '<span class="line-tag warning">[WARN]</span>';
        if (isDanger) tag = '<span class="line-tag danger">[DANGER]</span>';
        
        const cleanMsg = msg.replace("[INFO] ", "").replace("[TRAP] ", "").replace("[WARN] ", "").replace("[DANGER] ", "");
        
        logLine.innerHTML = `<span class="line-time">[${timeStamp}]</span> ${tag} <span class="line-content">${cleanMsg}</span>`;
        
        consoleBodyEl.appendChild(logLine);
        
        // Auto scroll to bottom
        consoleBodyEl.scrollTop = consoleBodyEl.scrollHeight;
        
        // Remove top lines if too many to prevent memory overflow
        if (consoleBodyEl.children.length > 30) {
            consoleBodyEl.removeChild(consoleBodyEl.firstChild);
        }
    }

    function getFormattedTime() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    }
}

/**
 * Tabbed toggles for Config Diff Viewer
 */
function setupConfigDiffTabs() {
    const tabs = document.querySelectorAll(".change-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            const changeId = tab.getAttribute("data-change");
            
            // Hide all contents
            document.querySelectorAll(".diff-view-content").forEach(c => {
                c.classList.add("hidden");
            });
            
            // Show target
            const targetContent = document.getElementById(`content-${changeId}`);
            if (targetContent) {
                targetContent.classList.remove("hidden");
            }
        });
    });
}

/**
 * sFlow flow logs simulated spike triage
 */
function setupFlowTriage() {
    const triageBtn = document.getElementById("btn-triage-spike");
    const alertBox = document.getElementById("triage-alert-box");
    const flowTable = document.getElementById("flow-table");
    
    if (triageBtn && alertBox) {
        triageBtn.addEventListener("click", () => {
            triageBtn.textContent = window.t ? window.t("demo.triage_analyzing") : "Analyzing flows...";
            triageBtn.disabled = true;
            
            setTimeout(() => {
                // Highlight suspicious row
                const spikeRow = document.getElementById("spike-row-1");
                if (spikeRow) {
                    spikeRow.classList.add("highlighted");
                }
                
                // Show alert
                alertBox.classList.remove("hidden");
                
                triageBtn.textContent = window.t ? window.t("demo.triage_completed") : "Triage Completed";
                triageBtn.style.backgroundColor = "var(--success)";
                triageBtn.style.color = "var(--bg)";
                triageBtn.style.borderColor = "var(--success)";
            }, 1200);
        });
    }
}

/**
 * Audit status dots generator (170 dots, all green/verified)
 */
function generateAuditDots() {
    const gridEl = document.getElementById("audit-dots-grid");
    if (!gridEl) return;
    
    gridEl.innerHTML = "";
    
    // Render 170 dots
    for (let i = 1; i <= 170; i++) {
        const dot = document.createElement("div");
        dot.className = "metric-dot";
        gridEl.appendChild(dot);
        
        // Staggered fade in animation
        setTimeout(() => {
            dot.classList.add("verified");
        }, Math.floor(Math.random() * 800) + 100);
    }
}

/**
 * Mobile navigation toggle
 */
function setupMobileNav() {
    const navToggle = document.getElementById("mobile-nav-toggle");
    const siteHeader = document.querySelector(".site-header");

    const headerContainer = document.querySelector(".header-container");
    const logoEl = document.querySelector(".header-container .logo");
    const navEl = document.querySelector(".main-nav");

    // Keep the inline nav on one line in every language by auto-shrinking its
    // font/spacing (--nav-scale) just enough to fit. Only collapse to the
    // hamburger drawer when even the smallest scale can't fit (true small screens).
    const MIN_SCALE = 0.74;  // don't shrink text below this (legibility floor)
    const SMALL_SCREEN = 820; // below this, always use the drawer
    const SLACK = 40;        // keep this much free space so the logo and nav never touch
    const collapse = () => {
        siteHeader.style.removeProperty("--nav-scale");
        siteHeader.classList.add("nav-collapsed");
    };

    function fitNav() {
        if (!siteHeader || !headerContainer || !logoEl || !navEl) return;
        // Start from the expanded bar at full size.
        siteHeader.classList.remove("nav-collapsed");
        siteHeader.style.setProperty("--nav-scale", "1");

        if (window.innerWidth <= SMALL_SCREEN) { collapse(); return; }

        // Free space between the logo and the (right-aligned) nav. The header uses
        // justify-content: space-between, so all slack sits in this gap; it hits 0
        // and the nav overflows once the content is too wide. Shrink until the gap
        // is at least SLACK so the logo and nav never touch.
        const gap = () => navEl.getBoundingClientRect().left - logoEl.getBoundingClientRect().right;
        let scale = 1;
        while (gap() < SLACK && scale > MIN_SCALE + 0.001) {
            scale = Math.max(MIN_SCALE, scale - 0.04);
            siteHeader.style.setProperty("--nav-scale", scale.toFixed(2));
        }
        // Even at the minimum scale it won't fit with breathing room -> use the drawer.
        if (gap() < SLACK) collapse();
        else {
            // Expanded mode: make sure no stale drawer state lingers.
            siteHeader.classList.remove("nav-open");
            document.body.classList.remove("nav-open");
        }
    }

    // Re-fit on resize and whenever the language changes (i18n.js dispatches it).
    window.addEventListener("resize", fitNav);
    window.addEventListener("languageChanged", fitNav);
    fitNav();

    if (navToggle && siteHeader) {
        navToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            siteHeader.classList.toggle("nav-open");
            document.body.classList.toggle("nav-open");
            const isOpen = siteHeader.classList.contains("nav-open");
            navToggle.setAttribute("aria-expanded", isOpen);
        });

        // Close menu when clicking nav links
        document.querySelectorAll(".main-nav .nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                siteHeader.classList.remove("nav-open");
                document.body.classList.remove("nav-open");
            });
        });

        // Close menu when clicking outside header-container
        document.addEventListener("click", (e) => {
            const headerContainer = document.querySelector(".header-container");
            if (headerContainer && !headerContainer.contains(e.target)) {
                siteHeader.classList.remove("nav-open");
                document.body.classList.remove("nav-open");
            }
        });
    }
}

// Feature-card click-to-expand modal. Detail text is pulled from i18n keys
// (features.cardN_detail) via window.t, with English deep-merge fallback.
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("feature-modal");
    if (!modal) return;
    const titleEl = document.getElementById("feature-modal-title");
    const bodyEl = document.getElementById("feature-modal-body");
    const closeBtn = document.getElementById("feature-modal-close");
    let lastFocused = null;

    const tr = (key, fallback) => {
        const v = (typeof window.t === "function") ? window.t(key) : undefined;
        return (v === undefined || v === null) ? fallback : v;
    };

    function openModal(card) {
        const id = card.getAttribute("data-feature");
        const title = card.querySelector(".feature-card-title");
        titleEl.textContent = tr(`features.${id}_title`, title ? title.textContent : "");
        bodyEl.textContent = tr(`features.${id}_detail`, "");
        lastFocused = card;
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        closeBtn.focus();
    }

    function closeModal() {
        modal.hidden = true;
        document.body.style.overflow = "";
        if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll(".feature-card[data-feature]").forEach(card => {
        card.addEventListener("click", () => openModal(card));
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openModal(card);
            }
        });
    });

    modal.querySelectorAll("[data-modal-close]").forEach(el =>
        el.addEventListener("click", closeModal));
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.hidden) closeModal();
    });
});
