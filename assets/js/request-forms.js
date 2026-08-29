(function () {
  function show(form, message, ok) {
    var box = form.querySelector('.request-status');
    if (!box) { box = document.createElement('div'); box.className = 'request-status'; form.appendChild(box); }
    box.textContent = message; box.classList.toggle('success', ok); box.classList.toggle('error', !ok);
  }
  document.querySelectorAll('.albrighton-request-form').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var button = form.querySelector('[type=submit]'), waWindow = window.open('', '_blank');
      button.disabled = true; show(form, 'Sending your request...', true);
      fetch('submit-request.php', { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (response) { return response.json().then(function (data) { if (!response.ok) throw new Error('Request failed'); return data; }); })
        .then(function (data) {
          show(form, data.message + ' WhatsApp will open with the formatted request.', true); form.reset();
          if (data.whatsapp && data.whatsapp[0]) { if (waWindow) waWindow.location.href = data.whatsapp[0]; else window.location.href = data.whatsapp[0]; } else if (waWindow) waWindow.close();
          if (data.whatsapp && data.whatsapp[1]) { var link = document.createElement('a'); link.href = data.whatsapp[1]; link.target = '_blank'; link.rel = 'noopener'; link.className = 'second-whatsapp'; link.textContent = 'Send the same request to the second WhatsApp number'; form.querySelector('.request-status').appendChild(document.createElement('br')); form.querySelector('.request-status').appendChild(link); }
        })
        .catch(function () {
          if (waWindow) waWindow.close(); show(form, 'Unable to process your request. Call: ', false);
          var phone = document.createElement('a'); phone.href = 'tel:+256776105168'; phone.textContent = '+256 776 105 168'; phone.className = 'request-phone-link'; form.querySelector('.request-status').appendChild(phone);
        })
        .finally(function () { button.disabled = false; });
    });
  });
})();
