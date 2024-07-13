<script lang="ts">
    import { register } from 'swiper/element/bundle';
    import { onMount } from "svelte";
  import type { Pictures } from '@prisma/client';

    export let imgList:any[];
    export let idSwiper;
    export let tag;

        let teste = `.mySwiperInternal${idSwiper}`;
      onMount(async () => {
      register();

      console.log(imgList);
      var swiper = new Swiper(teste, {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      //grabCursor: true,
      navigation: {
        nextEl: `.swiper-button-next${idSwiper}`,
        prevEl: `.swiper-button-prev${idSwiper}`,
      },
    });
     
  
      });
  </script>


<div class="w-full h-full ml-auto mr-auto">
    <div class="swiper mySwiperInternal{idSwiper} h-full w-full">
      <div class="absolute px-3 sm:px-6 py-2 rounded-xl text-[12px] tagDestaque text-white top-[84%] z-20 left-3">{tag}</div>

        <div class="swiper-wrapper">
          {#if imgList}
          {#each imgList as i (i.id)}
          <div class="swiper-slide text-center text-[18px] bg-white flex justify-center items-center h-[90%] w-full">
            <img class="h-full w-full block object-cover" src="{i.namePath}"/>
          </div>
          {/each}
          {/if}
        
        
          <!-- <div class="swiper-slide text-center text-[18px] bg-white flex justify-center items-center h-[90%] w-full"><img class="h-full w-full block object-cover" src="/img/415274231_18404092558059327_213975641561124811_n.jpg"/></div>
          <div class="swiper-slide text-center text-[18px] bg-white flex justify-center items-center h-[90%] w-full"><img class="h-full w-full block object-cover" src="/img/bones.jpg"/></div> -->
     
        </div>
        <div class="swiper-button-next swiper-button-next{idSwiper}"></div>
        <div class="swiper-button-prev swiper-button-prev{idSwiper}"></div>
        <!-- <div class="swiper-pagination"></div> -->
      </div>
</div>

    <style>
    .tagDestaque{
      background-color: rgb(0,0,0,0.8);
      font-family: "Roboto-Bold";
    }
    /* .mySwiperInternal2 {
      width: 100%;
      height: 100%;
    } */

    /* .swiper-slide {
      text-align: center;
      font-size: 18px;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 90%;
    } */

    /* .swiper-slide img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    } */
    </style>