
import QOverlapCarousel from "./components/q-overlap-carousel.vue";
import QOverlapCarouselItem from "./components/q-overlap-carousel-item.vue";

export { QOverlapCarousel, QOverlapCarouselItem }; //实现按需引入

const components = [QOverlapCarousel, QOverlapCarouselItem];

const install = function (App: any, options: any) {
  components.forEach((component) => {
    App.component(component.name, component);
  });
};

export default { install }; // 实现批量引入