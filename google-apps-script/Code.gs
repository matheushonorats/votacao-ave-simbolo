/**
 * VOTAÇÃO AVE SÍMBOLO DE SÃO SEBASTIÃO — FESTIVAL ENTRE ASAS
 * Backend Google Apps Script com proteção de concorrência LockService.
 */

const CONFIG = {
  ABA_VOTOS: 'Votos_Ave_Simbolo',
  ABA_CONFIG: 'Configuracoes',
  TIMEZONE: 'America/Sao_Paulo',
};

/**
 * Ponto de entrada HTTP GET — Renderiza o Web App
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Votação Ave Símbolo — Festival Entre Asas')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper para inclusão modular de CSS e JS
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Retorna o status atual da votação
 */
function obterStatusVotacao() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let abaConfig = ss.getSheetByName(CONFIG.ABA_CONFIG);

    if (!abaConfig) {
      _inicializarPlanilha(ss);
      return { status: 'ABERTA' };
    }

    const valor = String(abaConfig.getRange('B2').getValue() || 'ABERTA').trim().toUpperCase();
    return { status: valor === 'ENCERRADA' ? 'ENCERRADA' : 'ABERTA' };
  } catch (err) {
    return { status: 'ABERTA' };
  }
}

/**
 * Registra o voto com proteção de concorrência (LockService) para milhares de acessos simultâneos
 */
function computarVoto(payload) {
  const lock = LockService.getScriptLock();
  
  try {
    // Aguarda até 30 segundos para obter a trava de escrita exclusiva
    lock.waitLock(30000);

    const statusObj = obterStatusVotacao();
    if (statusObj.status === 'ENCERRADA') {
      return { ok: false, error: 'A votação oficial já foi encerrada.', codigo: 'VOTACAO_ENCERRADA' };
    }

    const email = String(payload.email || '').trim().toLowerCase();
    const birdName = String(payload.birdName || '').trim();
    const scientificName = String(payload.scientificName || '').trim();
    const userIp = String(payload.userIp || '').trim();
    const userAgent = String(payload.userAgent || '').substring(0, 300);

    if (!email || !birdName) {
      return { ok: false, error: 'E-mail ou ave não informados.' };
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let abaVotos = ss.getSheetByName(CONFIG.ABA_VOTOS);

    if (!abaVotos) {
      _inicializarPlanilha(ss);
      abaVotos = ss.getSheetByName(CONFIG.ABA_VOTOS);
    }

    // ── Verificação de Voto Único por E-mail (Thread-Safe) ─────
    const ultimaLinha = abaVotos.getLastRow();
    if (ultimaLinha > 1) {
      const emailsCadastrados = abaVotos.getRange(2, 2, ultimaLinha - 1, 1).getValues().map(r => String(r[0]).trim().toLowerCase());
      if (emailsCadastrados.includes(email)) {
        return {
          ok: false,
          error: 'Este e-mail já registrou um voto anteriormente.',
          codigo: 'VOTO_DUPLICADO'
        };
      }
    }

    // ── Gravação do Voto ───────────────────────────────────────
    const timestamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");
    abaVotos.appendRow([timestamp, email, birdName, scientificName, userIp, userAgent]);
    SpreadsheetApp.flush();

    return {
      ok: true,
      message: 'Voto registrado com sucesso para a espécie: ' + birdName
    };

  } catch (err) {
    return {
      ok: false,
      error: 'Erro no processamento do voto: ' + err.message
    };
  } finally {
    // Libera a trava para o próximo votante na fila
    try { lock.releaseLock(); } catch(e) {}
  }
}

/**
 * Cria automaticamente as abas com estrutura visual padrão
 */
function _inicializarPlanilha(ss) {
  let abaVotos = ss.getSheetByName(CONFIG.ABA_VOTOS);
  if (!abaVotos) {
    abaVotos = ss.insertSheet(CONFIG.ABA_VOTOS);
    abaVotos.appendRow(['Data/Hora', 'E-mail', 'Ave Votada', 'Nome Científico', 'IP', 'Dispositivo']);
    abaVotos.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#16423c').setFontColor('#ffffff');
    abaVotos.setFrozenRows(1);
  }

  let abaConfig = ss.getSheetByName(CONFIG.ABA_CONFIG);
  if (!abaConfig) {
    abaConfig = ss.insertSheet(CONFIG.ABA_CONFIG);
    abaConfig.appendRow(['Parâmetro', 'Valor', 'Descrição']);
    abaConfig.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#0e2a38').setFontColor('#ffffff');
    abaConfig.appendRow(['Status da Votação', 'ABERTA', 'Altere para ENCERRADA quando desejar finalizar o recebimento de votos.']);
    abaConfig.setFrozenRows(1);
    abaConfig.autoResizeColumns(1, 3);
  }
}
