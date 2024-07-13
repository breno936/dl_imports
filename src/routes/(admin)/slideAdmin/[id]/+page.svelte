<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import type { Product, SlideHome } from '@prisma/client';
  import { split } from 'postcss/lib/list';
  
    let slide:SlideHome; 
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

if(resToken.status == 401){
  goto("/login");
}

    const id = get(page).params.id;
    const res = await fetch(`/api/slider/getOne/?id=${id}`);
    const data = await res.json();
    slide = data.slide;

  });


  async function editSlide(event: any) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id", slide.id);
    formData.append("linkButton", slide.linkButton);
    formData.append("picture", filePic);
    formData.append("subTitle", slide.subTitle);
    formData.append("textButton", slide.textButton);
    formData.append("title", slide.title);

    const res = await fetch("/api/slider/update", {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      slide = data.slide;

      // const imgElement = document.getElementById(namePath);
      // imgElement.src = updatedProduct.namePath;
      console.log(slide);

      // Adicione a lógica para atualizar a lista de produtos ou feedback ao usuário
    } else {
      console.error("Failed to update slide");
    }
  }

  function handleFileChange(event:any) {
    const input = event.target as HTMLInputElement;
    console.log(input);
    filePic = input.files[0];
  }
</script>

<div>
    {#if slide}
    <div class="text-center ml-auto mr-auto pt-8 w-3/5">

        <h3 class="font-bold text-3xl mb-10">Editar Slide</h3>
        <form class="w-fit flex flex-col ml-auto mr-auto" on:submit={editSlide}>
          <input
            type="file"
            on:change={handleFileChange}
            class="file-input file-input-bordered file-input-sm w-full max-w-xs"
          />
          <input
            type="text"
            bind:value={slide.linkButton}
            placeholder="Link Botão"
            class="input input-bordered w-full max-w-xs mt-4"
          />
    
          <input
            type="text"
            bind:value={slide.textButton}
            placeholder="Texto Botão"
            class="input input-bordered w-full max-w-xs mt-4"
          />
          <input
            type="text"
            bind:value={slide.subTitle}
            placeholder="Sub título"
            class="input input-bordered w-full max-w-xs mt-4"
          />
          <input
          type="text"
          bind:value={slide.title}
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