(function () {
    if (!document.body.classList.contains('shop-page')) return;

    var bottom = document.createElement('nav');
    bottom.className = 'shop-bottom-nav';
    bottom.setAttribute('aria-label', 'Shop mobile navigation');
    bottom.innerHTML =
        '<a href="index.html"><i class="ti-home"></i><span>Home</span></a>' +
        '<a class="active" href="shop.html"><i class="ti-shopping-cart"></i><span>Shop</span></a>' +
        '<button type="button" class="bottom-book"><i class="ti-calendar"></i><span>Book</span></button>' +
        '<a href="project.html"><i class="ti-layout-grid2"></i><span>Projects</span></a>' +
        '<a href="contact.html"><i class="ti-email"></i><span>Contact</span></a>';
    document.body.appendChild(bottom);

    function openBooking() {
        var serviceTab = document.querySelector('.commerce-tab[data-tab="services"]');
        if (serviceTab) serviceTab.click();
        var trigger = document.querySelector('.open-service-modal');
        if (trigger) trigger.click();
    }
    bottom.querySelector('.bottom-book').addEventListener('click', openBooking);
})();
