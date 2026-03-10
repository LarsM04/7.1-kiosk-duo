/**
 * printer.js – USB (WebUSB) en netwerk (via xprint.php) bonprinter ondersteuning
 * Gebaseerd op lesmateriaal van de docent (Xprinter demo)
 * 
 * AUTOMATISCHE CONFIGURATIE: Probeert automatisch een printer te vinden.
 * - Eerst: USB/WebUSB printer (auto-detect + manual select)
 * - Fallback: Network printer via xprint.php
 */

const Printer = {
  selectedDevice: null,
  isReady: false,
  lastError: null,
  printMethod: null, // 'usb' | 'network' | null
  printerIp: null, // Configurable printer IP address
  printerPort: 9100, // Default ESC/POS port

  // Bekende printer vendor-IDs (uit lesmateriaal docent)
  VENDORS: [
    0x0483, // STM / Xprinter
    0x04b8, // Seiko Epson
    0x0456, // Microtek
    0x067b, // Prolific Technology
  ],

  /** Load printer configuration from localStorage */
  loadConfig() {
    const savedIp = localStorage.getItem('printer_ip');
    if (savedIp) {
      Printer.printerIp = savedIp;
      console.log('[Printer] Config loaded - IP:', savedIp);
    }
  },

  /** Save printer IP to localStorage */
  saveConfig(ip) {
    Printer.printerIp = ip;
    localStorage.setItem('printer_ip', ip);
    console.log('[Printer] Config saved - IP:', ip);
    Printer._notifyStatus('configured', `Printer IP ingesteld: ${ip}`);
  },

  /** Configure printer IP address for network printing */
  configure(ip) {
    if (!ip || ip.trim() === '') {
      Printer.lastError = 'Ongeldig IP adres';
      return false;
    }
    // Basic IP validation
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(ip)) {
      Printer.lastError = 'Ongeldig IP adres formaat';
      return false;
    }
    Printer.saveConfig(ip.trim());
    return true;
  },

  /** Get current printer IP (from config or default) */
  getPrinterIp() {
    return Printer.printerIp || localStorage.getItem('printer_ip') || null;
  },

  /** Volledige auto-detect: probeer alle methodes zonder gebruikersprompt. */
  async autoDetect() {
    console.log('[Printer] Start automatische detectie...');
    
    // Load config first
    Printer.loadConfig();
    
    // Stap 1: Probeer USB WebUSB
    if (navigator.usb) {
      try {
        // Eerst kijken naar al geautoriseerde apparaten
        const devices = await navigator.usb.getDevices();
        const printer = devices.find((d) => Printer.VENDORS.includes(d.vendorId));
        
        if (printer) {
          Printer.selectedDevice = printer;
          Printer.printMethod = 'usb';
          Printer.isReady = true;
          console.log('[Printer] USB printer gevonden:', printer.productName || printer.manufacturerName || 'Onbekend');
          Printer._notifyStatus('usb-connected', `Printer: ${printer.productName || printer.manufacturerName}`);
          return true;
        }
        
        console.log('[Printer] Geen geautoriseerde USB printer gevonden');
      } catch (e) {
        console.warn('[Printer] USB detectie fout:', e.message);
      }
    }
    
    // Stap 2: Probeer netwerkprinter (zonder te testen, gewoon proberen)
    // Dit faalt stil als er geen printer is
    Printer.printMethod = 'network';
    Printer.isReady = true; // Markeer als "klaar" - netwerk wordt pas echt getest bij printen
    console.log('[Printer] Netwerk methode beschikbaar als fallback');
    
    return true; // Altijd succesvol, print wordt later geprobeerd
  },

  /** Auto-detect met gebruikersprompt (voor handmatige selectie) */
  async autoDetectWithPrompt() {
    try {
      if (!navigator.usb) {
        throw new Error('WebUSB niet ondersteund');
      }

      // First, try to get already authorized devices
      const devices = await navigator.usb.getDevices();
      const printer = devices.find(device => 
        Printer.VENDORS.includes(device.vendorId)
      );

      if (printer) {
        Printer.selectedDevice = printer;
        Printer.printMethod = 'usb';
        Printer.isReady = true;
        console.log('[Printer] USB printer gevonden:', printer.productName || printer.manufacturerName);
        return true;
      }

      // If no authorized device found, request user to select one
      const filters = Printer.VENDORS.map(vendorId => ({ vendorId }));
      Printer.selectedDevice = await navigator.usb.requestDevice({ filters });
      Printer.printMethod = 'usb';
      Printer.isReady = true;
      console.log('[Printer] Printer geselecteerd:', Printer.selectedDevice.productName);
      return true;

    } catch (error) {
      if (error.name !== 'NotFoundError') {
        Printer.lastError = error.message;
        console.error('[Printer] Auto-detectie fout:', error);
      }
      return false;
    }
  },

  /**
   * Initialiseer de printer subsystem.
   * Roep dit aan bij het laden van de pagina.
   * @param {Function} onStatusChange - Optionele callback bij status wijzigingen
   */
  async init(onStatusChange) {
    Printer.onStatusChange = onStatusChange || function() {};
    
    // Voer stille auto-detect uit
    await Printer.autoDetect();
    
    // Listen voor USB device connect/disconnect events
    if (navigator.usb) {
      navigator.usb.addEventListener('connect', (event) => {
        console.log('[Printer] USB apparaat verbonden:', event.device.productName);
        if (Printer.VENDORS.includes(event.device.vendorId)) {
          Printer.selectedDevice = event.device;
          Printer.printMethod = 'usb';
          Printer.isReady = true;
          Printer._notifyStatus('usb-connected', `Printer verbonden: ${event.device.productName}`);
        }
      });
      
      navigator.usb.addEventListener('disconnect', (event) => {
        console.log('[Printer] USB apparaat losgekoppeld:', event.device.productName);
        if (Printer.selectedDevice === event.device) {
          Printer.selectedDevice = null;
          Printer.printMethod = 'network';
          Printer._notifyStatus('usb-disconnected', 'USB printer losgekoppeld, netwerk fallback actief');
        }
      });
    }
    
    Printer._notifyStatus('ready', 'Printer systeem gereed');
    return Printer.isReady;
  },

  _notifyStatus(status, message) {
    if (Printer.onStatusChange) {
      Printer.onStatusChange({ status, message, method: Printer.printMethod });
    }
  },

  /** Laat de gebruiker handmatig een USB-printer selecteren. */
  async selectDevice() {
    if (!navigator.usb) {
      Printer.lastError = 'WebUSB niet ondersteund in deze browser';
      console.warn('[Printer]', Printer.lastError);
      return false;
    }
    try {
      const filters = Printer.VENDORS.map((vendorId) => ({ vendorId }));
      Printer.selectedDevice = await navigator.usb.requestDevice({ filters });
      Printer.printMethod = 'usb';
      Printer.isReady = true;
      console.log('[Printer] Handmatig geselecteerd:', Printer.selectedDevice.productName);
      Printer._notifyStatus('usb-selected', `Printer geselecteerd: ${Printer.selectedDevice.productName}`);
      return true;
    } catch (e) {
      if (e.name !== 'NotFoundError') {
        Printer.lastError = e.message;
        console.error('[Printer] Selectie fout:', e);
      }
      return false;
    }
  },

  /**
   * Bouwt de ESC/POS-bon op uit de ordergegevens.
   * @param {object} orderData - { orderNumber, orderType, items, subtotal, vat, total, date, time }
   */
  buildESCPOS(orderData) {
    const LINE = "------------------------------------\n";
    const pad = (str, len) => String(str).padEnd(len);
    const padLeft = (str, len) => String(str).padStart(len);

    let body =
      "\x1B\x40" +           // Init printer
      "\x1B\x61\x01" +       // Centreer
      "Happy Herbivore\n" +
      "\x1B\x61\x00" +       // Links
      LINE;

    if (orderData.items && orderData.items.length > 0) {
      orderData.items.forEach((item) => {
        const name = pad(`${item.quantity}x ${item.name}`, 24);
        const price = padLeft(`EUR ${item.total.toFixed(2)}`, 12);
        body += name + price + "\n";
      });
    }

    body +=
      LINE +
      pad("Subtotaal:", 24) + padLeft(`EUR ${orderData.subtotal.toFixed(2)}`, 12) + "\n" +
      pad("BTW (9%):", 24)   + padLeft(`EUR ${orderData.vat.toFixed(2)}`, 12) + "\n" +
      LINE +
      pad("TOTAAL:", 24)     + padLeft(`EUR ${orderData.total.toFixed(2)}`, 12) + "\n" +
      LINE +
      "\n" +
      "\x1B\x61\x01" +       // Centreer
      `Bestelnummer: ${String(orderData.orderNumber).padStart(3, "0")}\n` +
      `${orderData.date}  ${orderData.time}\n` +
      `Type: ${orderData.orderType}\n` +
      "\n" +
      "Bedankt voor uw bezoek!\n" +
      "\n\n\n" +
      "\x1D\x56\x00";        // Snij bon

    return body;
  },

  /**
   * Print via USB (WebUSB).
   * @param {object} orderData
   * @returns {Promise<boolean>} Gelukt of niet
   */
  async printUSB(orderData) {
    console.log('[Printer] Attempting USB print...');
    
    try {
      // Geen USB ondersteuning? Skip direct
      if (!navigator.usb) {
        console.log('[Printer] WebUSB niet beschikbaar, probeer netwerk...');
        Printer.lastError = 'WebUSB niet ondersteund';
        return false;
      }

      // Geen apparaat? Probeer auto-detect (zonder user prompt)
      if (!Printer.selectedDevice) {
        try {
          const devices = await navigator.usb.getDevices();
          const printer = devices.find((d) => Printer.VENDORS.includes(d.vendorId));
          if (printer) {
            Printer.selectedDevice = printer;
            console.log('[Printer] USB printer gevonden via late detectie:', printer.productName);
          }
        } catch (e) {
          console.warn('[Printer] Late detectie fout:', e.message);
        }
      }

      // Nog steeds geen printer? Vraag gebruiker om te selecteren
      if (!Printer.selectedDevice) {
        console.log('[Printer] Geen USB printer gevonden, vraag gebruiker...');
        const found = await Printer.autoDetectWithPrompt();
        if (!found || !Printer.selectedDevice) {
          console.log('[Printer] Geen USB printer geselecteerd, fallback naar netwerk');
          Printer.lastError = 'Geen USB printer geselecteerd';
          return false;
        }
      }

      console.log('[Printer] USB printer verbinden...');
      
      // Open en claim device
      await Printer.selectedDevice.open();

      if (Printer.selectedDevice.configuration === null) {
        await Printer.selectedDevice.selectConfiguration(1);
      }

      try {
        await Printer.selectedDevice.claimInterface(0);
      } catch (e) {
        console.log('[Printer] Interface al geclaimd, doorgaan...');
      }

      // Zoek output endpoint
      const intf = Printer.selectedDevice.configuration.interfaces[0].alternates[0];
      const endpoint = intf.endpoints.find((ep) => ep.direction === 'out');
      if (!endpoint) {
        Printer.lastError = 'Output endpoint niet gevonden';
        throw new Error('Output endpoint niet gevonden');
      }

      console.log('[Printer] Data versturen naar printer...');
      
      // Verstuur data
      const encoder = new TextEncoder();
      await Printer.selectedDevice.transferOut(
        endpoint.endpointNumber,
        encoder.encode(Printer.buildESCPOS(orderData))
      );

      console.log('[Printer] USB bon succesvol geprint!');
      Printer._notifyStatus('usb-printed', 'Bon geprint via USB');
      Printer.printMethod = 'usb';

      // Sluit device netjes af
      setTimeout(() => {
        Printer.selectedDevice.close().catch(() => {});
      }, 1000);

      return true;
    } catch (e) {
      Printer.lastError = e.message;
      console.error('[Printer] USB fout:', e.message);
      return false;
    }
  },

  /**
   * Print via netwerk (PHP backend xprint.php).
   * @param {object} orderData
   * @returns {Promise<boolean>}
   */
  async printNetwork(orderData) {
    console.log('[Printer] Attempting network print...');
    
    try {
      // Get printer IP from config or use saved one
      const printerIp = Printer.getPrinterIp();
      console.log('[Printer] Network print - Printer IP:', printerIp);
      
      const requestBody = {
        action: 'print',
        receipt: Printer.buildESCPOS(orderData),
      };
      
      // Add printer IP if configured
      if (printerIp) {
        requestBody.printer_ip = printerIp;
      }
      
      const response = await fetch('xprint.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('[Printer] Network print successful!');
        Printer._notifyStatus('network-printed', 'Bon geprint via netwerk');
        return true;
      } else {
        // Printer niet bereikbaar is geen kritieke fout - vaak is er gewoon geen netwerkprinter
        if (data.error && (data.error.includes('niet bereikbaar') || data.error.includes('niet geconfigureerd'))) {
          console.log('[Printer] Network printer not available:', data.error);
        } else {
          console.error('[Printer] Network printer error:', data.error);
        }
        Printer.lastError = data.error;
        return false;
      }
    } catch (e) {
      // Netwerk fout - vaak is er geen PHP backend of netwerk
      console.log('[Printer] Network not available:', e.message);
      Printer.lastError = e.message;
      return false;
    }
  },

  /**
   * Print methode die automatisch de beste optie kiest.
   * - Probeer USB eerst (stil)
   * - Val terug op netwerk (stil)
   * - Als beide falen, faal dan stil (geen error naar user)
   * 
   * @param {object} orderData
   * @returns {Promise<boolean>} True als print gelukt is
   */
  async print(orderData) {
    console.log('[Printer] Printen starten...', { method: Printer.printMethod });
    
    // Methode 1: USB
    if (navigator.usb) {
      const usbOk = await Printer.printUSB(orderData);
      if (usbOk) {
        Printer.printMethod = 'usb';
        return true;
      }
    }
    
    // Methode 2: Netwerk (fallback)
    const netOk = await Printer.printNetwork(orderData);
    if (netOk) {
      Printer.printMethod = 'network';
      return true;
    }
    
    // Geen van beide methodes werken - faal stil
    console.log('[Printer] Printen mislukt (geen printer beschikbaar)');
    Printer._notifyStatus('error', 'Geen printer beschikbaar');
    return false;
  },

  /**
   * Test of er een werkende printer is.
   * @returns {Promise<{available: boolean, method: string|null, ip: string|null}>}
   */
  async test() {
    // Test USB
    if (navigator.usb) {
      try {
        const devices = await navigator.usb.getDevices();
        const printer = devices.find((d) => Printer.VENDORS.includes(d.vendorId));
        if (printer) {
          return { available: true, method: 'usb', ip: null };
        }
      } catch (e) {}
    }
    
    // Test netwerk
    const printerIp = Printer.getPrinterIp();
    try {
      // Build test URL with printer IP if configured
      let testUrl = 'xprint.php?test=1';
      if (printerIp) {
        testUrl += '&printer_ip=' + encodeURIComponent(printerIp);
      }
      const response = await fetch(testUrl, { method: 'GET' });
      const data = await response.json();
      if (data.success) {
        return { available: true, method: 'network', ip: printerIp };
      }
    } catch (e) {}
    
    return { available: false, method: null, ip: printerIp };
  },
};
