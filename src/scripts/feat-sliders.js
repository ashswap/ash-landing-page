import Swiper, {
  Navigation,
  Pagination,
  Controller,
  EffectFade,
  Autoplay,
} from "swiper";
import gsap from "./vendor/gsap-member/src/gsap-core";
// configure Swiper to use modules
Swiper.use([Navigation, Pagination, Controller, EffectFade, Autoplay]);

window.addEventListener("load", () => {
  homePageFeatSlider();
});

function homePageFeatSlider() {
  const imageslider = new Swiper(".c-feat-imageslider", {
    initialSlide: 0,
    slidesPerView: 1,
    wrapperClass: "c-feat-imageslider__wrapper",
    slideClass: "c-feat-imageslider__item",
    slideActiveClass: "is-active",
    loop: true,
    allowTouchMove: false,
    speed: 500,
  });
  const contentslider = new Swiper(".c-feat-contentslider", {
    initialSlide: 0,
    slidesPerView: 1,
    wrapperClass: "c-feat-contentslider__wrapper",
    slideClass: "c-feat-contentslider__item",
    slideActiveClass: "is-active",
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    allowTouchMove: false,
    speed: 500,
    direction: "vertical",
    pagination: {
      el: ".c-feat-titleslider__dots",
      type: "bullets",
      clickable: true,
    },
  });
  // const titleslider = new Swiper(".c-feat-titleslider", {
  //   initialSlide: 1,
  //   slidesPerView: 1,
  //   wrapperClass: "c-feat-titleslider__wrapper",
  //   slideClass: "c-feat-titleslider__item",
  //   slideActiveClass: "is-active",
  //   loop: true,
  //   allowTouchMove: false,
  //   speed: 500,

  // });

  const grid = document.querySelector(".o-feat-sliders .o-feat-sliders__grids");

  const gridItems = Array.from(
    document.querySelectorAll(
      ".o-feat-sliders .o-feat-sliders__grids--inner > div"
    )
  );

  const gridThemeColors = ["#7b61ff", "#ff005c", "#0ff"];
  contentslider.on("slideChange", (swiper) => {
    imageslider.slideTo(swiper.activeIndex);

    const delay = [0, 0.4, 0.3, 0.2];
    let gridTl = gsap.timeline();
    gridItems.map((item, i) => {
      item.style.setProperty("opacity", null);
      gridTl = gridTl.to(
        item,
        {
          opacity: 0,
          duration: 0.2,
        },
        delay[i % delay.length]
      );
    });
    setTimeout(() => {
      grid.style.setProperty(
        "--rec-theme",
        gridThemeColors[swiper.activeIndex % gridThemeColors.length]
      );
      switch (swiper.activeIndex) {
        case 4:
          grid.style.setProperty("left", "0px");
          grid.style.setProperty("right", "auto");
          grid.style.setProperty("top", "0px");
          grid.style.setProperty("bottom", "auto");
          grid.style.setProperty("transform", "translateX(-30%)");
          break;
        case 5:
          grid.style.setProperty("left", "auto");
          grid.style.setProperty("right", "0px");
          grid.style.setProperty("top", "auto");
          grid.style.setProperty("bottom", "0px");
          grid.style.setProperty("transform", "translateY(20%)");
          break;
        case 1:
        case 7:
          grid.style.setProperty("left", "0px");
          grid.style.setProperty("right", "auto");
          grid.style.setProperty("top", "0px");
          grid.style.setProperty("bottom", "auto");
          grid.style.setProperty("transform", "translateX(0%)");
          break;
        default:
          grid.style.setProperty("left", "auto");
          grid.style.setProperty("right", "15px");
          grid.style.setProperty("top", "0px");
          grid.style.setProperty("bottom", "auto");
          grid.style.setProperty("transform", "translateX(0%)");
      }

      gridTl.reverse();
    }, 700);
  });

  // titleslider.on("slideChangeTransitionEnd", (swiper) => {
  //   gridItems.map((item, i) => {
  //     gsap.to(item, { opacity: , delay: i * Math.random() });
  //   });
  // });
}
