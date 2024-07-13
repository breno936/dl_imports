<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import type { MaisVendidos, Product } from '@prisma/client';
  import { goto } from '$app/navigation';
  
    let vendidos:MaisVendidos; 
    let token: string;
    const removeImgArr:number[] = [];
    const newImgArr:File[] = [];
    let removeArrId:number;
    let namePath:string;
    let categoryList:any[] = [];

    onMount(async () => {
      token = localStorage.getItem("token");

const resToken = await fetch("api/tokenAuth", {
      method: "POST",
      headers: { "Content-Type": "application/json",
      'Authorization' : `Bearer ${token}`

       },

    });

if(resToken.status == 401){
  goto("/login");
}

    const id = get(page).params.id;
    const res = await fetch(`/api/maisVendidos/getOne/?id=${id}`);
    const data = await res.json();
    vendidos = data.maisVendidos;

    const resCategory = await fetch("/api/category/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const dataCategory = await resCategory.json();
    categoryList = dataCategory.categories;
    vendidos.categoryId = 0;
    console.log(categoryList);

  });


  async function editVendidos(event: any) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id", vendidos.id);
    formData.append("name", vendidos.name);
    formData.append("description", vendidos.description);
    formData.append("tag", vendidos.tag);
    formData.append("size", vendidos.size);
    formData.append("categoryId", vendidos.categoryId.toString());
    formData.append("price", vendidos.price.toString());

    //formData.append("picture", product.picture);

    newImgArr.forEach((file) => {
        formData.append("newPicture", file);
    });

    removeImgArr.forEach((file) => {
        formData.append("removePicture", file.toString());
    });

    const res = await fetch("/api/maisVendidos/update", {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      vendidos = data.maisVendidos;
      console.log(vendidos);
      newImgArr.splice(0, newImgArr.length);
      removeImgArr.splice(0, removeImgArr.length);
      // Adicione a lógica para atualizar a lista de produtos ou feedback ao usuário
    } else {
      console.error("Failed to create item");
    }
  }

  function selectImage(idImage:number, namePathImage:string){
    document.getElementById('fileInput').click();
    if(idImage){
    removeArrId = idImage;
    }

    if(namePathImage){
    namePath = namePathImage;
    }
  }

  function changeImage(event:any){
    const newFile = event.target.files[0];


    if (newFile) {
      if(!removeImgArr.includes(removeArrId)){
      removeImgArr.push(removeArrId);
    }
    if(newImgArr.length > 0){
    for(const n of newImgArr){
      console.log(n.name, newFile.name);
      if(n.name != newFile.name){
        newImgArr.push(newFile);

      }
    }
     }else{  
    newImgArr.push(newFile);
    }

    const imgElement = document.getElementById(namePath);

    for (let index = 0; index < newImgArr.length; index++) {
      const element = newImgArr[index];

      if(element.name == imgElement?.getAttribute('data-filename')){
        newImgArr.splice(index, 1);
      }
      
    }

    imgElement?.setAttribute('data-filename', newFile.name);

        const reader = new FileReader();

        reader.onload = function(e) {
            // Substitui a imagem existente pela nova imagem
            const src = imgElement.src;
            const fileName = src.split('/').pop(); // Extrai o nome do arquivo do src


            const index = newImgArr.indexOf(fileName);
            if(index > -1){
              newImgArr.splice(index, 1);
            }

            imgElement.src = e.target.result;

            imgElement.src = e.target.result;


            for(const p of vendidos.pictures){
              if(p.id == removeArrId){
                p.namePath = e.target.result;
              }
            }

            // Limpa o campo de entrada de arquivo
            document.getElementById('fileInput').value = '';
        };

        reader.readAsDataURL(newFile);
    }

    console.log(newImgArr);
    console.log(removeImgArr);
  }

</script>

<div>
    {#if vendidos}
    <div class="text-center ml-auto mr-auto pt-8 w-3/5">

        <h3 class="font-bold text-3xl mb-10">Editar Produto</h3>
        <div class="flex gap-4 imgsEdit">
          {#each vendidos.pictures as pic (pic.id)}
          <img id="{pic.namePath}" src="{pic.namePath}" data-filename="{pic.namePath}" class="w-24 h-auto" on:click={() => {selectImage(pic.id, pic.namePath)}}/>
          {/each}
        </div>
        <div class="ml-auto w-1/2 mr-auto">

        <input type="file" id="fileInput" on:change={changeImage} class="hidden">

        <form class="flex ml-auto w-full justify-center flex-wrap gap-4" on:submit={editVendidos}>
        
          <input
            type="text"
            bind:value={vendidos.name}
            placeholder="Nome"
            class="input input-bordered w-[48%] max-w-xs mt-4"
          />
          <input
            type="number"
            bind:value={vendidos.price}
            placeholder="Preço"
            step="0.01"
            class="input input-bordered w-[48%] max-w-xs mt-4"
          />
          <select bind:value={vendidos.categoryId} class="select select-bordered w-[48%] max-w-xs mt-4">
            <option disabled selected value="{0}">Categorias</option>
            {#each categoryList as c (c.id)}
              <option value="{c.id}">{c.name}</option>
            {/each}
          </select>
          <input
            type="text"
            bind:value={vendidos.description}
            placeholder="Description"
            class="input input-bordered w-[48%] max-w-xs mt-4"
          />
          <input
          type="text"
          bind:value={vendidos.size}
          placeholder="size"
          class="input input-bordered w-[48%] max-w-xs mt-4"
        />
        <input
        type="text"
        bind:value={vendidos.tag}
        placeholder="tag"
        class="input input-bordered w-[48%] max-w-xs mt-4"
      />
          <button class="btn btn-success w-full mt-8" type="submit"
            >Cadastrar</button
          >
        </form>
      </div>
      </div>
 {/if}
</div>

<style>
  .imgsEdit{
    transform: scale(1.1);
  }
</style>