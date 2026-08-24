/**
 * VOTAÇÃO AVE SÍMBOLO — FESTIVAL ENTRE ASAS (SÃO SEBASTIÃO/SP)
 * Backend Google Apps Script para registro direto no Google Sheets.
 */

const CONFIG = {
  ABA_VOTOS: 'Votos_Ave_Simbolo',
  TIMEZONE: 'America/Sao_Paulo',
};

/**
 * Ponto de entrada POST (Recepção dos Votos)
 */
function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const email = String(payload.email || '').trim().toLowerCase();
    const birdName = String(payload.birdName || '').trim();
    const scientificName = String(payload.scientificName || '').trim();
    const userIp = String(payload.userIp || '').trim();
    const userAgent = String(payload.userAgent || '').substring(0, 300);

    if (!email || !birdName) {
      return _json({ ok: false, error: 'E-mail ou ave não informados.' });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let aba = ss.getSheetByName(CONFIG.ABA_VOTOS);

    // Cria a aba caso ainda não exista
    if (!aba) {
      aba = ss.insertSheet(CONFIG.ABA_VOTOS);
      aba.appendRow(['Data/Hora', 'E-mail', 'Ave Votada', 'Nome Científico', 'IP', 'Dispositivo']);
      aba.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#16423c').setFontColor('#ffffff');
      aba.setFrozenRows(1);
    }

    // ── Verificação de Voto Único por E-mail ────────────────────
    const ultimaLinha = aba.getLastRow();
    if (ultimaLinha > 1) {
      const emailsCadastrados = aba.getRange(2, 2, ultimaLinha - 1, 1).getValues().map(r => String(r[0]).trim().toLowerCase());
      if (emailsCadastrados.includes(email)) {
        return _json({
          ok: false,
          error: 'Este e-mail já registrou um voto anteriormente.',
          codigo: 'VOTO_DUPLICADO'
        });
      }
    }

    // ── Gravação do Voto ───────────────────────────────────────
    const timestamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss");
    aba.appendRow([timestamp, email, birdName, scientificName, userIp, userAgent]);
    SpreadsheetApp.flush();

    return _json({
      ok: true,
      message: 'Voto computado com sucesso para a espécie: ' + birdName
    });

  } catch (err) {
    return _json({
      ok: false,
      error: 'Erro no processamento do voto: ' + err.message
    });
  }
}

/**
 * Ponto de entrada GET (Estatísticas e Ranking da Votação)
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const aba = ss.getSheetByName(CONFIG.ABA_VOTOS);

    if (!aba || aba.getLastRow() <= 1) {
      return _json({ totalVotos: 0, ranking: [] });
    }

    const dados = aba.getRange(2, 3, aba.getLastRow() - 1, 1).getValues();
    const contagem = {};

    dados.forEach(r => {
      const ave = String(r[0]).trim();
      if (ave) contagem[ave] = (contagem[ave] || 0) + 1;
    });

    const ranking = Object.keys(contagem)
      .map(ave => ({ ave: ave, votos: contagem[ave] }))
      .sort((a, b) => b.votos - a.votos);

    return _json({
      totalVotos: dados.length,
      ranking: ranking
    });

  } catch (err) {
    return _json({ error: err.message });
  }
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
