<script lang="ts">
    import { register } from 'swiper/element/bundle';
    import { onMount } from "svelte";
    import InternalCard from "./InternalCard.svelte";
  import type { MaisVendidos } from '@prisma/client';
  import { cartProducts } from "../../store";

  
    let vendidosList: MaisVendidos[] = [];
    let token: string;
    let productsWithQuantity:Array<any> = [];


    onMount(async () => {
      register();


      const res = await fetch("api/maisVendidos/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    vendidosList = data.maisVendidos;
    console.log(vendidosList);

    productsWithQuantity = vendidosList.map(pro =>({
      ...pro,
      quantity: 0
    }))

    console.log(productsWithQuantity);
    let listaLocalStorage = localStorage.getItem("cartProducts");

    if(listaLocalStorage){
    $cartProducts = JSON.parse(listaLocalStorage);
    }

      var swiper = new Swiper(".mySwiperVendidos", {
      slidesPerView: 3,
      spaceBetween: 30,
      loop:true,
      grabCursor: true,
      navigation: {
        nextEl: ".swiper-button-nextVendidos",
        prevEl: ".swiper-button-prevVendidos",
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


<div class="w-4/6 h-[620px] ml-auto mr-auto mt-24 mb-40">
    <h1 class="text-[40px]">MAIS VENDIDOS</h1>
        <div class="swiper mySwiperVendidos">
            <div class="swiper-wrapper pt-6 pl-1">
              {#each productsWithQuantity as v (v.id)}
              <div class="swiper-slide rounded-lg flex flex-col">
                <div class="w-full h-5/12">
                    <InternalCard idSwiper={"vendidos"+v.id} imgList={v.pictures} tag={v.tag}/>
                </div>
                <div class="w-full h-3/6 text-center description">
                    <h3>{v.name}</h3>
                    <h1 class="mt-6">R${v.price}</h1>
                    {#if v.quantity > 0}
                    {v.quantity}
            
                    {/if}
                    <div class="w-full px-2 flex justify-center items-center h-fit relative" style="bottom:-20px;">
                        <a on:click={() => {v.quantity--}} class="rounded-full p-2 cursor-pointer mr-1"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg></a>
                        <button on:click={() => addProduct(v)} class="py-2 px-4 xl:px-10 border border-[#183A5D] text-[#183A5D] rounded-xl font-bold transition-all ml-auto mr-auto block relative">ADICIONAR</button>
                        <a on:click={() => {v.quantity++}} class="rounded-full p-2 cursor-pointer ml-1"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg></a>
                </div>
                </div>
              </div>
              {/each}

              
      
            </div>
            <div class="swiper-button-prev swiper-button-prevVendidos"></div>
            <div class="swiper-button-next swiper-button-nextVendidos"></div>

            <div class="swiper-pagination"></div>
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
    .mySwiperVendidos {
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

</style>