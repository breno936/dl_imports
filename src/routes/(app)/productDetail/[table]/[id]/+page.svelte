<script lang="ts">
    import { onMount, tick } from "svelte";
    import { page } from '$app/stores';
    import { get } from 'svelte/store';
    import { register } from 'swiper/element/bundle';
  import type { Product, Sizes } from "@prisma/client";
  import { cartProducts } from "../../../../../store";

     
    let product:Product; 
    let token: string;
    let categoryList:any[] = [];
    let subCategoryList:any[] = [];
    let sizeListCreate:{id:number, size:string}[] = [];
    let sizeList:Sizes[] = [];
    let productsWithQuantity:Array<any> = [];

        onMount(async () => {
          const id = get(page).params.id;
          const table = get(page).params.table;
          register();

    if(table == "destaques"){
    const res = await fetch(`/api/destaques/getOne/?id=${id}`);
    const data = await res.json();
    product = data.destaque;
    }

    if(table == "novidades"){
        const res = await fetch(`/api/novidades/getOne/?id=${id}`);
    const data = await res.json();
    product = data.novidade;
    }

    if(table == "vendidos"){
        const res = await fetch(`/api/maisVendidos/getOne/?id=${id}`);
    const data = await res.json();
    product = data.maisVendidos;
    }

    if(table == "products"){
        const res = await fetch(`/api/products/getOne/?id=${id}`);
    const data = await res.json();
    product = data.product;
    }

    productsWithQuantity = [{
        ...product,
        uniqueSize:"",
        quantity:1
    }]

    let listaLocalStorage = localStorage.getItem("cartProducts");

    if(listaLocalStorage){
    $cartProducts = JSON.parse(listaLocalStorage);
    }

    console.log(product);

    const resCategory = await fetch("/api/category/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const dataCategory = await resCategory.json();
    categoryList = dataCategory.categories;
    console.log(categoryList);

    const resSubCategory = await fetch("/api/subCategory/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const dataSubCategory = await resSubCategory.json();
    subCategoryList = dataSubCategory.subCategories;
    console.log(subCategoryList);

    const resSize = await fetch("/api/size/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const dataSize = await resSize.json();
    sizeList = dataSize.sizes;
    sizeListCreate = product.size;

    console.log(sizeListCreate);
    var swiper = new Swiper(".product-thumb", {
    loop: true,
  spaceBetween: 12,
  slidesPerView: 4,
  
  freeMode: true,
  watchSlidesProgress: true,
});

var swiper2 = new Swiper(".product-prev", {
  loop: true,
  spaceBetween: 32,
  effect: "fade",
 
  thumbs: {
      swiper: swiper,
  },
});

});

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
                                          
<section class="py-10 lg:py-24 relative mt-40">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <div class="pro-detail w-full flex flex-col order-last lg:order-none max-lg:max-w-[608px] max-lg:mx-auto">
                <h2 class="mb-2 font-manrope font-bold text-3xl leading-10 text-gray-900">{productsWithQuantity[0] ? productsWithQuantity[0].name : ""}
                </h2>
                <div class="flex flex-col sm:flex-row sm:items-center mb-6">
                    <h6
                        class="font-manrope font-semibold text-2xl leading-9 text-gray-900 pr-5 mr-5">
                        {productsWithQuantity[0] ? "R$"+productsWithQuantity[0].price : ""}</h6>
                 

                </div>
                <p class="text-gray-500 text-base font-normal mb-8 ">
                    {productsWithQuantity[0] ? productsWithQuantity[0].description : ""}
                </p>
                <div class="block w-full">
                    <div class="text">
                       
                        <div class="block w-full mb-6">
                            <p class="font-medium text-lg leading-8 text-gray-900 mb-4">Tamanhos</p>
                            <div class="grid grid-cols-3 min-[400px]:grid-cols-5 gap-3 max-w-md">
                                {#if productsWithQuantity[0]}
                                {#each productsWithQuantity[0].size as p(p.id)}
                                <button
                                on:click={() => {productsWithQuantity[0].uniqueSize = p.size}}
                                class="focus:bg-gray-500 bg-white text-center py-1.5 px-6 w-full font-semibold text-lg leading-8 text-gray-900 border border-gray-200 flex items-center rounded-full justify-center transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-100 hover:border-gray-300 visited:border-gray-300 visited:bg-gray-50">{p.size}</button>
                           
                                {/each}
                          
                            {/if}
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                            
                            {#if productsWithQuantity[0]}
                            <div class="flex items-center justify-center w-full">
                                <button
                                on:click={() => {if(productsWithQuantity[0].quantity > 1){productsWithQuantity[0].quantity--}}}
                                    class="group py-4 px-6 border border-gray-400 rounded-l-full shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-300 hover:bg-gray-50">
                                    <svg class="stroke-gray-700 transition-all duration-500 group-hover:stroke-black"
                                        width="22" height="22" viewBox="0 0 22 22" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.5 11H5.5" stroke="" stroke-width="1.6"
                                            stroke-linecap="round" />
                                        <path d="M16.5 11H5.5" stroke="" stroke-opacity="0.2" stroke-width="1.6"
                                            stroke-linecap="round" />
                                        <path d="M16.5 11H5.5" stroke="" stroke-opacity="0.2" stroke-width="1.6"
                                            stroke-linecap="round" />
                                    </svg>
                                </button>
                                <input type="text"
                                    readonly
                                    bind:value={productsWithQuantity[0].quantity}
                                    class="font-semibold text-gray-900 text-lg py-[13px] px-6 w-full lg:max-w-[118px] border-y border-gray-400 bg-transparent placeholder:text-gray-900 text-center hover:bg-gray-50 focus-within:bg-gray-50 outline-0"
                                    placeholder="1">
                                <button
                                on:click={() => {productsWithQuantity[0].quantity++}}
                                    class="group py-4 px-6 border border-gray-400 rounded-r-full shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-300 hover:bg-gray-50">
                                    <svg class="stroke-gray-700 transition-all duration-500 group-hover:stroke-black"
                                        width="22" height="22" viewBox="0 0 22 22" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 5.5V16.5M16.5 11H5.5" stroke="" stroke-width="1.6"
                                            stroke-linecap="round" />
                                        <path d="M11 5.5V16.5M16.5 11H5.5" stroke="" stroke-opacity="0.2"
                                            stroke-width="1.6" stroke-linecap="round" />
                                        <path d="M11 5.5V16.5M16.5 11H5.5" stroke="" stroke-opacity="0.2"
                                            stroke-width="1.6" stroke-linecap="round" />
                                    </svg>
                                </button>
                            </div>
                        {/if}
                        </div>
                        <div class="flex items-center gap-3">
                       
                            <button on:click={(event) => handleBuyButtonClick(event, productsWithQuantity[0])}
                                class="text-center w-full px-5 py-4 rounded-[100px] bg-black flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-200 hover:bg-white hover:text-black hover:border-black hover:border">
                                Comprar
                            </button>
                        </div>

                    </div>
                </div>

            </div>
            <div class="">
                <div style="--swiper-navigation-color: #fff; --swiper-pagination-color: #fff"
                    class="swiper product-prev mb-6">
                    <div class="swiper-wrapper">
                        {#if productsWithQuantity[0]}
                            {#each productsWithQuantity[0].pictures as p(p.id)}
                            <div class="swiper-slide h-auto w-full">
                                <img src="{p.namePath}"
                                    alt="{p.id}" class="mx-auto h-full w-full">
                            </div>
                            {/each}
                        {/if}
                        
                   
                    </div>

                </div>
                <div thumbsSlider="" class="swiper product-thumb max-w-[608px] mx-auto">
                    <div class="swiper-wrapper">
                        {#if product}
                        {#each productsWithQuantity[0].pictures as p(p.id)}
                        <div class="swiper-slide h-auto">
                            <img src="{p.namePath}" alt="{p.id}"
                                class=" cursor-pointer border-2 h-full border-gray-50 transition-all duration-500 hover:border-indigo-600 slide:border-indigo-600">
                        </div>
                        
                        {/each}
                    {/if}
                        
                    </div>
                </div>
            </div>


        </div>
    </div>
</section>

<style>
    .swiper-wrapper {
        height: fit-content !important;
       
        width: max-content;
    }

    .swiper-button-prev:after,
    .swiper-rtl .swiper-button-next:after {
        content: "" !important;
    }

    .swiper-button-next:after,
    .swiper-rtl .swiper-button-prev:after {
        content: "" !important;

    }

    .product-thumb .swiper-slide.swiper-slide-thumb-active>.slide\:border-indigo-600 {
        --tw-border-opacity: 1;
        border-color: rgb(79 70 229 / var(--tw-border-opacity));
    }

    .cartButton{
        background-color: rgb(255, 191, 0,0.5);
    }

    .cartButton:hover{
        background-color: rgb(255, 191, 0,1);

    }
</style>
