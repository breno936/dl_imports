<script lang="ts">
  import type { Product } from "@prisma/client";
  import type { Decimal } from "@prisma/client/runtime/library";
  import { onMount } from "svelte";

    export let message:string;
    export let metodoModal;
    export let product:Product;
    export let handleFileChange;
    let token: string;
    let categoryList:any[] = [];
    let subCategoryList:any[] = [];

    
  onMount(async () => {
    //       token = localStorage.getItem("token");

    //   const resToken = await fetch("api/tokenAuth", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json",
    //         'Authorization' : `Bearer ${token}`

    //          },

    //       });

    //   if(resToken.status == 401){
    //     goto("/login");
    //   }

    // Carregar produtos quando a página é carregada
    const res = await fetch("api/category/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    categoryList = data.categories;

        // Carregar produtos quando a página é carregada
    const resS = await fetch("api/subCategory/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const dataS = await resS.json();
    subCategoryList = dataS.subCategories;
    console.log(subCategoryList);

});

</script>

<dialog id="my_modal_1" class="modal">
    <div class="modal-box text-center pt-8">
      <div class="modal-action absolute block top-0 right-5">
        <form method="dialog">
          <button id="closeModal" class="btn btn-circle btn-outline min-h-0 h-6 w-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              /></svg
            >
          </button>
        </form>
      </div>
      <h3 class="font-bold text-3xl mb-10">{message} Produto</h3>
      <form class="w-fit" on:submit={metodoModal}>
        <input
          type="file"
          on:change={handleFileChange}
          class="file-input file-input-bordered file-input-sm w-full max-w-xs"
          multiple
        />
        <input
          type="text"
          bind:value={product.name}
          placeholder="Nome"
          class="input input-bordered w-full max-w-xs mt-4"
        />
     

        <select bind:value={product.categoryId} class="select select-bordered w-full max-w-xs mt-4">
          <option disabled selected value={0}>Categorias</option>
          {#each categoryList as c (c.id)}
          <option value="{c.id}">
            {c.name}
          </option>
        {/each}
        </select>
        <select bind:value={product.subCategoryId} class="select select-bordered w-full max-w-xs mt-4">
          <option disabled selected value={0}>Sub Categorias</option>
          {#each subCategoryList as c (c.id)}
          <option value="{c.id}">
            {c.name}
          </option>
        {/each}
        </select>
  
        <input
          type="number"
          bind:value={product.price}
          placeholder="Preço"
          step="0.01"
          class="input input-bordered w-full max-w-xs mt-4"
        />
        <input
          type="text"
          bind:value={product.description}
          placeholder="Description"
          class="input input-bordered w-full max-w-xs mt-4"
        />
        <input
        type="text"
        bind:value={product.size}
        placeholder="size"
        class="input input-bordered w-full max-w-xs mt-4"
      />
      <input
      type="text"
      bind:value={product.tag}
      placeholder="tag"
      class="input input-bordered w-full max-w-xs mt-4"
    />
        <button class="btn btn-success w-full max-w-xs mt-8" type="submit"
          >Cadastrar</button
        >
      </form>
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn btn-danger bg-red-500 w-full max-w-xs mt-8"
          >Cancelar</button
        >
      </form>
    </div>
  </dialog>
