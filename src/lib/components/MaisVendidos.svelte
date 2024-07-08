<script lang="ts">
  import { register } from "swiper/element/bundle";
  import { onMount } from "svelte";
  import InternalCard from "./InternalCard.svelte";

  onMount(async () => {
    register();

    var swiper = new Swiper(".mySwiperNovidades", {
      slidesPerView: 3,
      spaceBetween: 30,
      loop: true,
      grabCursor: true,
      navigation: {
        nextEl: ".swiper-button-nextNovidades",
        prevEl: ".swiper-button-prevNovidades",
      },
      breakpoints: {
        320: { // Para telas menores
          slidesPerView: 1,
          spaceBetween: 10,
        },
        768: { // Para tablets
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: { // Para desktops
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  });
</script>

<div class="w-full bg-white h-full">
  <div class="flex flex-col w-4/6 h-auto ml-auto mr-auto mb-24">
    <h1 class="text-[67px] text-black">Mais Vendidos</h1>
    <div class="swiper mySwiperNovidades">
      <div class="swiper-wrapper pt-6 pl-1">
        <div class="swiper-slide rounded-lg flex flex-col">
          <div class="w-full h-4/6">
            <InternalCard idSwiper={"4"} />
          </div>
          <div class="w-full h-2/6 text-center description">
            <h3>Moletom Lacoste branco e azul</h3>
            <h1 class="mt-6">R$180,00</h1>
          </div>
        </div>

        <div class="swiper-slide rounded-lg flex flex-col">
          <div class="w-full h-4/6">
            <InternalCard idSwiper={"5"} />
          </div>
          <div class="w-full h-2/6 text-center description">
            <h3>Moletom Lacoste branco e azul</h3>
            <h1 class="mt-6">R$180,00</h1>
          </div>
        </div>

        <div class="swiper-slide rounded-lg flex flex-col">
          <div class="w-full h-4/6">
            <InternalCard idSwiper={"6"} />
          </div>
          <div class="w-full h-2/6 text-center description">
            <h3>Moletom Lacoste branco e azul</h3>
            <h1 class="mt-6">R$180,00</h1>
          </div>
        </div>

        <div class="swiper-slide rounded-lg flex flex-col">
          <div class="w-full h-4/6">
            <InternalCard idSwiper={"7"} />
          </div>
          <div class="w-full h-2/6 text-center description">
            <h3>Moletom Lacoste branco e azul</h3>
            <h1 class="mt-6">R$180,00</h1>
          </div>
        </div>
      </div>
      <div class="swiper-button-prev swiper-button-prevNovidades"></div>
      <div class="swiper-button-next swiper-button-nextNovidades"></div>
    </div>
    <button class="flex bg-black text-white px-5 py-3 self-center mt-10">
      Ver todos
    </button>
  </div>
</div>


<style>
  .description h3 {
    font-family: "Roboto-Light";
  }

  .description h1 {
    font-family: "Roboto-Bold";
    font-size: 26px;
  }

  h1 {
    font-family: "Roboto-Black-Italic";
  }

  .mySwiperNovidades {
    width: 100%;
    height: 100%;
    padding: 10px;
  }

  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 5px rgb(0, 0, 0, 0.5);
    height: 90%;
  }

  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }



  @media (max-width: 768px) {
    .mySwiperNovidades {
      padding: 5px;
    }

    .swiper-slide {
      flex-direction: column;
      height: auto;
    }

    .description h3 {
      font-size: 16px;
    }

    .description h1 {
      font-size: 20px;
    }
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    .mySwiperNovidades {
      padding: 10px;
    }

    .swiper-slide {
      height: 80%;
    }

    .description h3 {
      font-size: 18px;
    }

    .description h1 {
      font-size: 24px;
    }
  }

  @media (min-width: 1024px) {
    .mySwiperNovidades {
      padding: 20px;
    }

    .swiper-slide {
      height: 90%;
    }

    .description h3 {
      font-size: 18px;
    }

    .description h1 {
      font-size: 26px;
    }
  }
</style>
