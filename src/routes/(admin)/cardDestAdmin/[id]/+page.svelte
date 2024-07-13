<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import type { CardDest } from '@prisma/client';
  import { split } from 'postcss/lib/list';
  import { goto } from '$app/navigation';
  
    let cardDest:CardDest; 
    let token: string;
    const removeImgArr:number[] = [];
    const newImgArr:File[] = [];
    let removeArrId:number;
    let namePath:string;
    let categoryList:any[] = [];
    let filePic:any;


    onMount(async () => {
      token = localStorage.getItem("token");

const resToken = await fetch("/api/tokenAuth", {
      method: "POST",
      headers: { "Content-Type": "application/json",
      'Authorization' : `Bearer ${token}`

       },

    });

    console.log(resToken);

if(resToken.status == 401){
  goto("/login");
}
    const id = get(page).params.id;
    const res = await fetch(`/api/cardDest/getOne/?id=${id}`);
    const data = await res.json();
    cardDest = data.card;

  });


  async function editCard(event: any) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id", cardDest.id);
    formData.append("picture", filePic);
    formData.append("subTitle", cardDest.subTitle);
    formData.append("title", cardDest.title);

    const res = await fetch("/api/cardDest/update", {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      cardDest = data.card;

      // const imgElement = document.getElementById(namePath);
      // imgElement.src = updatedProduct.namePath;
      console.log(cardDest);

      // Adicione a lógica para atualizar a lista de produtos ou feedback ao usuário
    } else {
      console.error("Failed to update card");
    }
  }

  function handleFileChange(event:any) {
    const input = event.target as HTMLInputElement;
    console.log(input);
    filePic = input.files[0];
  }
</script>

<div>
    {#if cardDest}
    <div class="text-center ml-auto mr-auto pt-8 w-3/5">

        <h3 class="font-bold text-3xl mb-10">Editar Card</h3>
        <form class="w-fit flex flex-col ml-auto mr-auto" on:submit={editCard}>
          <input
            type="file"
            on:change={handleFileChange}
            class="file-input file-input-bordered file-input-sm w-full max-w-xs"
          />
          <input
            type="text"
            bind:value={cardDest.subTitle}
            placeholder="Sub título"
            class="input input-bordered w-full max-w-xs mt-4"
          />
          <input
          type="text"
          bind:value={cardDest.title}
          placeholder="Título"
          class="input input-bordered w-full max-w-xs mt-4"
        />

          <button class="btn btn-success w-full max-w-xs mt-8" type="submit"
            >Cadastrar</button
          >
        </form>
      </div>
 {/if}
</div>