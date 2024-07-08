<script lang="ts">
    import { register } from 'swiper/element/bundle';
    import { onMount } from "svelte";
  
  
    onMount(async () => {
      register();
   
  
      var swiper = new Swiper(".mySwiperTopo", {
        loop: true,
        autoplay:true,
        slidesPerView: 1,
        spaceBetween: 30,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
  
     
  
      });
  </script>
  
  
  <div class="swiper mySwiperTopo z-10 relative">
      <div class="swiper-wrapper">
        <!-- {#each slides as slide(slide.id) } -->
        <div class="swiper-slide">
    
          <div class="absolute z-30">
            <div class="titleSlide text-[44px] py-5 px-14 text-black">TESTE</div>
            <div class="pSlide text-[16px] py-2 px-10 text-black w-fit ml-auto mr-auto">TESTE</div>
            <a href=""><button class="mt-8 py-2 px-10 border-2 border-transparent bg-black text-white rounded-xl text-sm transition-all slideButton">TESTE</button></a>
          </div>
        
        <img src="/img/2024-06-05_20h51_04.png" class="w-full h-full"/>
    
        </div>
        <div class="swiper-slide">
    
            <div class="absolute z-30">
              <div class="titleSlide text-[44px] py-5 px-14 text-black">TESTE</div>
              <div class="pSlide text-[16px] py-2 px-10 text-black w-fit ml-auto mr-auto">TESTE</div>
              <a href=""><button class="mt-8 py-2 px-10 border-2 border-transparent bg-black text-white rounded-xl text-sm transition-all slideButton">TESTE</button></a>
            </div>
          
          <img src="/img/2024-06-05_20h51_04.png" class="w-full h-full"/>
      
          </div>
        <!-- {/each} -->
     
        
      </div>
      <div class="swiper-button-next md:mr-10"></div>
      <div class="swiper-button-prev md:ml-10"></div>
    </div>
  
  
  <style module>
      .backBlur{
          backdrop-filter: blur(2.5px);
      }
      .titleSlide{
        background-color: rgba(255, 255, 255, 0.5);
        font-family: "Roboto-Black";
      }
      .pSlide{
        background-color: rgba(255, 255, 255, 0.5);
        font-family: "Roboto-Regular";
  
      }
      .swiper-button-next, .swiper-button-prev{
            color: white !important;
      }
      .swiper {
        width: 100%;
        height: 100vh;
      }
  
      .swiper-slide {
        text-align: center;
        font-size: 18px;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      
      }
  
      .swiper-slide img {
        display: block;
        width: 100%;
        height: 100%;
      }
      .slideButton:hover{
        border-color: #FFBF00;
        color: #FFBF00;
      }
    
  </style>