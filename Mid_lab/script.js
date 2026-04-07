$(document).ready(function () {

    // ── Fallback product data (shown if API is unreachable) ──
    const FALLBACK_PRODUCTS = [
        {
            id: 1,
            title: "Fjallraven - Foldsack No. 1 Backpack",
            price: 109.95,
            description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday essentials in the main compartment, and your water bottle on the side.",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/81fAn3whh9L._AC_SL1500_.jpg",
            rating: { rate: 3.9, count: 120 }
        },
        {
            id: 2,
            title: "Mens Casual Premium Slim Fit T-Shirts",
            price: 22.30,
            description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, lightweight & soft fabric for breathable and comfortable wearing.",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
            rating: { rate: 4.1, count: 259 }
        },
        {
            id: 3,
            title: "Mens Cotton Jacket",
            price: 55.99,
            description: "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
            rating: { rate: 4.7, count: 500 }
        },
        {
            id: 4,
            title: "Womens 3-in-1 Snowboard Jacket",
            price: 56.99,
            description: "Note: The Jackets is US standard size. There are some size discrepancies. Bust: 38 inches; Sleeve Length: 26.4 inches; Waist: 36 inches. Womens 3-in-1 Snowboard Jacket.",
            category: "women's clothing",
            image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
            rating: { rate: 2.6, count: 235 }
        }
    ];

    function renderStars(rating) {
        const full  = Math.floor(rating);
        const half  = rating - full >= 0.5 ? 1 : 0;
        const empty = 5 - full - half;
        return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
    }

    function buildGrid(products) {
        const $grid = $('<div class="products-grid"></div>');
        $.each(products, function (i, product) {
            const $card = $(`
                <div class="product-card">
                    <div class="card-img-wrapper">
                        <img src="${product.image}" alt="${product.title}" loading="lazy">
                    </div>
                    <div class="card-body">
                        <span class="card-category">${product.category}</span>
                        <h3 class="card-title">${product.title}</h3>
                        <div class="card-meta">
                            <span class="card-price">$${product.price.toFixed(2)}</span>
                            <span class="card-rating">
                                <span class="stars">${renderStars(product.rating.rate)}</span>
                                ${product.rating.rate}
                            </span>
                        </div>
                    </div>
                    <button class="quick-view-btn" data-id="${product.id}">⚡ Quick View</button>
                </div>
            `);
            $card.data('product', product);
            $grid.append($card);
        });
        return $grid;
    }

    function setLiveBadge(live) {
        if (live) {
            $('#live-dot').removeClass('offline');
            $('#live-text').text('Live catalogue');
        } else {
            $('#live-dot').addClass('offline');
            $('#live-text').text('Showing cached deals');
        }
    }

    function fetchProducts() {
        $('#products-container').html(
            '<div class="loading-spinner"><div class="spinner"></div><p>Loading featured deals…</p></div>'
        );

        $.ajax({
            url: 'https://fakestoreapi.com/products?limit=4',
            method: 'GET',
            dataType: 'json',
            timeout: 8000,

            success: function (products) {
                $('#products-container').empty().append(buildGrid(products));
                setLiveBadge(true);
            },

            error: function () {
                // ── Graceful fallback: render static data instead of error ──
                $('#products-container').empty().append(buildGrid(FALLBACK_PRODUCTS));
                setLiveBadge(false);
            }
        });
    }

    fetchProducts();

    // ── Open Modal ───────────────────────────────────────────
    $(document).on('click', '.quick-view-btn', function () {
        const product = $(this).closest('.product-card').data('product');

        $('#modal-img').attr({ src: product.image, alt: product.title });
        $('#modal-category').text(product.category);
        $('#modal-title').text(product.title);
        $('#modal-description').text(product.description);
        $('#modal-price').text('$' + product.price.toFixed(2));
        $('#modal-rating').text(renderStars(product.rating.rate) + '  ' + product.rating.rate + '/5');
        $('#modal-count').text(product.rating.count + ' reviews');

        $('#modal-overlay').addClass('active');
        $('body').css('overflow', 'hidden');
    });

    // ── Close Modal ──────────────────────────────────────────
    function closeModal() {
        $('#modal-overlay').removeClass('active');
        $('body').css('overflow', '');
    }

    $('#modal-close, #modal-close-btn').on('click', closeModal);
    $('#modal-overlay').on('click', function (e) {
        if ($(e.target).is('#modal-overlay')) closeModal();
    });
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });

    // ── Hamburger ────────────────────────────────────────────
    $('#hamburger').on('click', function () {
        $('#nav-menu').toggleClass('active');
    });

});
