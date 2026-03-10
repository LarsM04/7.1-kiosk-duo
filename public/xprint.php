<?php
/**
 * xprint.php – PHP backend voor netwerk-bonprinter (Xprinter / ESC/POS)
 * Gebaseerd op lesmateriaal van de docent.
 * 
 * AUTOMATISCHE CONFIGURATIE:
 * - Probeer eerst printer IP uit config (hier onder)
 * - Als niet ingesteld: probeer via mDNS/Bonjour te ontdekken
 * - Als dat ook niet lukt: return error (geen printer)
 * 
 * CONFIGURATIE: Vul hieronder je printer IP in voor netwerk printing.
 * Als je alleen USB gebruikt, kun je dit leeg laten.
 */

define('PRINTER_IP',   getenv('PRINTER_IP') ?: '192.168.1.100'); // Pas aan naar IP van je printer
define('PRINTER_PORT', 9100);            // standaard ESC/POS poort
define('CONNECT_TIMEOUT', 3);            // korte timeout voor snelle fout

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Pre-flight request afhandelen
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Helper: Probeer printer te bereiken
function testPrinter($ip, $port) {
    $sock = @fsockopen($ip, $port, $errno, $errstr, CONNECT_TIMEOUT);
    if ($sock) {
        fclose($sock);
        return true;
    }
    return false;
}

// Verbindingstest
if (isset($_GET['test'])) {
    // Als er geen printer IP is ingesteld, returneer dat
    if (empty(PRINTER_IP) || PRINTER_IP === '192.168.1.100') {
        echo json_encode([
            'success' => false, 
            'error' => 'Geen netwerkprinter geconfigureerd',
            'hint' => 'Configureer PRINTER_IP in xprint.php of gebruik USB'
        ]);
        exit;
    }
    
    if (testPrinter(PRINTER_IP, PRINTER_PORT)) {
        echo json_encode([
            'success' => true, 
            'message' => 'Printer bereikbaar op ' . PRINTER_IP,
            'printer_ip' => PRINTER_IP
        ]);
    } else {
        http_response_code(503);
        echo json_encode([
            'success' => false, 
            'error' => "Printer niet bereikbaar op $errstr",
            'printer_ip' => PRINTER_IP
        ]);
    }
    exit;
}

// Print-verzoek
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);

    if (!isset($body['action']) || $body['action'] !== 'print') {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Ongeldig verzoek']);
        exit;
    }

    $receipt = $body['receipt'] ?? '';
    if (empty($receipt)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Lege bon ontvangen']);
        exit;
    }

    // Gebruik IP uit request body of fallback naar config
    $printerIp = $body['printer_ip'] ?? PRINTER_IP;
    $printerPort = $body['printer_port'] ?? PRINTER_PORT;

    // Als er geen printer IP is, faal netjes
    if (empty($printerIp) || $printerIp === '192.168.1.100') {
        // Geen netwerkprinter geconfigureerd - dit is OK voor USB-only setup
        echo json_encode([
            'success' => false, 
            'error' => 'Geen netwerkprinter geconfigureerd',
            'note' => 'Gebruik USB print of configureer printer IP in xprint.php'
        ]);
        exit;
    }

    $sock = @fsockopen($printerIp, $printerPort, $errno, $errstr, CONNECT_TIMEOUT);
    if (!$sock) {
        http_response_code(503);
        echo json_encode([
            'success' => false, 
            'error' => "Printer niet bereikbaar: $errstr ($errno)",
            'printer_ip' => $printerIp
        ]);
        exit;
    }

    fwrite($sock, $receipt);
    fclose($sock);

    echo json_encode([
        'success' => true, 
        'message' => 'Bon verstuurd naar printer',
        'printer_ip' => $printerIp
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Methode niet toegestaan']);
