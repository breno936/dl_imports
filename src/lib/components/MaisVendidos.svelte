<script lang="ts">
import { onMount } from "svelte";
import InternalCard from "./InternalCard.svelte";
import type { MaisVendidos } from '@prisma/client';
import { cartProducts } from "../../store";

let vendidosList: MaisVendidos[] = [];
let token: string;
let productsWithQuantity: Array<any> = [];

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

  productsWithQuantity = vendidosList.map(pro => ({
    ...pro,
    quantity: 0
  }));

  console.log(productsWithQuantity);
  let listaLocalStorage = localStorage.getItem("cartProducts");

  if (listaLocalStorage) {
    $cartProducts = JSON.parse(listaLocalStorage);
  }

  var swiper = new Swiper(".mySwiperVendidos", {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: true,
    grabCursor: true,
    navigation: {
      nextEl: ".swiper-button-nextVendidos",
      prevEl: ".swiper-button-prevVendidos",
    },
    breakpoints: {
      0: {
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
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
});

function selectSizeModal(event) {
    const sizeSelect = event.currentTarget.closest('.description').querySelector('.sizeSelect select');
    sizeSelect.parentElement.classList.toggle('hidden');
  }

  function handleBuyButtonClick(event, product) {

    if (product.uniqueSize !== "" && product.quantity >= 1) {
      const prodWithSize = { ...product, size: product.uniqueSize, quantity: 1 };
      addProduct(prodWithSize);
    } else {
      document.getElementById("errorQuantity").style.top = "10px";
      setTimeout(() => {
        document.getElementById("errorQuantity").style.top = "-8rem";

      }, 2000);
    }
  }


      function addProduct(prod) {
    let productExists = false;

    $cartProducts = $cartProducts.map(product => {
      if (product.id === prod.id && product.size === prod.size) {
        productExists = true;
        return { ...product, quantity: product.quantity + prod.quantity };
      } else {
        return product;
      }
    });

    if (!productExists) {
      $cartProducts = [...$cartProducts, prod];
    }

    localStorage.setItem("cartProducts", JSON.stringify($cartProducts));

    document.getElementById("alertAdd").style.top = "10px";
      setTimeout(() => {
        document.getElementById("alertAdd").style.top = "-8rem";

      }, 2000);
  }

  </script>


<div class="w-4/6 h-[620px] ml-auto mr-auto mt-24 mb-40">
  <h1 class="text-[40px]">MAIS VENDIDOS</h1>
  <div class="swiper mySwiperVendidos">
    <div class="swiper-wrapper pt-6 pl-1">
      {#each productsWithQuantity as v (v.id)}
      <div class="swiper-slide rounded-lg flex flex-col">
        <div class="w-full h-4/6">
          <InternalCard idSwiper={"vendidos" + v.id} imgList={v.pictures} tag={v.tag} />
        </div>
        <div class="w-full h-2/6 text-center description">
          <div class="sizeSelect w-full hidden h-44 absolute -mt-44 z-40">
            <select bind:value={v.uniqueSize} class="w-2/3 max-w-xs px-4 py-2 mt-3 rounded-xl">
              <option value="" disabled selected>Tamanho</option>

              {#each v.size as s(s.id)}
              <option value="{s.size}">{s.size}</option>

              {/each}
         
          </select>
          <br/>
          <button on:click={(event) => handleBuyButtonClick(event, v)} class="buttonBuyFinal font-medium mt-4 px-4 py-2 rounded-3xl bg-black text-white">COMPRAR</button>
        </div>
        <a href="/productDetail/destaques/{v.id}" class="productName">

          <h3 class="inline-block">{v.name}</h3>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>
        </a>
        
        <h1 class="mt-6">R${v.price}</h1>
          {#if v.quantity > 0}
          {v.quantity}
          {/if}
          <div class="w-full px-2 flex justify-center items-center h-fit relative" style="bottom:-20px;">
            <a on:click={() => { v.quantity-- }} class="rounded-full p-2 cursor-pointer mr-1"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32-14.3 32 32z" /></svg></a>
            <button on:click={(event) => selectSizeModal(event)} class="py-2 px-4 xl:px-10 border border-[#183A5D] text-[#183A5D] rounded-xl font-bold transition-all ml-auto mr-auto block relative">COMPRAR</button>
            <a on:click={() => { v.quantity++ }} class="rounded-full p-2 cursor-pointer ml-1"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7-14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg></a>
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
    .productName:hover h3{
    color:rgb(255, 191, 0);
  }

  .productName:hover svg {
    fill:rgb(255, 191, 0);
  }
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

  button:hover {
    background-color: black;
    color: white;
    border-color: white;
  }

  .buttonBuyFinal:hover {
    background-color: rgb(255, 191, 0);
    color: black;
  }

  .sizeSelect {
    background-color: rgb(255, 255, 255, 0.8);
  }
</style>
