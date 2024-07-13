<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import type { Product } from '@prisma/client';
  import { goto } from '$app/navigation';
  
    let product:Product; 
    let token: string;
    const removeImgArr:number[] = [];
    const newImgArr:File[] = [];
    let removeArrId:number;
    let namePath:string;
    let categoryList:any[] = [];
    let subCategoryList:any[] = [];

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
    const res = await fetch(`/api/products/getOne/?id=${id}`);
    const data = await res.json();
    product = data.product;

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

  });


  async function editProduct(event: any) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id", product.id);
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("tag", product.tag);
    formData.append("size", product.size);
    formData.append("categoryId", product.categoryId.toString());
    formData.append("subCategoryId", product.subCategoryId.toString());
    formData.append("price", product.price.toString());
    //formData.append("picture", product.picture);

    newImgArr.forEach((file) => {
        formData.append("newPicture", file);
    });

    removeImgArr.forEach((file) => {
        formData.append("removePicture", file.toString());
    });

    const res = await fetch("/api/products/update", {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      product = data.product;
      newImgArr.splice(0, newImgArr.length);
      removeImgArr.splice(0, removeImgArr.length);
      // const imgElement = document.getElementById(namePath);
      // imgElement.src = updatedProduct.namePath;
      console.log(product);

      // Adicione a lógica para atualizar a lista de produtos ou feedback ao usuário
    } else {
      console.error("Failed to create product");
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


            for(const p of product.pictures){
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
    {#if product}
    <div class="text-center ml-auto mr-auto pt-8 w-3/5">

        <h3 class="font-bold text-3xl mb-10">Editar Produto</h3>
        <div class="flex gap-4 imgsEdit">
          {#each product.pictures as pic (pic.id)}
          <img id="{pic.namePath}" src="{pic.namePath}" data-filename="{pic.namePath}" class="transition-all w-24 h-auto cursor-pointer" on:click={() => {selectImage(pic.id, pic.namePath)}}/>
          {/each}
        </div>
        <div class="ml-auto w-1/2 mr-auto">

        <input type="file" id="fileInput" on:change={changeImage} class="hidden">

        <form class="flex ml-auto w-full justify-center flex-wrap gap-4" on:submit={editProduct}>
        
          <input
            type="text"
            bind:value={product.name}
            placeholder="Nome"
            class="input input-bordered w-[48%] max-w-xs mt-4"
          />
          <input
            type="number"
            bind:value={product.price}
            placeholder="Preço"
            step="0.01"
            class="input input-bordered w-[48%] max-w-xs mt-4"
          />
          <select bind:value={product.categoryId} class="select select-bordered w-[48%] max-w-xs mt-4">
            <option disabled selected value="{0}">Categorias</option>
            {#each categoryList as c (c.id)}
              <option value="{c.id}">{c.name}</option>
            {/each}
          </select>

          <select bind:value={product.subCategoryId} class="select select-bordered w-[48%] max-w-xs mt-4">
            <option disabled selected value="{0}">Sub Categorias</option>
            {#each subCategoryList as c (c.id)}
              <option value="{c.id}">{c.name}</option>
            {/each}
          </select>

          <input
            type="text"
            bind:value={product.description}
            placeholder="Description"
            class="input input-bordered w-[48%] max-w-xs mt-4"
          />
          <input
          type="text"
          bind:value={product.size}
          placeholder="size"
          class="input input-bordered w-[48%] max-w-xs mt-4"
        />
        <input
        type="text"
        bind:value={product.tag}
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
  .imgsEdit img:hover{
    transform: scale(1.1);
  }
</style>