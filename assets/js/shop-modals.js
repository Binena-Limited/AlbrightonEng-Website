(function () {
    var forms = document.querySelectorAll('.booking-form-wrap');
    if (!forms.length) return;

    function prepareModal(element, label) {
        element.classList.add('commerce-modal');
        element.setAttribute('role', 'dialog');
        element.setAttribute('aria-modal', 'true');
        element.setAttribute('aria-hidden', 'true');
        element.setAttribute('aria-label', label);
        element.removeAttribute('id');

        var close = document.createElement('button');
        close.type = 'button';
        close.className = 'commerce-modal-close';
        close.setAttribute('aria-label', 'Close form');
        close.innerHTML = '&times;';
        element.insertBefore(close, element.firstChild);

        var backdrop = document.createElement('div');
        backdrop.className = 'commerce-modal-backdrop';
        backdrop.appendChild(element);
        document.body.appendChild(backdrop);

        function closeModal() {
            backdrop.classList.remove('open');
            element.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('commerce-modal-open');
        }

        function openModal() {
            backdrop.classList.add('open');
            element.setAttribute('aria-hidden', 'false');
            document.body.classList.add('commerce-modal-open');
            var first = element.querySelector('input:not([type="hidden"]):not(.form-trap), select, textarea');
            if (first) window.setTimeout(function () { first.focus(); }, 50);
        }

        close.addEventListener('click', closeModal);
        backdrop.addEventListener('click', function (event) {
            if (event.target === backdrop) closeModal();
        });
        return { open: openModal, close: closeModal };
    }

    var orderModal = prepareModal(forms[0], 'Furniture order request');
    var serviceModal = forms[1] ? prepareModal(forms[1], 'Service booking request') : null;

    document.querySelectorAll('.select-product').forEach(function (link) {
        link.removeAttribute('href');
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
        function openProduct() {
            var select = forms[0].querySelector('.product-select');
            if (select) select.value = link.dataset.product || '';
            orderModal.open();
        }
        link.addEventListener('click', openProduct);
        link.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openProduct();
            }
        });
    });

    if (serviceModal) {
        var servicesPanel = document.getElementById('services');
        var buttonWrap = document.createElement('div');
        buttonWrap.className = 'service-modal-action';
        buttonWrap.innerHTML = '<button type="button" class="theme-btn-s2 open-service-modal">Book a Service</button>';
        var grid = servicesPanel.querySelector('.service-booking-grid');
        grid.insertAdjacentElement('afterend', buttonWrap);
        buttonWrap.querySelector('button').addEventListener('click', serviceModal.open);

        servicesPanel.querySelectorAll('.service-booking-grid article').forEach(function (card) {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.addEventListener('click', function () {
                var select = forms[1].querySelector('select[name="service"]');
                var title = card.querySelector('h3').textContent;
                var match = Array.from(select.options).find(function (option) {
                    return option.text.toLowerCase().indexOf(title.toLowerCase().split(' ')[0]) !== -1;
                });
                if (match) select.value = match.value;
                serviceModal.open();
            });
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            orderModal.close();
            if (serviceModal) serviceModal.close();
        }
    });
})();
