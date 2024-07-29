<script lang="ts">
  import Footer from "$components/Footer.svelte";
import NavBar from "$lib/components/NavBar.svelte";
  import Decimal from "decimal.js";

import { cartProducts } from "../../store";
    // let clientNumber:string;
    let linkMsg:string;
    let total:Decimal = new Decimal("0.0");

      // Função para calcular o total dos preços dos produtos no carrinho
      function calculateTotal() {
    total = new Decimal(0);
    $cartProducts.forEach(element => {
      total = total.plus(new Decimal(element.price).times(new Decimal(element.quantity)));
    });
  }


    function enviarWhats(){
        linkMsg = "https://wa.me//5511988949024?text=Olá%20Tenho%20interesse%20em%20comprar%20esses%20produtos";
        $cartProducts.forEach(element => {
            linkMsg = linkMsg+`%0A${element.name} ${element.quantity}X`;
        });

        window.open(linkMsg, "_blank");

        $cartProducts = [];
        localStorage.removeItem("cartProducts");
    }

    function deleteProduct(productId: number, uniqueSize: string) {
      console.log(productId);
      console.log(uniqueSize);
    cartProducts.update(items => items.filter(item => item.id !== productId || item.uniqueSize !== uniqueSize));

    localStorage.setItem("cartProducts", JSON.stringify($cartProducts));
  }

  calculateTotal();

</script>

<div id="alertAdd" role="alert" class="alert alert-success w-4/12 fixed z-50 right-8 -top-32">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6 shrink-0 stroke-current"
    fill="none"
    viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>Produto adicionado no carrinho!</span>
</div>


<div id="errorQuantity" role="alert" class="alert alert-error w-4/12 fixed z-50 right-8 -top-32">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6 shrink-0 stroke-current"
    fill="none"
    viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>Selecione a quantidade e o Tamanho.</span>
</div>
<NavBar/>

<div class="drawer drawer-end z-50">
  <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <!-- Page content here -->
  </div> 
  <div class="drawer-side">
    <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu p-4 w-[25rem] min-h-full bg-base-200 text-base-content">
      {#if $cartProducts.length > 0}
      {#each $cartProducts as product (product.id + product.uniqueSize) }
      <div class="flex mt-5 items-center">
      <li class="flex flex-row items-center flex-nowrap w-11/12">
        <img class="rounded-3xl w-28 h-auto hover:bg-transparent" src="{product.pictures[0].namePath}"/>
        <div class="hover:bg-transparent flex flex-wrap w-max">
        <span class="text-[22px] font-light">{product.name}<span class="text-[11px]">({product.uniqueSize})</span></span>
        <span class="ml-3 font-normal h-fit">{product.quantity}<span class="text-[8px]">X</span></span>
        <span class="w-1/2 font-medium">R${product.price}</span>
      </div>
      </li>
      <a class="text-center h-fit w-fit cursor-pointer hover:scale-110" on:click={() => deleteProduct(product.id, product.uniqueSize)}><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="red" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></a>
       </div>
      {/each}
      {/if}
      <!-- <div class="mt-8   ml-auto mr-auto">
        <span class="text-[20px] font-bold">Total: R${total.toFixed(2)}</span>
      </div> -->

      {#if $cartProducts.length > 0}
      <form class="text-center w-full mt-4 bottom-6">
        <!-- <input on:input={handleInput} bind:value={clientNumber} type="text" placeholder="Type here" class="input input-ghost ml-auto mr-auto relative block text-center block mb-4" style=""/> -->
        <button on:click={enviarWhats} class="py-2 px-4 xl:px-10 border border-[#183A5D] text-[#183A5D] rounded-xl font-bold transition-all ml-auto mr-auto block" style="">ENVIAR</button>
    </form>
    {:else}
    <p class="ml-auto mr-auto">Sem produtos no carrinho</p>
      {/if}
      
   
    </ul>

  </div>
</div>
<slot></slot>

<Footer/>


<style>
  button:hover{
background-color: #183A5D;
color:white;
border-color: #183A5D;
}
</style>