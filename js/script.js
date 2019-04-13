$(function() {
    var testimonialWrapper = $('#testimonials-wrapper');
    var testimonialClientList = $('#testimonials-client-list');
    var testimonialClientItem = $('#testimonials-client-list .testimonials-client-item');
    var slideItem = $('#testimonials-wrapper .testimonials-content-slide');
    $('.testimonials-sidebar-toggle').click(function(e) {
        if (!testimonialWrapper.hasClass('sidebar-open'))
            pauseVideos();
        testimonialWrapper.toggleClass('sidebar-open');
    });
    testimonialClientList.on('click', '.testimonials-client-item', function(e) {
        e.preventDefault();
        stopVideos();
        testimonialClientItem = $('#testimonials-client-list .testimonials-client-item');
        var currentIndex = testimonialClientItem.filter('.active').attr('data-slide-index');
        var clientIndex = $(this).attr('data-slide-index');
        if (currentIndex == clientIndex) return false;
        slideItem.eq(currentIndex).removeClass('active').addClass('after');
        setTimeout(function() {
            slideItem.eq(currentIndex).removeClass('after active')
        }, 800);
        testimonialClientItem.removeClass('active');
        $('.testimonials-client-item[data-slide-index=' + clientIndex + ']').addClass('active');
        slideItem.eq(clientIndex).addClass('active');
        testimonialWrapper.removeClass('is-playing');
    });
    $('#testimonials-client-list-scroll-down').click(function(e) {
        e.preventDefault();
        var distance = testimonialClientList.scrollTop() + testimonialClientItem.outerHeight();
        testimonialClientList.animate({
            scrollTop: distance
        }, 300);
    });
    var distance = testimonialClientItem.outerHeight() * 2.5;
    testimonialClientList.animate({
        scrollTop: distance
    }, 300);
    var scrollW = document.getElementById("testimonials-client-list");
    var itemsScrolled, itemsMax, clonedDown = false,
        clonedUp = false;
    var listOpts = {
        itemCount: null,
        itemHeight: null,
        items: [],
    };

    function cloneList(append) {
        console.log('clone list');
        var node;
        cloned = append ? clonedDown : clonedUp;
        for (_x = 0; _x <= itemsMax - 1; _x++) {
            node = listOpts.items[_x];
            if (!cloned) {
                node = listOpts.items[_x].cloneNode(true);
            }
            if (append) scrollW.appendChild(node);
            else scrollW.insertBefore(node, listOpts.items[0]);
        }
        initItems(cloned);
        cloned = true;
        itemsScrolled = 0;
    }

    function scrollWrap() {
        itemsScrolled = Math.ceil((scrollW.scrollTop + listOpts.itemHeight / 2) / listOpts.itemHeight);
        if (scrollW.scrollTop < 1) {
            itemsScrolled = 0;
        }
        if (itemsScrolled > listOpts.items.length - 5) {
            cloneList(true);
        } else if (itemsScrolled < 3) {
            cloneList();
        }
    }

    function initItems(scrollSmooth) {
        console.log('init items');
        listOpts.items = [].slice.call(scrollW.querySelectorAll("div.testimonials-client-item"));
        listOpts.itemHeight = listOpts.items[0].clientHeight;
        listOpts.itemCount = listOpts.items.length;
        if (!itemsMax) {
            itemsMax = listOpts.itemCount;
        }
        if (scrollSmooth) {
            var seamLessScrollPoint = ((itemsMax - 5) * listOpts.itemHeight);
            scrollW.scrollTop = seamLessScrollPoint - 60;
        }
    }
    initItems();
    scrollW.onscroll = scrollWrap;
    const players = Plyr.setup('.js-player', {
        controls: ['play', 'play-large', 'progress', 'current-time', 'volume'],
        clickToPlay: true,
    });

    function stopVideos() {
        players.forEach(function(player) {
            player.stop();
        });
    }

    function pauseVideos() {
        if (testimonialWrapper.hasClass('is-playing')) {
            players.forEach(function(player) {
                player.pause();
            });
        }        
    }

    players.forEach(function(player) {
        player.on('play pause', event => {
            const instance = event.detail.plyr;
            if (!instance.paused) {
                testimonialWrapper.addClass('is-playing');
                testimonialWrapper.removeClass('sidebar-open');
            } else {
                testimonialWrapper.removeClass('is-playing');
            }
        });
    });

    $(window).on("scroll", function(e) {
        //if (!$.scrollify.current().hasClass('testemonials')) {
            pauseVideos();
        //}
    });
});