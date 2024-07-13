<script lang="ts">
  import { onMount } from 'svelte';
  import type { DestBanner } from '@prisma/client';
  import { goto } from '$app/navigation';
  
    let banner:DestBanner; 
    let token: string;
    let filePic:any;


    onMount(async () => {
      token = localStorage.getItem("token");

const resToken = await fetch("/api/tokenAuth", {
      method: "POST",
      headers: { "Content-Type": "application/json",
      'Authorization' : `Bearer ${token}`

       },

    });

if(resToken.status == 401){
  goto("/login");
}
    
    const res = await fetch(`/api/destBanner/getOne/?id=1`);
    const data = await res.json();
    banner = data.banner;

  });


  async function editBanner(event: any) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id", banner.id);
    formData.append("picture", filePic);
    formData.append("title", banner.title);

    const res = await fetch("/api/destBanner/update", {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      banner = data.banner;

      // const imgElement = document.getElementById(namePath);
      // imgElement.src = updatedProduct.namePath;
      console.log(banner);

      // Adicione a lógica para atualizar a lista de produtos ou feedback ao usuário
    } else {
      console.error("Failed to update banner");
    }
  }

  function handleFileChange(event:any) {
    const input = event.target as HTMLInputElement;
    console.log(input);
    filePic = input.files[0];
  }
</script>

<div>
    {#if banner}
    <div class="text-center ml-auto mr-auto pt-8 w-3/5">

        <h3 class="font-bold text-3xl mb-10">Editar Banner</h3>
        <form class="w-fit flex flex-col ml-auto mr-auto" on:submit={editBanner}>
          <input
            type="file"
            on:change={handleFileChange}
            class="file-input file-input-bordered file-input-sm w-full max-w-xs"
          />
          <input
          type="text"
          bind:value={banner.title}
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