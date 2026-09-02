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
        var action = document.createElement('a');
        action.className = 'mobile-app-action';
        action.setAttribute('aria-label', 'Call Albrighton support on 0776 105 168');
        action.href = 'tel:+256776105168';
        action.innerHTML = '<img src="assets/images/Albrigton_Images/mobile-support-call.png" alt="">';
        navigation.appendChild(action);
    }
})();
