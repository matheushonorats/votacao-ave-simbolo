/**
 * VOTAÇÃO AVE SÍMBOLO DE SÃO SEBASTIÃO — FESTIVAL ENTRE ASAS
 * Lógica do cliente, dados das espécies, showcase cinematográfico e integração.
 */

const CONFIG = {
  WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbyL9UkIQg9rMGb915-kHqlB8tAFJ6mV1QmFGNQefzu744EoSh0HGF2c1NgADCb9U8Xo/exec',
  STATUS_VOTACAO: 'ABERTA',
  SHOWCASE_INTERVAL_MS: 4500,
};

const ASSETS_BASE = 'https://raw.githubusercontent.com/matheushonorats/votacao-ave-simbolo/main/assets';

let BIRDS_DATA = [
  {
    id: 'beija-flor-rajado',
    name: 'Beija-flor-rajado',
    scientific: 'Ramphodon naevius',
    image: `${ASSETS_BASE}/beija-flor-rajado.jpg`,
    focalPoint: 'center 35%',
    category: 'Mata Atlântica',
    tag: 'Mata e Áreas Verdes',
    excerpt: 'Endêmico da Mata Atlântica e o maior beija-flor do bioma, frequenta desde quintais e praças até florestas preservadas.',
    description: `
      <p>O Beija-flor-rajado é uma espécie bastante presente em nossa região, podendo ser observado em diversos locais de São Sebastião, desde os quintais de nossas casas até praças, áreas verdes, bebedouros e áreas de Mata Atlântica preservada.</p>
      <p>Endêmico da Mata Atlântica, o Beija-flor-rajado representa muito bem a importância das aves polinizadoras e nectarívoras para o equilíbrio dos nossos ecossistemas.</p>
      <p>Com 14 a 16 centímetros de comprimento e pesando entre 5,3 e 9 gramas, é considerado o maior beija-flor da Mata Atlântica e está entre os maiores beija-flores do mundo.</p>
      <p>Sua presença tão próxima das pessoas e sua forte relação com a Mata Atlântica fazem do Beija-flor-rajado uma excelente espécie para representar a biodiversidade de São Sebastião.</p>
    `
  },
  {
    id: 'surucua-de-barriga-amarela',
    name: 'Surucuá-de-barriga-amarela',
    scientific: 'Trogon viridis',
    image: `${ASSETS_BASE}/surucua-de-barriga-amarela.jpg`,
    focalPoint: 'center 30%',
    category: 'Mata Atlântica',
    tag: 'Interior da Mata',
    excerpt: 'Ave de beleza exuberante com ventre amarelo-ouro e cabeça azul-escuro, muito admirada por observadores de todo o país.',
    description: `
      <p>O Surucuá-de-barriga-amarela é uma das aves mais espetaculares e emblemáticas que habitam as matas de São Sebastião.</p>
      <p>Com seu ventre amarelo-dourado intenso, dorso verde-metálico e cabeça azul-marinho com anel ocular azul-claro, a espécie se destaca pela elegância incomparável e postura ereta nos galhos.</p>
      <p>Desempenha papel ecológico fundamental na dispersão de frutos de árvores nativas e no controle de insetos da floresta, sendo um bioindicador vivo de áreas florestais saudáveis e protegidas.</p>
      <p>Sua presença constante em nossas trilhas e reservas atrai observadores de aves e turistas de natureza de todo o mundo para São Sebastião.</p>
    `
  },
  {
    id: 'pintadinho',
    name: 'Pintadinho',
    scientific: 'Drymophila squamata',
    image: `${ASSETS_BASE}/pintadinho.jpg`,
    focalPoint: 'center 45%',
    category: 'Mata Atlântica',
    tag: 'Sub-bosque e Bambuzais',
    excerpt: 'Pequena e encantadora ave endêmica com plumagem ricamente pontilhada em preto e branco, habitante típica dos bambuzais.',
    description: `
      <p>O Pintadinho é uma ave de pequeno porte, medindo cerca de 11 centímetros, com um padrão visual único composto por delicadas escamas e manchas pretas e brancas por todo o corpo.</p>
      <p>Endêmico do litoral brasileiro da Mata Atlântica, é uma espécie com forte ligação ecológica com os sub-bosques densos, grotões úmidos e aglomerados de taquaras e bambus nativos de São Sebastião.</p>
      <p>Ágil e sempre ativo, alimenta-se de insetos e pequenas lagartas, percorrendo a folhagem baixa da floresta com vocalizações marcantes e características.</p>
      <p>Por ser uma espécie exclusiva da nossa faixa litorânea e símbolo da sofisticação da microfauna florestal, é uma candidata nobre a Ave Símbolo do município.</p>
    `
  },
  {
    id: 'tucano-de-bico-preto',
    name: 'Tucano-de-bico-preto',
    scientific: 'Ramphastos vitellinus',
    image: `${ASSETS_BASE}/tucano-de-bico-preto.jpg`,
    focalPoint: 'center 25%',
    category: 'Mata Atlântica',
    tag: 'Copas e Encostas',
    excerpt: 'Com bico esculpido e peito amarelo-alaranjado, é um dos mais carismáticos semeadores da floresta atlântica costeira.',
    description: `
      <p>O Tucano-de-bico-preto é uma das espécies mais carismáticas, populares e fáceis de identificar em todo o litoral norte paulista.</p>
      <p>Com cerca de 46 centímetros de comprimento e seu bico negro característico contrastando com o peito amarelo-vivo e garganta branca, seus sobrevoos em pequenos bandos são um espetáculo diário nos morros de São Sebastião.</p>
      <p>É considerado um dos principais dispersores de sementes de grandes árvores nativas (como palmiteiros, figueiras e canelas), exercendo papel essencial na regeneração natural da Mata Atlântica.</p>
      <p>Sua voz forte que ecoa pela serra e seu visual imponente fazem dele uma referência incontestável da fauna sebastianense.</p>
    `
  },
  {
    id: 'garca-branca-grande',
    name: 'Garça-branca-grande',
    scientific: 'Ardea alba',
    image: `${ASSETS_BASE}/garca-branca-grande.jpg`,
    focalPoint: 'center 18%',
    category: 'Litoral e Manguezal',
    tag: 'Rios e Manguezais',
    excerpt: 'Elegante e majestosa, intimamente ligada aos manguezais, rios, orla marítima e ao cotidiano dos pescadores caiçaras.',
    description: `
      <p>A Garça-branca-grande é uma espécie bastante presente em nossa região e de fácil observação, principalmente em áreas próximas a rios, córregos, manguezais e ambientes costeiros. Também é comum encontrá-la nas proximidades de embarcações e áreas utilizadas por pescadores, características que reforçam sua relação com a cultura e o modo de vida caiçara.</p>
      <p>É uma das mais elegantes garças-brancas. Sua plumagem é inteiramente branca e, combinada ao grande porte, às longas pernas e ao longo pescoço, torna a espécie facilmente reconhecível. Em repouso, o pescoço apresenta o característico formato de “S”.</p>
      <p>O bico é longo e amarelo ou amarelo-alaranjado, enquanto as pernas e os dedos são pretos e a íris é amarela. Durante o período reprodutivo, surgem longas penas ornamentais, chamadas egretas, nas costas, na parte inferior do pescoço e no peito, que podem ultrapassar 50 centímetros e são utilizadas durante o ritual de cortejo.</p>
      <p>Por ser uma espécie facilmente observada e intimamente relacionada aos rios, manguezais, áreas costeiras e à cultura caiçara, a Garça-branca-grande também é uma forte representante da biodiversidade e da identidade de São Sebastião.</p>
    `
  },
  {
    id: 'jao-do-sul',
    name: 'Jaó-do-sul',
    scientific: 'Crypturellus noctivagus',
    image: `${ASSETS_BASE}/jao-do-sul.jpg`,
    focalPoint: 'center 45%',
    category: 'Mata Atlântica',
    tag: 'Solo da Floresta',
    excerpt: 'Ave florestal discreta de canto melancólico inconfundível, símbolo vivo da preservação das matas primárias de São Sebastião.',
    description: `
      <p>O Jaó-do-sul é uma ave florestal de solo, pertencente à tradicional família dos tinamídeos (mesmo grupo do inhambu e da macuco).</p>
      <p>Habitante do interior da mata primária e de encostas bem preservadas da Serra do Mar em São Sebastião, a espécie possui plumagem camuflada em tons de cinza e ferrugem que a protege no solo coberto de folhas secas.</p>
      <p>Seu canto melancólico e sonoro é uma das marcas registradas das florestas do litoral paulista, entoado principalmente nas primeiras horas da manhã e ao cair da tarde.</p>
      <p>Por ser uma espécie estritamente dependente de florestas contínuas e conservadas, a sua escolha como Ave Símbolo ressalta o compromisso do município com a conservação das nossas áreas verdes e mananciais.</p>
    `
  }
];

let selectedBirdId = null;
let userIpAddress = '';
let currentSlideIndex = 0;
let showcaseTimer = null;
let isShowcasePaused = false;
let _lastSentHeight = 0;

/**
 * Algoritmo Fisher-Yates para embaralhar a ordem das opções de forma perfeitamente uniforme
 */
function shuffleBirds(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

document.addEventListener('DOMContentLoaded', () => {
  // Embaralha as aves a cada carregamento da página
  shuffleBirds(BIRDS_DATA);

  applyVotingStatus();
  initShowcaseSlider();
  renderBirdsGrid();
  initEventListeners();
  fetchUserIp();
  initSpreadsheetStatusSync();

  setInterval(sendIframeHeight, 500);
  window.addEventListener('resize', sendIframeHeight);
});

function sendIframeHeight() {
  try {
    if (window.parent && window.parent !== window) {
      const h = Math.max(
        document.body ? document.body.scrollHeight : 0,
        document.documentElement ? document.documentElement.scrollHeight : 0
      );
      if (h > 0 && Math.abs(h - _lastSentHeight) > 5) {
        _lastSentHeight = h;
        window.parent.postMessage({ votacaoAveSimbolo: true, height: h }, '*');
      }
    }
  } catch (e) {}
}

function notifyParentToScroll(targetY) {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ votacaoAveSimbolo: true, action: 'scrollTo', top: targetY || 0 }, '*');
    }
  } catch (e) {}
}

function initSpreadsheetStatusSync() {
  if (typeof google !== 'undefined' && google.script && google.script.run) {
    google.script.run
      .withSuccessHandler((res) => {
        if (res && res.status) {
          CONFIG.STATUS_VOTACAO = res.status;
          applyVotingStatus();
        }
      })
      .obterStatusVotacao();
  }
}

function applyVotingStatus() {
  const isClosed = CONFIG.STATUS_VOTACAO === 'ENCERRADA';
  const badge = document.getElementById('headerStatusBadge');
  const votingCard = document.getElementById('votingCard');
  const closedCard = document.getElementById('votingClosedCard');

  if (isClosed) {
    if (badge) {
      badge.textContent = 'Votação Encerrada';
      badge.classList.add('badge-status--closed');
    }
    if (votingCard) votingCard.style.display = 'none';
    if (closedCard) closedCard.style.display = 'block';
  } else {
    if (badge) {
      badge.textContent = 'Votação Oficial Aberta';
      badge.classList.remove('badge-status--closed');
    }
    if (votingCard) votingCard.style.display = 'block';
    if (closedCard) closedCard.style.display = 'none';
  }
}

function fetchUserIp() {
  fetch('https://api.ipify.org?format=json')
    .then(r => r.json())
    .then(d => { userIpAddress = d.ip || ''; })
    .catch(() => { userIpAddress = ''; });
}

// ============================================================
// SHOWCASE CAROUSEL
// ============================================================
function initShowcaseSlider() {
  const slider = document.getElementById('showcaseSlider');
  const dotsContainer = document.getElementById('showcaseDots');
  if (!slider || !dotsContainer) return;

  slider.innerHTML = BIRDS_DATA.map((bird, idx) => `
    <div class="showcase-slide ${idx === 0 ? 'is-active' : ''}" data-index="${idx}">
      <div class="showcase-img-wrap">
        <img src="${bird.image}" alt="${bird.name}" class="showcase-img" style="object-position: ${bird.focalPoint || 'center center'};">
      </div>
      <div class="showcase-overlay">
        <div class="showcase-content">
          <span class="showcase-tag">${bird.tag}</span>
          <div class="showcase-header-row">
            <h3 class="showcase-title">${bird.name}</h3>
            <span class="showcase-scientific">${bird.scientific}</span>
          </div>
          <div class="showcase-actions">
            <button type="button" class="showcase-btn-info" onclick="openBirdModal('${bird.id}')">Conhecer a espécie</button>
            <button type="button" class="showcase-btn-vote" onclick="selectBird('${bird.id}', true)">Votar nesta ave</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  dotsContainer.innerHTML = BIRDS_DATA.map((_, idx) => `
    <span class="showcase-dot ${idx === 0 ? 'is-active' : ''}" data-index="${idx}" onclick="goToSlide(${idx})"></span>
  `).join('');

  document.getElementById('showcasePrev')?.addEventListener('click', () => {
    prevSlide();
    resetShowcaseTimer();
  });
  document.getElementById('showcaseNext')?.addEventListener('click', () => {
    randomNextSlide();
    resetShowcaseTimer();
  });

  const section = document.querySelector('.showcase-section');
  section?.addEventListener('mouseenter', () => { isShowcasePaused = true; });
  section?.addEventListener('mouseleave', () => { isShowcasePaused = false; });

  startShowcaseTimer();
}

function goToSlide(index) {
  currentSlideIndex = (index + BIRDS_DATA.length) % BIRDS_DATA.length;

  document.querySelectorAll('.showcase-slide').forEach((slide, idx) => {
    slide.classList.toggle('is-active', idx === currentSlideIndex);
  });

  document.querySelectorAll('.showcase-dot').forEach((dot, idx) => {
    dot.classList.toggle('is-active', idx === currentSlideIndex);
  });

  restartProgressBar();
}

function randomNextSlide() {
  if (BIRDS_DATA.length <= 1) return;
  let nextIdx;
  do {
    nextIdx = Math.floor(Math.random() * BIRDS_DATA.length);
  } while (nextIdx === currentSlideIndex);
  goToSlide(nextIdx);
}

function prevSlide() {
  goToSlide(currentSlideIndex - 1);
}

function startShowcaseTimer() {
  restartProgressBar();
  clearInterval(showcaseTimer);
  showcaseTimer = setInterval(() => {
    if (!isShowcasePaused) {
      randomNextSlide();
    }
  }, CONFIG.SHOWCASE_INTERVAL_MS);
}

function resetShowcaseTimer() {
  clearInterval(showcaseTimer);
  startShowcaseTimer();
}

function restartProgressBar() {
  const bar = document.getElementById('showcaseProgressBar');
  if (!bar) return;

  bar.style.transition = 'none';
  bar.style.width = '0%';

  setTimeout(() => {
    bar.style.transition = `width ${CONFIG.SHOWCASE_INTERVAL_MS}ms linear`;
    bar.style.width = '100%';
  }, 50);
}

// ============================================================
// RENDERIZAÇÃO DO GRID DE AVES
// ============================================================
function renderBirdsGrid() {
  const container = document.getElementById('birdsGrid');
  if (!container) return;

  container.innerHTML = BIRDS_DATA.map(bird => `
    <article class="bird-card" id="card-${bird.id}" data-bird-id="${bird.id}">
      <div class="bird-card__media">
        <img src="${bird.image}" alt="${bird.name} - ${bird.scientific}" class="bird-card__img" style="object-position: ${bird.focalPoint || 'center center'};" loading="lazy">
        <span class="bird-card__tag">${bird.tag}</span>
        <span class="bird-card__selected-badge">Selecionada</span>
      </div>
      <div class="bird-card__body">
        <h3 class="bird-card__title">${bird.name}</h3>
        <p class="bird-card__scientific">${bird.scientific}</p>
        <p class="bird-card__excerpt">${bird.excerpt}</p>
        <div class="bird-card__actions">
          <button type="button" class="bird-card__btn-info" onclick="openBirdModal('${bird.id}')">Conhecer</button>
          <button type="button" class="bird-card__btn-vote" onclick="selectBird('${bird.id}', true)">Votar</button>
        </div>
      </div>
    </article>
  `).join('');
}

// ============================================================
// EVENTOS E INTERAÇÃO
// ============================================================
function initEventListeners() {
  document.getElementById('modalCloseBtn')?.addEventListener('click', closeBirdModal);
  document.getElementById('modalCloseAction')?.addEventListener('click', closeBirdModal);
  document.getElementById('modalSelectAction')?.addEventListener('click', () => {
    if (activeModalBirdId) {
      selectBird(activeModalBirdId, true);
      closeBirdModal();
    }
  });

  document.getElementById('birdModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'birdModal') closeBirdModal();
  });
  document.getElementById('successModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'successModal') closeSuccessModal();
  });
  document.getElementById('alertModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'alertModal') closeAlertModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBirdModal();
      closeSuccessModal();
      closeAlertModal();
    }
  });

  document.getElementById('btnSuccessClose')?.addEventListener('click', () => {
    closeSuccessModal();
    resetFormForNextVote();
  });
  document.getElementById('btnNewVoteAction')?.addEventListener('click', () => {
    closeSuccessModal();
    resetFormForNextVote();
  });
  document.getElementById('btnAlertModalClose')?.addEventListener('click', () => {
    closeAlertModal();
    const emailInput = document.getElementById('voterEmail');
    if (emailInput) {
      emailInput.value = '';
      emailInput.focus();
    }
  });

  const emailInput = document.getElementById('voterEmail');
  emailInput?.addEventListener('input', () => {
    hideInlineAlert();
    validateEmailInput();
    updateSubmitButtonState();
  });

  document.getElementById('voteForm')?.addEventListener('submit', handleVoteSubmit);
}

// ============================================================
// SELEÇÃO DA AVE
// ============================================================
function selectBird(birdId, scrollToVote = false) {
  if (CONFIG.STATUS_VOTACAO === 'ENCERRADA') {
    showToast('A votação oficial está encerrada.', 'info');
    return;
  }

  const bird = BIRDS_DATA.find(b => b.id === birdId);
  if (!bird) return;

  selectedBirdId = birdId;

  document.querySelectorAll('.bird-card').forEach(card => {
    const isThis = card.getAttribute('data-bird-id') === birdId;
    card.classList.toggle('is-selected', isThis);
    const voteBtn = card.querySelector('.bird-card__btn-vote');
    if (voteBtn) voteBtn.textContent = isThis ? 'Selecionada' : 'Votar';
  });

  const preview = document.getElementById('selectedBirdPreview');
  if (preview) {
    preview.innerHTML = `
      <div class="selected-bird-item">
        <img src="${bird.image}" alt="${bird.name}" class="selected-bird-item__img" style="object-position: ${bird.focalPoint || 'center center'};">
        <div class="selected-bird-item__info">
          <div class="selected-bird-item__title">${bird.name}</div>
          <div class="selected-bird-item__sub">${bird.scientific}</div>
          <span class="selected-bird-item__tag">Ave Selecionada para seu Voto</span>
        </div>
      </div>
    `;
  }

  updateSubmitButtonState();

  if (scrollToVote) {
    const section = document.getElementById('votingSection');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const rect = section.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      notifyParentToScroll(absoluteTop);

      setTimeout(() => {
        document.getElementById('voterEmail')?.focus();
      }, 500);
    }
  }

  showToast(`Você selecionou: ${bird.name}`, 'info');
}

// ============================================================
// MODAL DE DETALHES DA ESPÉCIE
// ============================================================
let activeModalBirdId = null;

function openBirdModal(birdId) {
  const bird = BIRDS_DATA.find(b => b.id === birdId);
  if (!bird) return;

  activeModalBirdId = birdId;
  isShowcasePaused = true;

  const modalImg = document.getElementById('modalImg');
  modalImg.src = bird.image;
  modalImg.alt = `${bird.name} - ${bird.scientific}`;
  modalImg.style.objectPosition = bird.focalPoint || 'center center';

  document.getElementById('modalCategory').textContent = bird.category;
  document.getElementById('modalTitle').textContent = bird.name;
  document.getElementById('modalScientific').textContent = bird.scientific;
  document.getElementById('modalDescription').innerHTML = bird.description;

  const modal = document.getElementById('birdModal');
  modal?.classList.add('is-open');
  modal?.setAttribute('aria-hidden', 'false');

  const modalCard = modal.querySelector('.modal-card');
  if (modalCard) modalCard.scrollTop = 0;

  const cardElement = document.getElementById(`card-${birdId}`);
  if (cardElement) {
    const rect = cardElement.getBoundingClientRect();
    const targetScrollY = window.scrollY + rect.top - 40;
    notifyParentToScroll(targetScrollY);
    modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function closeBirdModal() {
  const modal = document.getElementById('birdModal');
  modal?.classList.remove('is-open');
  modal?.setAttribute('aria-hidden', 'true');
  activeModalBirdId = null;
  isShowcasePaused = false;
}

// ============================================================
// MODAL DE SUCESSO
// ============================================================
function openSuccessModal(bird, email) {
  const birdCard = document.getElementById('successBirdCard');
  if (birdCard && bird) {
    birdCard.innerHTML = `
      <strong>${bird.name}</strong> (<em>${bird.scientific}</em>)<br>
      <span style="font-size:0.8125rem;color:var(--color-text-muted);">Confirmado para o e-mail: ${email}</span>
    `;
  }
  const modal = document.getElementById('successModal');
  modal?.classList.add('is-open');
  modal?.setAttribute('aria-hidden', 'false');

  const votingSection = document.getElementById('votingSection');
  if (votingSection) {
    const rect = votingSection.getBoundingClientRect();
    notifyParentToScroll(window.scrollY + rect.top);
  }
}

function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  modal?.classList.remove('is-open');
  modal?.setAttribute('aria-hidden', 'true');
}

// ============================================================
// MODAL & BANNER DE ALERTA EM ALTO DESTAQUE (VOTO JÁ REGISTRADO / ERRO)
// ============================================================
function openAlertModal(title, message, detailText = '') {
  const modal = document.getElementById('alertModal');
  const titleEl = document.getElementById('alertModalTitle');
  const msgEl = document.getElementById('alertModalMessage');
  const detailEl = document.getElementById('alertModalDetail');

  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;

  if (detailEl) {
    if (detailText) {
      detailEl.textContent = detailText;
      detailEl.style.display = 'block';
    } else {
      detailEl.style.display = 'none';
    }
  }

  modal?.classList.add('is-open');
  modal?.setAttribute('aria-hidden', 'false');

  const votingSection = document.getElementById('votingSection');
  if (votingSection) {
    const rect = votingSection.getBoundingClientRect();
    notifyParentToScroll(window.scrollY + rect.top);
  }
}

function closeAlertModal() {
  const modal = document.getElementById('alertModal');
  modal?.classList.remove('is-open');
  modal?.setAttribute('aria-hidden', 'true');
}

function showInlineAlert(title, text) {
  const banner = document.getElementById('formAlertBanner');
  const titleEl = document.getElementById('formAlertTitle');
  const textEl = document.getElementById('formAlertText');

  if (titleEl) titleEl.textContent = title;
  if (textEl) textEl.textContent = text;
  if (banner) banner.style.display = 'flex';

  const emailInput = document.getElementById('voterEmail');
  if (emailInput) {
    emailInput.classList.add('is-invalid');
  }
}

function hideInlineAlert() {
  const banner = document.getElementById('formAlertBanner');
  if (banner) banner.style.display = 'none';
}

function resetFormForNextVote() {
  selectedBirdId = null;
  hideInlineAlert();

  // Opcional: re-embaralha para a próxima pessoa que for votar no mesmo tablet
  shuffleBirds(BIRDS_DATA);
  renderBirdsGrid();
  initShowcaseSlider();

  const preview = document.getElementById('selectedBirdPreview');
  if (preview) {
    preview.innerHTML = `
      <div class="selected-bird-preview__empty">
        <span class="preview-icon">&bull;</span>
        <p>Nenhuma ave selecionada no momento. Escolha uma das opções acima para continuar.</p>
      </div>
    `;
  }

  const emailInput = document.getElementById('voterEmail');
  if (emailInput) {
    emailInput.value = '';
    emailInput.disabled = false;
    emailInput.classList.remove('is-invalid');
  }

  const errorEl = document.getElementById('emailError');
  if (errorEl) {
    errorEl.classList.remove('is-visible');
    errorEl.textContent = '';
  }

  const btn = document.getElementById('btnSubmitVote');
  if (btn) {
    btn.disabled = true;
    btn.classList.remove('is-loading');
    const btnText = btn.querySelector('.btn-text');
    if (btnText) btnText.textContent = 'Confirmar meu Voto';
  }

  showToast('Pronto para registrar o próximo voto!', 'info');
}

// ============================================================
// VALIDAÇÃO DE E-MAIL
// ============================================================
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).trim().toLowerCase());
}

function validateEmailInput() {
  const input = document.getElementById('voterEmail');
  const errorEl = document.getElementById('emailError');
  const val = input.value.trim();

  if (!val) {
    input.classList.remove('is-invalid');
    errorEl.classList.remove('is-visible');
    errorEl.textContent = '';
    return false;
  }

  if (!validateEmail(val)) {
    input.classList.add('is-invalid');
    errorEl.classList.add('is-visible');
    errorEl.textContent = 'Por favor, informe um endereço de e-mail válido.';
    return false;
  }

  input.classList.remove('is-invalid');
  errorEl.classList.remove('is-visible');
  errorEl.textContent = '';
  return true;
}

function updateSubmitButtonState() {
  if (CONFIG.STATUS_VOTACAO === 'ENCERRADA') return;

  const btn = document.getElementById('btnSubmitVote');
  const emailInput = document.getElementById('voterEmail');
  const isEmailValid = validateEmail(emailInput.value.trim());
  const hasSelectedBird = selectedBirdId !== null;

  if (btn) {
    btn.disabled = !(isEmailValid && hasSelectedBird);
  }
}

// ============================================================
// SUBMISSÃO DO VOTO COM GOOGLE APPS SCRIPT
// ============================================================
async function handleVoteSubmit(e) {
  e.preventDefault();

  if (CONFIG.STATUS_VOTACAO === 'ENCERRADA') {
    openAlertModal('Votação Encerrada', 'O período oficial de votação foi finalizado.');
    return;
  }

  if (!selectedBirdId) {
    openAlertModal('Nenhuma Ave Selecionada', 'Por favor, escolha uma das seis espécies candidatas acima antes de confirmar seu voto.');
    return;
  }

  const emailInput = document.getElementById('voterEmail');
  const email = emailInput.value.trim().toLowerCase();

  if (!validateEmail(email)) {
    validateEmailInput();
    emailInput.focus();
    return;
  }

  const bird = BIRDS_DATA.find(b => b.id === selectedBirdId);
  const btn = document.getElementById('btnSubmitVote');
  
  btn.disabled = true;
  btn.classList.add('is-loading');
  hideInlineAlert();

  const payload = {
    email: email,
    birdId: bird.id,
    birdName: bird.name,
    scientificName: bird.scientific,
    userAgent: navigator.userAgent,
    userIp: userIpAddress
  };

  if (typeof google !== 'undefined' && google.script && google.script.run) {
    google.script.run
      .withSuccessHandler((res) => {
        btn.classList.remove('is-loading');
        if (res && res.ok) {
          openSuccessModal(bird, email);
        } else {
          btn.disabled = false;
          const errMsg = res.error || 'Não foi possível computar o seu voto.';
          openAlertModal('Voto Não Registrado', errMsg);
          showInlineAlert('Atenção: Voto não computado', errMsg);
        }
      })
      .withFailureHandler((err) => {
        btn.classList.remove('is-loading');
        btn.disabled = false;
        openAlertModal('Falha de Comunicação', 'Ocorreu um erro ao conectar com o servidor: ' + err.message);
        showInlineAlert('Erro de Conexão', err.message);
      })
      .computarVoto(payload);
  } else {
    setTimeout(() => {
      btn.classList.remove('is-loading');
      openSuccessModal(bird, email);
    }, 600);
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
