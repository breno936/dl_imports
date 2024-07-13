<script lang="ts">
    import { register } from 'swiper/element/bundle';
    import { onMount } from "svelte";
    import InternalCard from "./InternalCard.svelte";
  import type { Novidades } from '@prisma/client';
  import { cartProducts } from "../../store";

  
    let novidadesList: Novidades[] = [];
    let token: string;
    let productsWithQuantity:Array<any> = [];


    onMount(async () => {
      register();


      const res = await fetch("api/novidades/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    novidadesList = data.novidades;
    console.log(novidadesList);

    productsWithQuantity = novidadesList.map(pro =>({
      ...pro,
      quantity: 0
    }))

    console.log(productsWithQuantity);
    let listaLocalStorage = localStorage.getItem("cartProducts");

    if(listaLocalStorage){
    $cartProducts = JSON.parse(listaLocalStorage);
    }

      var swiper = new Swiper(".mySwiperNovidades", {
      slidesPerView: 3,
      spaceBetween: 30,
      loop:true,
      grabCursor: false,
      navigation: {
        nextEl: ".swiper-button-nextNovidades",
        prevEl: ".swiper-button-prevNovidades",
      },
      breakpoints: {
        0:{
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 50,
        },
      },
    //   pagination: {
    //     el: ".swiper-pagination",
    //     clickable: true,
    //   },
    });
     
  
      });

      function addProduct(prod:any){
  const productExists = $cartProducts.some(product => product.id === prod.id);

  if(productExists){

  $cartProducts = $cartProducts.map(product => {
  if (product.id === prod.id) {
    return { ...product, quantity: product.quantity + prod.quantity };
  } else {
    return product;
  }
});
  }else{
  $cartProducts = [...$cartProducts, prod];
  }
  
  localStorage.setItem("cartProducts", JSON.stringify($cartProducts));
}
  </script>


<div class="w-4/6 h-[620px] ml-auto mr-auto mb-24">
    <h1 class="text-[40px]">NOVIDADES</h1>
        <div class="swiper mySwiperNovidades">
            <div class="swiper-wrapper pt-6 pl-1">
              {#each productsWithQuantity as n (n.id)}
              <div class="swiper-slide rounded-lg flex flex-col">
                <div class="w-full h-4/6">
                    <InternalCard idSwiper={"novidades"+n.id} imgList={n.pictures} tag={n.tag}/>
                </div>
                <div class="w-full h-2/6 text-center description">
                    <h3>{n.name}</h3>
                    <h1 class="mt-6">R${n.price}</h1>

                    {#if n.quantity > 0}
                    {n.quantity}
            
                    {/if}
                    <div class="w-full px-2 flex justify-center items-center h-fit relative" style="bottom:-20px;">
                        <a on:click={() => {n.quantity--}} class="rounded-full p-2 cursor-pointer mr-1"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg></a>
                        <button on:click={() => addProduct(n)} class="py-2 px-4 xl:px-10 border border-[#183A5D] text-[#183A5D] rounded-xl font-bold transition-all ml-auto mr-auto block relative">ADICIONAR</button>
                        <a on:click={() => {n.quantity++}} class="rounded-full p-2 cursor-pointer ml-1"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg></a>
                </div>
                </div>
              </div>
              {/each}
      
            </div>
            <div class="swiper-button-prev swiper-button-prevNovidades"></div>
            <div class="swiper-button-next swiper-button-nextNovidades"></div>

          </div>
          
</div>

<style>
    .description h3{
        font-family: "Roboto-Light";
    }

    .description h1{
        font-family: "Roboto-Bold";
        font-size: 26px;
    }

    h1{
        font-family: "Roboto-Black-Italic";
    }
    .mySwiperNovidades {
      width: 100%;
      height: 100%;
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
</style>