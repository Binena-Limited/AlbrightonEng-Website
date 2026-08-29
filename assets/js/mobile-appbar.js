(function () {
    var page = location.pathname.split('/').pop() || 'index.html';
    var labels = {
        'index.html': ['Albrighton', 'Engineering Hub'],
        'about.html': ['Albrighton', 'About Us'],
        'service.html': ['Albrighton', 'Our Services'],
        'project.html': ['Albrighton', 'Our Projects'],
        'shop.html': ['Albrighton', 'Shop & Bookings'],
        'contact.html': ['Albrighton', 'Contact Us']
    };
    if (!labels[page]) return;
    document.body.classList.add('mobile-app-shell');
    if (page === 'index.html') document.body.classList.add('home-page');

    var brand = document.querySelector('.navbar-header');
    if (brand && !brand.querySelector('.mobile-app-title')) {
        var title = document.createElement('span');
        title.className = 'mobile-app-title';
        title.innerHTML = '<strong>' + labels[page][0] + '</strong><small>' + labels[page][1] + '</small>';
        brand.appendChild(title);
    }

    var navigation = document.querySelector('.wpo-site-header .navigation');
    if (navigation && !navigation.querySelector('.mobile-app-action')) {
        var action = document.createElement(page === 'shop.html' ? 'button' : 'a');
        action.className = 'mobile-app-action';
        action.setAttribute('aria-label', page === 'shop.html' ? 'Book a service' : 'Call Albrighton Engineering');
        if (page !== 'shop.html') action.href = 'tel:+256776105168';
        action.innerHTML = '<i class="' + (page === 'shop.html' ? 'ti-calendar' : 'ti-headphone-alt') + '"></i>';
        navigation.appendChild(action);
        if (page === 'shop.html') action.addEventListener('click', function () {
            var tab = document.querySelector('.commerce-tab[data-tab="services"]');
            if (tab) tab.click();
            var trigger = document.querySelector('.open-service-modal');
            if (trigger) trigger.click();
        });
    }
})();
