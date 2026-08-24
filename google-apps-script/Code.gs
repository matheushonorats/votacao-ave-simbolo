/**
 * VOTAÇÃO AVE SÍMBOLO DE SÃO SEBASTIÃO — FESTIVAL ENTRE ASAS
 * Backend Google Apps Script Web App
 */

const CONFIG = {
  ABA_VOTOS: 'Votos_Ave_Simbolo',
  TIMEZONE: 'America/Sao_Paulo',
};

function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Votação Ave Símbolo — Festival Entre Asas')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Função pública chamada via google.script.run ou POST
 */
function computarVoto(payload) {
  try {
    const email = String(payload.email || '').trim().toLowerCase();
    const birdName = String(payload.birdName || '').trim();
    const scientificName = String(payload.scientificName || '').trim();
    const userIp = String(payload.userIp || '').trim();
    const userAgent = String(payload.userAgent || '').substring(0, 300);

    if (!email || !birdName) {
      return { ok: false, error: 'E-mail ou ave não informados.' };
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let aba = ss.getSheetByName(CONFIG.ABA_VOTOS);

    if (!aba) {
      aba = ss.insertSheet(CONFIG.ABA_VOTOS);
      aba.appendRow(['Data/Hora', 'E-mail', 'Ave Votada', 'Nome Científico', 'IP', 'Dispositivo']);
      aba.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#16423c').setFontColor('#ffffff');
      aba.setFrozenRows(1);
    }

    const ultimaLinha = aba.getLastRow();
    if (ultimaLinha > 1) {
      const emailsCadastrados = aba.getRange(2, 2, ultimaLinha - 1, 1).getValues().map(r => String(r[0]).trim().toLowerCase());
      if (emailsCadastrados.includes(email)) {
        return {
          ok: false,
          error: 'Este e-mail já registrou um voto anteriormente para a eleição da Ave Símbolo.',
          codigo: 'VOTO_DUPLICADO'
        };
      }
    }

    const timestamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");
    aba.appendRow([timestamp, email, birdName, scientificName, userIp, userAgent]);
    SpreadsheetApp.flush();

    return {
      ok: true,
      message: 'Voto registrado com sucesso para a espécie: ' + birdName
    };

  } catch (err) {
    return {
      ok: false,
      error: 'Erro ao gravar o voto: ' + err.message
    };
  }
}
