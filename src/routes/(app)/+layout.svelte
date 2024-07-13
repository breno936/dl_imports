<script lang="ts">
  import Footer from "$components/Footer.svelte";
import NavBar from "$lib/components/NavBar.svelte";

import { cartProducts } from "../../store";
    // let clientNumber:string;
    let linkMsg:string;

    function enviarWhats(){
        linkMsg = "https://wa.me//5519988949024?text=Olá%20Tenho%20interesse%20em%20comprar%20esses%20produtos";
        $cartProducts.forEach(element => {
            linkMsg = linkMsg+`%0A${element.name} ${element.quantity}X`;
        });

        window.open(linkMsg, "_blank");

        $cartProducts = [];
        localStorage.removeItem("cartProducts");
    }

    function deleteProduct(productId: number) {
    cartProducts.update(items => items.filter(item => item.id !== productId));

    localStorage.setItem("cartProducts", JSON.stringify($cartProducts));
  }
</script>

<NavBar/>

<div class="drawer drawer-end z-50">
  <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <!-- Page content here -->
  </div> 
  <div class="drawer-side">
    <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      {#each $cartProducts as product (product.id) }
      <li class="flex flex-row items-center"><a class="font-medium w-fit"><img class="rounded-2xl w-12 h-12" src="{product.pictures[0].namePath}"/>{product.name}<span class="ml-1 font-normal">{product.quantity}<span class="text-[10px]">X</span></span></a><a class="text-center h-fit w-fit" on:click={() => deleteProduct(product.id)}>X</a></li>
      {/each}
      <form class="text-center w-full absolute bottom-6">
      <!-- <input on:input={handleInput} bind:value={clientNumber} type="text" placeholder="Type here" class="input input-ghost ml-auto mr-auto relative block text-center block mb-4" style=""/> -->
      <button on:click={enviarWhats} class="py-2 px-4 xl:px-10 border border-[#183A5D] text-[#183A5D] rounded-xl font-bold transition-all ml-auto mr-auto block" style="">ENVIAR</button>
  </form>
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