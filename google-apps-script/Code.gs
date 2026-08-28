/**
 * VOTAÇÃO AVE SÍMBOLO DE SÃO SEBASTIÃO — FESTIVAL ENTRE ASAS
 * Backend Google Apps Script com proteção de concorrência LockService e Dashboard de Resultados.
 */

const CONFIG = {
  ABA_VOTOS: 'Votos_Ave_Simbolo',
  ABA_CONFIG: 'Configuracoes',
  TIMEZONE: 'America/Sao_Paulo',
};

/**
 * Ponto de entrada HTTP GET — Renderiza o Web App ou o Dashboard de Resultados
 */
function doGet(e) {
  const page = (e && e.parameter && e.parameter.page) ? String(e.parameter.page).toLowerCase().trim() : '';

  // Se o parâmetro ?page=dashboard (ou ?page=resultados) for passado, exibe o painel de apuração
  if (page === 'dashboard' || page === 'resultados' || page === 'painel' || page === 'apuracao') {
    return HtmlService.createTemplateFromFile('dashboard')
      .evaluate()
      .setTitle('Dashboard de Resultados — Ave Símbolo de São Sebastião')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Página pública padrão de votação (100% intacta)
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
    const isClosed = valor === 'ENCERRADA' || valor === 'ENCERRADO' || valor === 'FECHADA' || valor === 'FECHADO';
    return { status: isClosed ? 'FECHADA' : 'ABERTA' };
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
    lock.waitLock(30000);

    const statusObj = obterStatusVotacao();
    if (statusObj.status === 'FECHADA') {
      return { ok: false, error: 'A votação oficial está fechada no momento.', codigo: 'VOTACAO_FECHADA' };
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
    try { lock.releaseLock(); } catch(e) {}
  }
}

/**
 * Retorna os dados consolidados para o Dashboard de Resultados
 */
function obterResultadosDashboard() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let abaVotos = ss.getSheetByName(CONFIG.ABA_VOTOS);
    const statusObj = obterStatusVotacao();

    const especiesMap = {
      'Beija-flor-rajado': { id: 'beija-flor-rajado', name: 'Beija-flor-rajado', scientific: 'Ramphodon naevius', tag: 'Mata e Áreas Verdes', image: 'https://raw.githubusercontent.com/matheushonorats/votacao-ave-simbolo/main/assets/beija-flor-rajado.jpg', votes: 0 },
      'Surucuá-de-barriga-amarela': { id: 'surucua-de-barriga-amarela', name: 'Surucuá-de-barriga-amarela', scientific: 'Trogon viridis', tag: 'Interior da Mata', image: 'https://raw.githubusercontent.com/matheushonorats/votacao-ave-simbolo/main/assets/surucua-de-barriga-amarela.jpg', votes: 0 },
      'Pintadinho': { id: 'pintadinho', name: 'Pintadinho', scientific: 'Drymophila squamata', tag: 'Sub-bosque e Bambuzais', image: 'https://raw.githubusercontent.com/matheushonorats/votacao-ave-simbolo/main/assets/pintadinho.jpg', votes: 0 },
      'Tucano-de-bico-preto': { id: 'tucano-de-bico-preto', name: 'Tucano-de-bico-preto', scientific: 'Ramphastos vitellinus', tag: 'Copas e Encostas', image: 'https://raw.githubusercontent.com/matheushonorats/votacao-ave-simbolo/main/assets/tucano-de-bico-preto.jpg', votes: 0 },
      'Garça-branca-grande': { id: 'garca-branca-grande', name: 'Garça-branca-grande', scientific: 'Ardea alba', tag: 'Rios e Manguezais', image: 'https://raw.githubusercontent.com/matheushonorats/votacao-ave-simbolo/main/assets/garca-branca-grande.jpg', votes: 0 },
      'Jaó-do-sul': { id: 'jao-do-sul', name: 'Jaó-do-sul', scientific: 'Crypturellus noctivagus', tag: 'Solo da Floresta', image: 'https://raw.githubusercontent.com/matheushonorats/votacao-ave-simbolo/main/assets/jao-do-sul.jpg', votes: 0 }
    };

    if (!abaVotos) {
      _inicializarPlanilha(ss);
      abaVotos = ss.getSheetByName(CONFIG.ABA_VOTOS);
    }

    const ultimaLinha = abaVotos.getLastRow();
    let totalVotos = 0;
    const votosPorDia = {};
    const ultimosVotos = [];

    if (ultimaLinha > 1) {
      const dados = abaVotos.getRange(2, 1, ultimaLinha - 1, 4).getValues();
      totalVotos = dados.length;

      dados.forEach(linha => {
        const dataHoraStr = String(linha[0] || '');
        const aveNome = String(linha[2] || '').trim();

        if (especiesMap[aveNome]) {
          especiesMap[aveNome].votes++;
        } else {
          const matchKey = Object.keys(especiesMap).find(k => k.toLowerCase() === aveNome.toLowerCase());
          if (matchKey) especiesMap[matchKey].votes++;
        }

        const dia = dataHoraStr.split(' ')[0] || dataHoraStr.substring(0, 10);
        if (dia) {
          votosPorDia[dia] = (votosPorDia[dia] || 0) + 1;
        }
      });

      // Últimos 10 votos registrados com e-mail ofuscado para privacidade
      const ultimasLinhas = dados.slice(-10).reverse();
      ultimasLinhas.forEach(l => {
        const email = String(l[1] || '');
        const partesEmail = email.split('@');
        let emailMascarado = email;
        if (partesEmail.length === 2) {
          const user = partesEmail[0];
          const userMasked = user.length <= 3 ? user[0] + '***' : user.substring(0, 3) + '***';
          emailMascarado = userMasked + '@' + partesEmail[1];
        }
        ultimosVotos.push({
          dataHora: String(l[0] || ''),
          emailMascarado: emailMascarado,
          aveNome: String(l[2] || '')
        });
      });
    }

    // Ordenação do ranking
    const ranking = Object.values(especiesMap).map(esp => {
      const percent = totalVotos > 0 ? ((esp.votes / totalVotos) * 100).toFixed(1) : '0.0';
      return {
        ...esp,
        percentage: parseFloat(percent)
      };
    }).sort((a, b) => b.votes - a.votes);

    return {
      ok: true,
      statusVotacao: statusObj.status,
      totalVotos: totalVotos,
      ranking: ranking,
      votosPorDia: votosPorDia,
      ultimosVotos: ultimosVotos,
      ultimaAtualizacao: Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "dd/MM/yyyy HH:mm:ss")
    };
  } catch (err) {
    return {
      ok: false,
      error: 'Erro ao consolidar resultados: ' + err.message
    };
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
    abaConfig.appendRow(['Status da Votação', 'ABERTA', 'Altere para ENCERRADA ou FECHADA quando desejar finalizar o recebimento de votos.']);
    abaConfig.setFrozenRows(1);
    abaConfig.autoResizeColumns(1, 3);
  }
}
