document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('quizForm');
  if (!form) return; // não é a página do diagnóstico

  var steps = Array.prototype.slice.call(form.querySelectorAll('.quiz-step'));
  var total = steps.length; // inclui o passo de captura (gate) como último
  var current = 0;
  var answers = {}; // { stepIndex: value }

  var progressBar = document.getElementById('progressBar');
  var btnBack = document.getElementById('btnBack');
  var btnNext = document.getElementById('btnNext');
  var resultWrap = document.getElementById('resultWrap');

  function isGateStep(index) {
    return steps[index].classList.contains('quiz-gate');
  }

  function updateProgress() {
    var pct = (current / (total - 1)) * 100;
    progressBar.style.width = pct + '%';
  }

  function showStep(index) {
    steps.forEach(function (s) { s.classList.remove('is-active'); });
    steps[index].classList.add('is-active');
    btnBack.disabled = index === 0;
    btnNext.textContent = index === total - 1 ? 'Ver resultado' : 'Próxima';
    updateProgress();
  }

  // seleção de opção
  form.querySelectorAll('.quiz-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var stepEl = btn.closest('.quiz-step');
      stepEl.querySelectorAll('.quiz-option').forEach(function (b) { b.classList.remove('is-selected'); });
      btn.classList.add('is-selected');
      answers[stepEl.dataset.step] = parseInt(btn.dataset.value, 10);
    });
  });

  function canAdvance(index) {
    if (isGateStep(index)) {
      var firstName = document.getElementById('gateFirstName').value.trim();
      var lastName = document.getElementById('gateLastName').value.trim();
      var phone = document.getElementById('gatePhone').value.trim();
      var role = document.getElementById('gateRole').value.trim();
      var org = document.getElementById('gateOrg').value.trim();
      var email = document.getElementById('gateEmail').value.trim();
      return firstName && lastName && phone && role && org && /\S+@\S+\.\S+/.test(email);
    }
    return answers.hasOwnProperty(String(index));
  }

  function computeResult() {
    var score = 0, max = 0;
    steps.forEach(function (s) {
      if (isGateStep(steps.indexOf(s))) return;
      var idx = s.dataset.step;
      if (answers.hasOwnProperty(idx)) score += answers[idx];
      max += 2; // cada pergunta de exemplo vale 0-2
    });
    var pct = max > 0 ? score / max : 0;
    if (pct < 0.4) return 'baixa';
    if (pct < 0.75) return 'media';
    return 'alta';
  }

  function showResult() {
    form.style.display = 'none';
    document.querySelector('.quiz-nav').style.display = 'none';
    resultWrap.style.display = 'block';
    var band = computeResult();
    resultWrap.querySelectorAll('.result-band').forEach(function (el) {
      el.classList.toggle('is-active', el.dataset.band === band);
    });

    var firstName = document.getElementById('gateFirstName').value.trim();
    var lastName = document.getElementById('gateLastName').value.trim();
    var phone = document.getElementById('gatePhone').value.trim();
    var role = document.getElementById('gateRole').value.trim();
    var email = document.getElementById('gateEmail').value.trim();
    var org = document.getElementById('gateOrg').value.trim();
    var bandLabel = { baixa: 'Operação reativa', media: 'Operação em estruturação', alta: 'Operação madura' }[band];

    var payload = {
      origem: 'diagnostico.html — quiz',
      nome: firstName + ' ' + lastName,
      telefone: phone,
      cargo: role,
      email: email,
      administradora: org,
      resultado: bandLabel,
      respostas: JSON.stringify(answers)
    };

    var whatsappMsg = 'Olá, sou ' + firstName + ' ' + lastName + ' (' + role + ' — ' + org + '). ' +
      'Fiz o diagnóstico e o resultado foi "' + bandLabel + '". Quero falar sobre a minha operação.';
    var whatsappBtn = document.getElementById('quizWhatsappBtn');
    if (whatsappBtn) whatsappBtn.href = 'https://wa.me/5531992971725?text=' + encodeURIComponent(whatsappMsg);

    if (typeof dbaLeadsConfigured === 'function' && dbaLeadsConfigured()) {
      dbaSendLead(payload);
    } else {
      // Planilha ainda não configurada: mantém o comportamento antigo (abre o e-mail do
      // visitante já preenchido) como rede de segurança.
      var body = 'Nome: ' + firstName + ' ' + lastName + '\n' +
        'Telefone/WhatsApp: ' + phone + '\n' +
        'Cargo: ' + role + '\n' +
        'E-mail: ' + email + '\n' +
        'Administradora: ' + org + '\n' +
        'Resultado: ' + bandLabel + '\n' +
        'Respostas: ' + JSON.stringify(answers);

      var mailtoUrl = 'mailto:debora.braganca31@gmail.com' +
        '?subject=' + encodeURIComponent('Novo lead — Diagnóstico Operacional') +
        '&body=' + encodeURIComponent(body);

      window.open(mailtoUrl, '_blank');
    }
  }

  btnNext.addEventListener('click', function () {
    if (!canAdvance(current)) return;
    if (current === total - 1) {
      showResult();
      return;
    }
    current++;
    showStep(current);
  });

  btnBack.addEventListener('click', function () {
    if (current === 0) return;
    current--;
    showStep(current);
  });

  showStep(current);
});
