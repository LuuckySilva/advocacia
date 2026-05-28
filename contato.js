document.addEventListener('DOMContentLoaded', () => {

  
  
  const advogados = {
    trabalhista:    { nome: 'Dr. Rafael Souza',   iniciais: 'RS', area: 'Direito trabalhista',    badge: 'Trabalhista',    email: 'trabalhista@escritorio.com' },
    civel:          { nome: 'Dra. Ana Carvalho',  iniciais: 'AC', area: 'Direito cível',           badge: 'Cível',          email: 'civel@escritorio.com' },
    familia:        { nome: 'Dra. Ana Carvalho',  iniciais: 'AC', area: 'Direito de família',      badge: 'Família',        email: 'familia@escritorio.com' },
    empresarial:    { nome: 'Dr. Marcos Lima',    iniciais: 'ML', area: 'Direito empresarial',     badge: 'Empresarial',    email: 'empresarial@escritorio.com' },
    criminal:       { nome: 'Dr. Rafael Souza',   iniciais: 'RS', area: 'Direito criminal',        badge: 'Criminal',       email: 'criminal@escritorio.com' },
    previdenciario: { nome: 'Dra. Ana Carvalho',  iniciais: 'AC', area: 'Direito previdenciário',  badge: 'Previdenciário', email: 'previdenciario@escritorio.com' }
  }

  
  const wppMensagens = {
    trabalhista:    'Olá%2C%20enviei%20uma%20solicitação%20sobre%20Direito%20Trabalhista%20pelo%20site.',
    civel:          'Olá%2C%20enviei%20uma%20solicitação%20sobre%20Direito%20Cível%20pelo%20site.',
    familia:        'Olá%2C%20enviei%20uma%20solicitação%20sobre%20Direito%20de%20Família%20pelo%20site.',
    empresarial:    'Olá%2C%20enviei%20uma%20solicitação%20sobre%20Direito%20Empresarial%20pelo%20site.',
    criminal:       'Olá%2C%20enviei%20uma%20solicitação%20sobre%20Direito%20Criminal%20pelo%20site.',
    previdenciario: 'Olá%2C%20enviei%20uma%20solicitação%20sobre%20Direito%20Previdenciário%20pelo%20site.'
  }

  
  const form          = document.getElementById('contato-form')
  const formSucesso   = document.getElementById('form-sucesso')
  const areaSelect    = document.getElementById('area')
  const advCard       = document.getElementById('advogado-card')
  const descricao     = document.getElementById('descricao')
  const charCount     = document.getElementById('char-count')
  const cpfInput      = document.getElementById('cpf')
  const telInput      = document.getElementById('telefone')
  const submitBtn     = document.getElementById('form-submit')
  const submitText    = document.getElementById('submit-text')
  const submitIcon    = document.getElementById('submit-icon')
  const submitSpinner = document.getElementById('submit-spinner')
  const canalRadios   = document.querySelectorAll('input[name="canal"]')
  const avisoEmail    = document.getElementById('canal-aviso-email')

  
  cpfInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '')
    if (v.length > 11) v = v.slice(0, 11)
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    e.target.value = v
  })

  
  telInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '')
    if (v.length > 11) v = v.slice(0, 11)
    if (v.length <= 10) {
      v = v.replace(/(\d{2})(\d)/, '($1) $2')
      v = v.replace(/(\d{4})(\d)/, '$1-$2')
    } else {
      v = v.replace(/(\d{2})(\d)/, '($1) $2')
      v = v.replace(/(\d{5})(\d)/, '$1-$2')
    }
    e.target.value = v
  })

  
  descricao.addEventListener('input', () => {
    const len = descricao.value.length
    charCount.textContent = `${len} / 1000`
    if (len > 900) {
      charCount.style.color = '#A32D2D'
    } else {
      charCount.style.color = ''
    }
  })

  
  areaSelect.addEventListener('change', () => {
    const area = areaSelect.value
    clearError('area')

    if (!area) {
      advCard.hidden = true
      return
    }

    const adv = advogados[area]
    document.getElementById('adv-avatar').textContent  = adv.iniciais
    document.getElementById('adv-nome').textContent    = adv.nome
    document.getElementById('adv-area').textContent    = adv.area
    document.getElementById('adv-badge').textContent   = adv.badge
    advCard.hidden = false
  })

  
  canalRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      avisoEmail.hidden = radio.value !== 'email'
    })
  })

  
  function showError(id, msg) {
    const el = document.getElementById(`${id}-error`)
    const input = document.getElementById(id)
    if (el) el.textContent = msg
    if (input) input.classList.add('error')
  }

  function clearError(id) {
    const el = document.getElementById(`${id}-error`)
    const input = document.getElementById(id)
    if (el) el.textContent = ''
    if (input) input.classList.remove('error')
  }

  function validarCPF(cpf) {
    const nums = cpf.replace(/\D/g, '')
    if (nums.length !== 11) return false
    if (/^(\d)\1+$/.test(nums)) return false
    let soma = 0
    for (let i = 0; i < 9; i++) soma += parseInt(nums[i]) * (10 - i)
    let resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(nums[9])) return false
    soma = 0
    for (let i = 0; i < 10; i++) soma += parseInt(nums[i]) * (11 - i)
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    return resto === parseInt(nums[10])
  }

  function validarForm() {
    let valido = true

    const nome = document.getElementById('nome').value.trim()
    if (!nome || nome.length < 3) {
      showError('nome', 'Informe seu nome completo.')
      valido = false
    } else { clearError('nome') }

    const cpf = document.getElementById('cpf').value
    if (!validarCPF(cpf)) {
      showError('cpf', 'CPF inválido. Verifique os números.')
      valido = false
    } else { clearError('cpf') }

    const tel = document.getElementById('telefone').value.replace(/\D/g, '')
    if (tel.length < 10) {
      showError('telefone', 'Informe um número válido com DDD.')
      valido = false
    } else { clearError('telefone') }

    const area = areaSelect.value
    if (!area) {
      showError('area', 'Selecione a área do seu caso.')
      valido = false
    } else { clearError('area') }

    const desc = descricao.value.trim()
    if (!desc || desc.length < 20) {
      showError('descricao', 'Descreva seu caso com pelo menos 20 caracteres.')
      valido = false
    } else { clearError('descricao') }

    const lgpd = document.getElementById('lgpd').checked
    if (!lgpd) {
      document.getElementById('lgpd-error').textContent = 'Você precisa concordar para enviar.'
      valido = false
    } else {
      document.getElementById('lgpd-error').textContent = ''
    }

    const canal = document.querySelector('input[name="canal"]:checked')?.value
    const email = document.getElementById('email').value.trim()
    if (canal === 'email' && !email) {
      avisoEmail.hidden = false
      valido = false
    }

    return valido
  }

  
  ;['nome', 'cpf', 'telefone', 'email', 'descricao'].forEach(id => {
    const el = document.getElementById(id)
    if (el) {
      el.addEventListener('input', () => clearError(id))
    }
  })

  
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (!validarForm()) {
      
      const firstError = form.querySelector('.error, .field-error:not(:empty)')
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    
    submitBtn.disabled = true
    submitText.textContent = 'Enviando...'
    submitIcon.style.display = 'none'
    submitSpinner.style.display = 'block'

    const area     = areaSelect.value
    const adv      = advogados[area]
    const canal    = document.querySelector('input[name="canal"]:checked')?.value
    const nome     = document.getElementById('nome').value.trim()

    try {
      const res = await fetch('https://ina0bh1g0g.execute-api.us-east-1.amazonaws.com/Prod/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          cpf: document.getElementById('cpf').value,
          telefone: document.getElementById('telefone').value,
          email: document.getElementById('email').value,
          numeroProcesso: document.getElementById('numero-processo').value,
          area,
          descricao: descricao.value,
          canal
        })
      })

      const resultado = await res.json()

      if (!res.ok) {
        submitBtn.disabled = false
        submitText.textContent = 'Enviar solicitação'
        submitIcon.style.display = 'block'
        submitSpinner.style.display = 'none'
        alert(resultado.message || 'Erro ao enviar. Tente novamente.')
        return
      }

    } catch (err) {
      submitBtn.disabled = false
      submitText.textContent = 'Enviar solicitação'
      submitIcon.style.display = 'block'
      submitSpinner.style.display = 'none'
      alert('Erro de conexão. Verifique sua internet e tente novamente.')
      return
    }

    form.hidden = true
    formSucesso.hidden = false

    document.getElementById('sucesso-avatar').textContent  = adv.iniciais
    document.getElementById('sucesso-adv-nome').textContent = adv.nome
    document.getElementById('sucesso-adv-area').textContent = adv.area

    const canalTexto = { whatsapp: 'WhatsApp', email: 'e-mail', ligacao: 'ligação' }
    document.getElementById('sucesso-texto').textContent =
      `Seu caso foi encaminhado ao ${adv.nome}. A confirmação será enviada por ${canalTexto[canal] || 'WhatsApp'}.`

    if (canal === 'whatsapp') {
      const msg = wppMensagens[area]
      const link = `https://wa.me/5535984128081?text=${msg}`
      setTimeout(() => window.open(link, '_blank', 'noopener'), 1000)
    }

    formSucesso.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })

  
  const burger   = document.querySelector('.navbar__burger')
  const navLinks = document.querySelector('.navbar__links')

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open')
      burger.setAttribute('aria-expanded', String(isOpen))
    })
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open')
        burger.setAttribute('aria-expanded', 'false')
      })
    })
  }

})