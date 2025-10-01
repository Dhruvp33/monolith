(function ($) {
  "use strict";

  if ($(".scroll-to-target").length) {
    $(".scroll-to-target").on("click", function () {
      var target = $(this).attr("data-target");
      $("html, body").animate({
        scrollTop: $(target).offset().top,
      },
        1000
      );
      return false;
    });
  }

  if ($(".main-menu__list").length && $(".mobile-nav__container").length) {
    let navContent = document.querySelector(".main-menu__list").outerHTML;
    let mobileNavContainer = document.querySelector(".mobile-nav__container");
    mobileNavContainer.innerHTML = navContent;
  }
  if ($(".sticky-header__content").length) {
    let navContent = document.querySelector(".main-menu").innerHTML;
    let mobileNavContainer = document.querySelector(".sticky-header__content");
    mobileNavContainer.innerHTML = navContent;
  }

  if ($(".mobile-nav__container .main-menu__list").length) {
    let dropdownAnchor = $(
      ".mobile-nav__container .main-menu__list .menu-item-has-children > a"
    );
    dropdownAnchor.each(function () {
      let self = $(this);
      let toggleBtn = document.createElement("BUTTON");
      toggleBtn.setAttribute("aria-label", "dropdown toggler");
      toggleBtn.innerHTML = "<i class='fa fa-angle-down'></i>";
      self.append(function () {
        return toggleBtn;
      });
      self.find("button").on("click", function (e) {
        e.preventDefault();
        let self = $(this);
        self.toggleClass("expanded");
        self.parent().toggleClass("expanded");
        self.parent().parent().children("ul").slideToggle();
      });
    });
  }

  if ($(".mobile-nav__toggler").length) {
    $(".mobile-nav__toggler").on("click", function (e) {
      e.preventDefault();
      $(".mobile-nav__wrapper").toggleClass("expanded");
      $("body").toggleClass("locked");
    });
  }

  if ($(".search-toggler").length) {
    $(".search-toggler").on("click", function (e) {
      e.preventDefault();
      $(".search-popup").toggleClass("active");
      $(".mobile-nav__wrapper").removeClass("expanded");
      $("body").toggleClass("locked");
    });
  }


  if ($(".dynamic-year").length) {
    let date = new Date();
    $(".dynamic-year").html(date.getFullYear());
  }

  let MainSlider = new Swiper('.thm-swiper__slider', { 
    watchOverflow: true,
    pagination: {
      el: "#main-slider-pagination",
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 3
    },  
    loop:false, 
    autoplay:{ 
      delay:4000, 
      pauseOnMouseEnter: true,
    },
    effect: "fade", 
    // Navigation arrows
    navigation: {
    nextEl: '#main-slider__swiper-button-next',
    prevEl: '#main-slider__swiper-button-prev',
    } 
  });

  // Accrodion
  if ($(".accrodion-grp").length) {
    var accrodionGrp = $(".accrodion-grp");
    accrodionGrp.each(function () {
      var accrodionName = $(this).data("grp-name");
      var Self = $(this);
      var accordion = Self.find(".accrodion");
      Self.addClass(accrodionName);
      Self.find(".accrodion .accrodion-content").hide();
      Self.find(".accrodion.active").find(".accrodion-content").show();
      accordion.each(function () {
        $(this)
          .find(".accrodion-title")
          .on("click", function () {
            if ($(this).parent().hasClass("active") === false) {
              $(".accrodion-grp." + accrodionName)
                .find(".accrodion")
                .removeClass("active");
              $(".accrodion-grp." + accrodionName)
                .find(".accrodion")
                .find(".accrodion-content")
                .slideUp();
              $(this).parent().addClass("active");
              $(this).parent().find(".accrodion-content").slideDown();
            }
          });
      });
    });
  }

  function SmoothMenuScroll() {
    var anchor = $(".scrollToLink");
    if (anchor.length) {
      anchor.children("a").bind("click", function (event) {
        if ($(window).scrollTop() > 10) {
          var headerH = "90";
        } else {
          var headerH = "90";
        }
        var target = $(this);
        $("html, body")
          .stop()
          .animate({
            scrollTop: $(target.attr("href")).offset().top - headerH + "px"
          },
            1200,
            "easeInOutExpo"
          );
        anchor.removeClass("current");
        anchor.removeClass("current-menu-ancestor");
        anchor.removeClass("current_page_item");
        anchor.removeClass("current-menu-parent");
        target.parent().addClass("current");
        event.preventDefault();
      });
    }
  }
  SmoothMenuScroll();

  function OnePageMenuScroll() {
    var windscroll = $(window).scrollTop();
    if (windscroll >= 117) {
      var menuAnchor = $(".one-page-scroll-menu .scrollToLink").children("a");
      menuAnchor.each(function () {
        var sections = $(this).attr("href");
        $(sections).each(function () {
          if ($(this).offset().top <= windscroll + 100) {
            var Sectionid = $(sections).attr("id");
            $(".one-page-scroll-menu").find("li").removeClass("current");
            $(".one-page-scroll-menu").find("li").removeClass("current-menu-ancestor");
            $(".one-page-scroll-menu").find("li").removeClass("current_page_item");
            $(".one-page-scroll-menu").find("li").removeClass("current-menu-parent");
            $(".one-page-scroll-menu")
              .find("a[href*=\\#" + Sectionid + "]")
              .parent()
              .addClass("current");
          }
        });
      });
    } else {
      $(".one-page-scroll-menu li.current").removeClass("current");
      $(".one-page-scroll-menu li:first").addClass("current");
    }
  }

  $(window).on("load", function () {
    if ($(".preloader").length) {
      $(".preloader").fadeOut();
    }

  });

  $(window).on("scroll", function () {
    if ($(".stricked-menu").length) {
      var headerScrollPos = 130;
      var stricky = $(".stricked-menu");
      if ($(window).scrollTop() > headerScrollPos) {
        stricky.addClass("stricky-fixed");
      } else if ($(this).scrollTop() <= headerScrollPos) {
        stricky.removeClass("stricky-fixed");
      }
    }
    if ($(".scroll-to-top").length) {
      var strickyScrollPos = 100;
      if ($(window).scrollTop() > strickyScrollPos) {
        $(".scroll-to-top").fadeIn(500);
      } else if ($(this).scrollTop() <= strickyScrollPos) {
        $(".scroll-to-top").fadeOut(500);
      }
    }

    OnePageMenuScroll();
  });


  //Hidden Sidebar
  if ($(".hidden-bar").length) {
    var hiddenBar = $(".hidden-bar");
    var hiddenBarOpener = $(".hidden-bar-opener");
    var hiddenBarCloser = $(".hidden-bar-closer, .hidden-bar__overlay");
    var navToggler = $(".nav-toggler");

    //Show Sidebar
    hiddenBarOpener.on("click", function () {
      hiddenBar.toggleClass("visible-sidebar");
      navToggler.toggleClass("open");
    });

    //Hide Sidebar
    hiddenBarCloser.on("click", function () {
      hiddenBar.toggleClass("visible-sidebar");
      navToggler.toggleClass("open");
    });
  }
  

    //Single Item Carousel
    $(".testimonial-one__carousel").owlCarousel({
      loop: true,
      margin: 30,
      nav: true,
      smartSpeed: 500,
      autoplay: 5000,
      autoplayHoverPause: true,
      autoplayTimeout: 5000,
      navText: [
          '<span class="icon fa fa-angle-left"></span>',
          '<span class="icon fa fa-angle-right"></span>'
      ],
      responsive: {
          0: {
              items: 1
          },
          600: {
              items: 1
          },
          800: {
              items: 2
          },
          1024: {
              items: 2
          },
          1200: {
            items: 3
          }
      }
  });
  
    $(".collection-two__carousel").owlCarousel({
      loop: true,
      margin: 30,
      nav: true,
      smartSpeed: 500,
      autoplay: 5000,
      autoplayHoverPause: true,
      autoplayTimeout: 5000,
      navText: [
          '<span class="icon fa fa-angle-left"></span>',
          '<span class="icon fa fa-angle-right"></span>'
      ],
      responsive: {
          0: {
              items: 1
          },
          600: {
              items: 2
          },
          800: {
              items: 2
          },
          1024: {
              items: 3
          },
          1200: {
            items:4
          },
          1600: {
            items:4
          }
      }
    });

    // Project single page Slider section 
    $(document).ready(function() { 
        gsap.registerPlugin(ScrollTrigger);
      gsap.defaults({ease: "none", duration: 2});

      const cursor = document.querySelector(".cursor");
      const follower = document.querySelector(".cursor-follower");
      const swiperSlide = document.querySelectorAll(".project-slider");
      const clientX = document.querySelectorAll(".project-slider");
      const clientY = document.querySelectorAll(".project-slider");
      const value = window.scrollX;

      let posX = 0,
        posY = 0,
        mouseX = 0,
        mouseY = 0;

      TweenMax.to({}, 0.02, {
        repeat: -1,
        onRepeat: function () {
          posX += (mouseX - posX) / 9;
          posY += (mouseY - posY) / 9;

          TweenMax.set(follower, {
            css: {
              left: mouseX,
              top: mouseY - 150
            }
          });

          TweenMax.set(cursor, {
            css: {
              left: mouseX,
              top: mouseY - 150
            }
          });
        }
      });
    
      document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      swiperSlide.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursor.classList.add("active");
          follower.classList.add("active");
        });

        el.addEventListener("mouseleave", () => {
          cursor.classList.remove("active");
          follower.classList.remove("active");
        });
      });
    });

})(jQuery);