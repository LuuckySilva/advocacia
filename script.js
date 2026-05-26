/* =============================================
   SCRIPT.JS — Escritório de Advocacia
   ============================================= */

// ── DADOS DO ORÇAMENTO ──────────────────────
const orcamentoData = {
  trabalhista: {
    title: 'Direito trabalhista',
    l2: 'Honorários (êxito)', v2: '20% a 30%',
    l3: 'Honorários fixos',   v3: 'A partir de R$ 800',
    note: 'Baseado na Tabela OAB/MG. O valor final depende da complexidade, prazo e instância do caso. Agende uma consulta para orçamento personalizado.'
  },
  civel: {
    title: 'Direito cível',
    l2: 'Honorários (êxito)', v2: '15% a 25%',
    l3: 'Honorários fixos',   v3: 'A partir de R$ 1.200',
    note: 'Ações indenizatórias e contratuais. Valor proporcional ao montante discutido. Consulte para avaliação do caso específico.'
  },
  familia: {
    title: 'Direito de família',
    l2: 'Divórcio em cartório', v2: 'A partir de R$ 1.500',
    l3: 'Divórcio judicial',    v3: 'A partir de R$ 2.500',
    note: 'Guarda e alimentos podem ter honorários por acordo ou êxito conforme a complexidade do caso.'
  },
  empresarial: {
    title: 'Direito empresarial',
    l2: 'Revisão de contratos', v2: 'A partir de R$ 500',
    l3: 'Contencioso',          v3: 'A partir de R$ 3.000',
    note: 'Assessoria mensal disponível para empresas. Valores via proposta personalizada conforme o porte.'
  },
  criminal: {
    title: 'Direito criminal',
    l2: 'Defesa em inquérito', v2: 'A partir de R$ 2.000',
    l3: 'Defesa em ação penal', v3: 'A partir de R$ 5.000',
    note: 'Honorários variam por complexidade, vara e instância (1ª, 2ª, STJ/STF). Avaliação do caso sem custo.'
  },
  previdenciario: {
    title: 'Direito previdenciário',
    l2: 'Honorários (êxito)', v2: '20% do benefício',
    l3: 'Revisão de benefício', v3: 'A partir de R$ 600',
    note: 'Na modalidade êxito, honorários incidem apenas sobre o valor obtido judicialmente. Consulta gratuita.'
  }
}

// ── TABS DE ORÇAMENTO ───────────────────────
const tabs = document.querySelectorAll('.orc-tab')

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => {
      t.classList.remove('active')
      t.setAttribute('aria-selected', 'false')
    })

    tab.classList.add('active')
    tab.setAttribute('aria-selected', 'true')

    const area = tab.dataset.area
    const d = orcamentoData[area]

    document.getElementById('orc-title').textContent = d.title
    document.getElementById('orc-l2').textContent    = d.l2
    document.getElementById('orc-v2').textContent    = d.v2
    document.getElementById('orc-l3').textContent    = d.l3
    document.getElementById('orc-v3').textContent    = d.v3
    document.getElementById('orc-note').textContent  = d.note
  })
})

// ── MENU MOBILE ─────────────────────────────
const burger = document.querySelector('.navbar__burger')
const navLinks = document.querySelector('.navbar__links')

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open')
    burger.setAttribute('aria-expanded', isOpen)
  })

  // Fecha o menu ao clicar em um link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open')
      burger.setAttribute('aria-expanded', 'false')
    })
  })
}

// ── ANIMAÇÃO DE SCROLL (FADE IN) ─────────────
const fadeEls = document.querySelectorAll(
  '.area-card, .depo-card, .orcamento__card, .hero__stat'
)

fadeEls.forEach(el => el.classList.add('fade-in'))

const observer = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger: cada elemento aparece com um pequeno delay em sequência
        setTimeout(() => {
          entry.target.classList.add('visible')
        }, i * 60)
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.1 }
)

fadeEls.forEach(el => observer.observe(el))