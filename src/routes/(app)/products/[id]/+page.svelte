<script lang="ts">
  import InternalCard from "$components/InternalCard.svelte";
  import type { Product, Sizes, SubCategory } from "@prisma/client";
  import { onMount } from "svelte";
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import { cartProducts } from "../../../../store";


  let hiddenFilter:boolean = true;
  let hiddenFilter1:boolean = true;
  let hiddenFilter2:boolean = true;
  let hiddenFilter3:boolean = true;
  let hiddenFilterMobile:boolean = true;
  let productList: Product[] = [];
  let token: string;
  let categoryList: SubCategory[] = []
  const ids:number[] = [];
  const sizes:string[] = [];
  let orderCondition:string;
  let productsWithQuantity:Array<any> = [];
  let id;
  let sizeList:Sizes[] = [];


  onMount(async () => {
    id = get(page).params.id;

      const res = await fetch(`/api/products/getAllCategory/?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    productList = data.products;
    console.log(productList);

    productsWithQuantity = productList.map(pro =>({
      ...pro,
      uniqueSize:"",
      quantity: 0
    }))

    console.log(productsWithQuantity);
    let listaLocalStorage = localStorage.getItem("cartProducts");

    if(listaLocalStorage){
    $cartProducts = JSON.parse(listaLocalStorage);
    }

    const resC = await fetch("/api/subCategory/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const dataC = await resC.json();
    categoryList = dataC.subCategories;

    if(id == "3" || id == "1"){

      const resSize = await fetch("/api/size/getAllCalcado", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const dataSize = await resSize.json();
    sizeList = dataSize.sizes;

    }else{
    const resSize = await fetch("/api/size/getAllRoupa", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const dataSize = await resSize.json();
    sizeList = dataSize.sizes;
    }

  });

  async function getSubCategory(idSub:number, idSize:any, orderPrice:string){
    const id = get(page).params.id;

    if(idSub != 0){
      if(ids.includes(idSub)){
      const index = ids.indexOf(idSub);
      if (index !== -1) {
        ids.splice(index, 1);
      }
    }else{
      ids.push(idSub);
    }
    }

    console.log(idSize);
    if(idSize != null){
      if(sizes.includes(idSize)){
      const index = sizes.indexOf(idSize);
      if (index !== -1) {
        sizes.splice(index, 1);
      }
    }else{
      sizes.push(idSize);
    }
    }
    console.log(sizes);

    if(orderPrice != ""){
      orderCondition = orderPrice; 
    }

    console.log(ids);
    const res = await fetch(`/api/products/getAllSubCategory`, {
      method:'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ arrId:ids, idCategory:id, arrSizes:sizes, orderPrice:orderCondition })

    });
    const data = await res.json();
    productList = data.products;
    console.log(productList);
    productsWithQuantity = productList.map(pro =>({
      ...pro,
      uniqueSize:"",
      quantity: 0
    }))
  }




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
  
<div class="divTopo"></div>

<!--
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
-->
<div class="bg-white">
  <div>
    <!--
      Mobile filter dialog

      Off-canvas filters for mobile, show/hide based on off-canvas filters state.
    -->
    <div class:hidden={hiddenFilterMobile} class="relative z-40 lg:hidden" role="dialog" aria-modal="true">
      <!--
        Off-canvas menu backdrop, show/hide based on off-canvas menu state.

        Entering: "transition-opacity ease-linear duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "transition-opacity ease-linear duration-300"
          From: "opacity-100"
          To: "opacity-0"
      -->
      <div class="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true"></div>

      <div class="fixed inset-0 z-50 flex">
        <!--
          Off-canvas menu, show/hide based on off-canvas menu state.

          Entering: "transition ease-in-out duration-300 transform"
            From: "translate-x-full"
            To: "translate-x-0"
          Leaving: "transition ease-in-out duration-300 transform"
            From: "translate-x-0"
            To: "translate-x-full"
        -->
        <div class="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
          <div class="flex items-center justify-between px-4">
            <h2 class="text-lg font-medium text-gray-900">Filters</h2>
            <button type="button" on:click={() => {hiddenFilterMobile = !hiddenFilterMobile}} class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400">
              <span class="sr-only">Close menu</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Filters -->
          <form class="mt-4 border-t border-gray-200">
           

            <div class="border-t border-gray-200 px-4 py-6">
              <h3 class="-mx-2 -my-3 flow-root">
                <!-- Expand/collapse section button -->
                <button type="button" class="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500" aria-controls="filter-section-mobile-1" aria-expanded="false">
                  <span class="font-medium text-gray-900">Category</span>
                  
                </button>
              </h3>
              <!-- Filter section, show/hide based on section state. -->
              <div class="pt-6" id="filter-section-mobile-1">
                <div class="space-y-6">
                  {#each categoryList as c(c.id)}
                  <div class="flex items-center" on:click={() =>{getSubCategory(c.id, null, "")}}>
                    <input id="filter-mobile-category-0" name="category[]" value="new-arrivals" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                    <label for="filter-mobile-category-0" class="ml-3 min-w-0 flex-1 text-gray-500">{c.name}</label>
                  </div>
                  {/each}
                  
                  
                </div>
              </div>
            </div>
            <div class="border-t border-gray-200 px-4 py-6">
              <h3 class="-mx-2 -my-3 flow-root">
                <!-- Expand/collapse section button -->
                <button type="button" class="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500" aria-controls="filter-section-mobile-2" aria-expanded="false">
                  <span class="font-medium text-gray-900">Size</span>
                  <span class="ml-6 flex items-center">
                
                  </span>
                </button>
              </h3>
              <!-- Filter section, show/hide based on section state. -->
              <div class="pt-6" id="filter-section-mobile-2">
                <div class="space-y-6">
                  {#each sizeList as s (s.id)}
                  <div class="flex items-center" on:click={() => getSubCategory(0, s, "")}>
                    <input id="filter-size-0" name="size[]" value="2l" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                    <label for="filter-size-0" class="ml-3 text-sm text-gray-600">{s.size}</label>
                  </div>
                  {/each}
            
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <main class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
        {#if id == 2}
        <h1 class="text-4xl font-bold tracking-tight text-gray-900">Blusas</h1>
        {/if}
        {#if id == 1}
        <h1 class="text-4xl font-bold tracking-tight text-gray-900">Tênis</h1>
        {/if}
        {#if id == 3}
        <h1 class="text-4xl font-bold tracking-tight text-gray-900">Chinelos</h1>
        {/if}
        {#if id == 4}
        <h1 class="text-4xl font-bold tracking-tight text-gray-900">Bonés</h1>
        {/if}
        {#if id == 5}
        <h1 class="text-4xl font-bold tracking-tight text-gray-900">Polo</h1>
        {/if}
        {#if id == 6}
        <h1 class="text-4xl font-bold tracking-tight text-gray-900">Camisas</h1>
        {/if}

        <div class="flex items-center">
          <div class="relative inline-block text-left">
            <div>
              <button on:click={() => {hiddenFilter = !hiddenFilter}} type="button" class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900" id="menu-button" aria-expanded="false" aria-haspopup="true">
                Ordenar
                <svg class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>

            <!--
              Dropdown menu, show/hide based on menu state.

              Entering: "transition ease-out duration-100"
                From: "transform opacity-0 scale-95"
                To: "transform opacity-100 scale-100"
              Leaving: "transition ease-in duration-75"
                From: "transform opacity-100 scale-100"
                To: "transform opacity-0 scale-95"
            -->
                <div></div>
            <div class:hidden={hiddenFilter} class="absolute hidden right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
              <div class="py-1" role="none">
                <!--
                  Active: "bg-gray-100", Not Active: ""

                  Selected: "font-medium text-gray-900", Not Selected: "text-gray-500"
                -->
                <a href="#" on:click={() => getSubCategory(0, null, "asc")} class="block px-4 py-2 text-sm text-gray-500" role="menuitem" tabindex="-1" id="menu-item-3">Menor preço</a>
                <a href="#" on:click={() => getSubCategory(0, null, "desc")} class="block px-4 py-2 text-sm text-gray-500" role="menuitem" tabindex="-1" id="menu-item-4">Maior preço</a>
              </div>
            </div>
          </div>


          <button type="button" on:click={() => {hiddenFilterMobile = !hiddenFilterMobile}} class="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
            <span class="sr-only">Filters</span>
            <svg class="h-5 w-5" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <section aria-labelledby="products-heading" class="pb-24 pt-6">
        <h2 id="products-heading" class="sr-only">Products</h2>

        <div class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          <!-- Filters -->
          <form class="hidden lg:block">
            <h3 class="sr-only">Categories</h3>
           

           
            <div class="border-b border-gray-200 py-6">
              <h3 class="-my-3 flow-root">
                <!-- Expand/collapse section button -->
                <button type="button" on:click={() => {hiddenFilter2 = !hiddenFilter2;}} class="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500" aria-controls="filter-section-1" aria-expanded="false">
                  <span class="font-medium text-gray-900">Category</span>
                  <span class="ml-6 flex items-center">
                    <!-- Expand icon, show/hide based on section open state. -->
                    <svg class:hidden={!hiddenFilter2} class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    <!-- Collapse icon, show/hide based on section open state. -->
                    <svg class:hidden={hiddenFilter2} class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </button>
              </h3>
              <!-- Filter section, show/hide based on section state. -->
              <div class="pt-6" class:hidden={hiddenFilter2} id="filter-section-1">
                <div class="space-y-4">
                  {#each categoryList as c(c.id)}
                  <div class="flex items-center" on:click={() =>{getSubCategory(c.id, null, "")}}>
                    <input id="filter-category-0" name="category[]" value="new-arrivals" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                    <label for="filter-category-0" class="ml-3 text-sm text-gray-600">{c.name}</label>
                  </div>
                  {/each}
                 
                 
                </div>
              </div>
            </div>
            <div class="border-b border-gray-200 py-6">
              <h3 class="-my-3 flow-root">
                <!-- Expand/collapse section button -->
                <button on:click={() => {hiddenFilter3 = !hiddenFilter3}} type="button" class="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500" aria-controls="filter-section-2" aria-expanded="false">
                  <span class="font-medium text-gray-900">Size</span>
                  <span class="ml-6 flex items-center">
                    <!-- Expand icon, show/hide based on section open state. -->
                    <svg class:hidden={!hiddenFilter3} class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    <!-- Collapse icon, show/hide based on section open state. -->
                    <svg class:hidden={hiddenFilter3} class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </button>
              </h3>
              <!-- Filter section, show/hide based on section state. -->
              <div class:hidden={hiddenFilter3} class="pt-6" id="filter-section-2">
                <div class="space-y-4">
                  {#each sizeList as s (s.id)}
                  <div class="flex items-center" on:click={() => getSubCategory(0, s, "")}>
                    <input id="filter-size-0" name="size[]" value="2l" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                    <label for="filter-size-0" class="ml-3 text-sm text-gray-600">{s.size}</label>
                  </div>
                  {/each}
                  
                </div>
              </div>
            </div>
          </form>

          <!-- Product grid -->
          <div class="lg:col-span-3">
            <div class="flex mt-10 h-fit w-full justify-evenly gap-x-1 gap-y-8 flex-wrap">
              {#each productsWithQuantity as p (p.id)}
              <div class="max-[300px]:w-[85%] max-[470px]:w-[70%] w-[50%] sm:w-[40%] md:w-[30%] h-[430px] sm:h-[460px] md:h-[440px] lg:h-[510px] relative">
                <div class="card-product h-full rounded-lg flex flex-col">
                  <div class="w-full h-1/2 sm:h-3/5 md:h-3/5 lg:h-5/6 xl:h-4/6 block relative">
                      <InternalCard idSwiper={"product"+p.id} imgList={p.pictures} tag={p.tag}/>
                  </div>
                  <div class="w-full h-5/6 sm:h-4/6 md:h-4/6 lg:h-3/6 xl:h-2/6 block relative text-center description">
                    <div class="sizeSelect w-full hidden h-44 absolute -mt-44 z-40">
                      <select bind:value={p.uniqueSize} class="w-2/3 max-w-xs px-4 py-2 mt-3 rounded-xl">
                        <option value="" disabled selected>Tamanho</option>
  
                        {#each p.size as s(s.id)}
                        <option value="{s.size}">{s.size}</option>
  
                        {/each}
                   
                    </select>
                    <br/>
                    <button on:click={(event) => handleBuyButtonClick(event, p)} class="buttonBuyFinal font-medium mt-4 px-4 py-2 rounded-3xl bg-black text-white">COMPRAR</button>
                   </div>
                    <a href="/productDetail/destaques/{p.id}" class="productName">

                      <h3 class="inline-block">{p.name}</h3>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>
                    </a>
                    <h1 class="mt-6">R${p.price}</h1>
                      {#if p.quantity > 0}
                      {p.quantity}
              
                      {/if}
                      <div class="w-full px-2 flex justify-center items-center h-fit relative" style="bottom:-5px;">
                        <a on:click={() => { p.quantity-- }} class="rounded-full p-2 cursor-pointer mr-1"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32-14.3 32 32z" /></svg></a>
                        <button on:click={(event) => selectSizeModal(event)} class="buttonBuy py-2 px-4 xl:px-10 border border-[#183A5D] text-[#183A5D] rounded-xl font-bold transition-all ml-auto mr-auto block relative">COMPRAR</button>
                        <a on:click={() => { p.quantity++ }} class="rounded-full p-2 cursor-pointer ml-1"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7-14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg></a>
                  </div>
                  </div>
                 
                </div>
              </div>
              {/each}

            
              </div>
            
            </div>
        </div>
      </section>
    </main>
  </div>
</div>

  <style>
        .buttonBuy:hover{
      background-color: black;
      color:white;
      border-color: white;
    }

.buttonBuyFinal:hover{
  background-color: rgb(255, 191, 0);
  color:black;
}
    .sizeSelect{
    background-color: rgb(255,255,255, 0.8);
  }
      .productName:hover h3{
    color:rgb(255, 191, 0);
  }

  .productName:hover svg {
    fill:rgb(255, 191, 0);
  }
    .description h3{
        font-family: "Roboto-Light";
    }
    .addButton:hover{
  background-color: #183A5D;
  color:white;
  border-color: #183A5D;
}
    .description h1{
        font-family: "Roboto-Bold";
        font-size: 26px;
    }

    h1{
        font-family: "Roboto-Black-Italic";
    }


    .card-product {
      text-align: center;
      font-size: 18px;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0px 0px 5px rgb(0, 0, 0, 0.5);
    }

    .divTopo{
        height: 12.5rem;
    }
</style>