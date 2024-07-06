<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import type { Product } from '@prisma/client';
  
    let product:Product;
    let token: string;


    onMount(async () => {
    const id = get(page).params.id;
    const res = await fetch(`/api/products/getOne/?id=${id}`);
    const data = await res.json();
    product = data.product;

    console.log(product.pictures);
  });


  async function editProduct(event: any) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("tag", product.tag);
    formData.append("size", product.size);
    formData.append("categoryId", product.category.id);
    formData.append("price", product.price.toString());
    formData.append("picture", product.picture);

    console.log(product.pictures);

    const res = await fetch("/api/products/update", {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const updatedProduct = await res.json();

      // Adicione a lógica para atualizar a lista de produtos ou feedback ao usuário
    } else {
      console.error("Failed to create product");
    }
  }

</script>

<div>
    {#if product}
    <div class="modal-box text-center pt-8">
        <div class="modal-action absolute block top-0 right-5">
          <form method="dialog">
            <button class="btn btn-circle btn-outline min-h-0 h-6 w-6">
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
        <h3 class="font-bold text-3xl mb-10">Editar Produto</h3>
        <form class="w-fit" on:submit={editProduct}>
          {#each product.pictures as pic (pic.id)}
          <input
          type="file"
          class="file-input file-input-bordered file-input-sm w-full max-w-xs"
          value={pic.namePath}
        />
          {/each}
        
          <input
            type="text"
            bind:value={product.name}
            placeholder="Nome"
            class="input input-bordered w-full max-w-xs mt-4"
          />
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
 {/if}
</div>