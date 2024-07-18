<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import type { Product, Sizes } from '@prisma/client';
  import { goto } from '$app/navigation';
  
    let product:Product; 
    let token: string;
    const removeImgArr:number[] = [];
    const newImgArr:File[] = [];
    let removeArrId:number;
    let namePath:string;
    let categoryList:any[] = [];
    let subCategoryList:any[] = [];
    let sizeListCreate:{id:number, size:string}[] = [];
    let sizeListDelete:{id:number, size:string}[] = [];
    let sizeList:Sizes[] = [];
    let sizeId:number = 0;



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

    const resSize = await fetch("/api/size/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const dataSize = await resSize.json();
    sizeList = dataSize.sizes;
    sizeListCreate = product.size;

    console.log(sizeListCreate);


  });


  async function editProduct(event: any) {

    const buttonInsert = document.getElementById("insertButton");
    buttonInsert.disabled = true;
    event.preventDefault();
    const formData = new FormData();
    formData.append("id", product.id);
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("tag", product.tag);
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

    sizeListCreate.forEach((s) =>{
      formData.append("size", s.id);
    });

    sizeListDelete.forEach((s) =>{
      formData.append("sizeRemove", s.id)
    });

    const res = await fetch("/api/products/update", {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    buttonInsert.disabled = false;

    if (res.ok) {
      const data = await res.json();
      product = data.product;
      newImgArr.splice(0, newImgArr.length);
      removeImgArr.splice(0, removeImgArr.length);
      const imgContainer = document.getElementById("imgContainerNew");
      const divsToRemove = imgContainer.querySelectorAll(':scope > div');
        
        // Itera sobre a NodeList e remove cada div
        divsToRemove.forEach(div => {
            imgContainer.removeChild(div);
        });
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

  function handleFileChange(event:any) {
    const input = event.target as HTMLInputElement;
    console.log(input);
    // if (input.files && input.files.length > 0) {
    // for (const p of input.files) {
    //     picturesList.push(p);
    //     console.log(picturesList);

    // }
    // }

    const newFile = event.target.files[0];

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

    const imgContainer = document.getElementById("imgContainerNew");
    const imgElement = document.createElement('img');
    const divElement = document.createElement('div');
    const svgRemove = document.getElementById('svgRemove');

    divElement.style.width = "fit-content";


    // for (let index = 0; index < newImgArr.length; index++) {
    //   const element = newImgArr[index];

    //   if(element.name == imgElement?.getAttribute('data-filename')){
    //     newImgArr.splice(index, 1);
    //   }
      
    // }

    // imgElement?.setAttribute('data-filename', newFile.name);

        const reader = new FileReader();

        reader.onload = function(e) {
            // Substitui a imagem existente pela nova imagem
            //const src = imgElement.src;
            //const fileName = src.split('/').pop(); // Extrai o nome do arquivo do src


            // const index = newImgArr.indexOf(fileName);
            // if(index > -1){
            //   newImgArr.splice(index, 1);
            // }

            imgElement.src = e.target.result;
            imgElement.alt = "Imagem Exemplo";
            imgElement.width = 100;
            imgElement.height = 120;
            imgElement.setAttribute('data-filename', "img#"+newFile.name);
            imgElement.id = newFile.name;

            const clone = svgRemove?.cloneNode(true);
            console.log(clone);

            clone.removeAttribute('onclick')
            clone.addEventListener('click', () => handleFileRemove(newFile.name, "imgContainerNew"));
//            imgElement.classList.add("img#"+newFile.name);
            divElement.appendChild(imgElement);
            divElement?.appendChild(clone);




            imgContainer?.appendChild(divElement);      


            // for(const p of product.pictures){
            //   if(p.id == removeArrId){
            //     p.namePath = e.target.result;
            //   }
            // }

            // Limpa o campo de entrada de arquivo
            document.getElementById('fileInput').value = '';
        };

        reader.readAsDataURL(newFile);
    
    console.log(newImgArr);
    console.log(removeImgArr);
  }

  function handleFileRemove(event:any, nameId:any){
    // const imgContainerAll = document.getElementById(nameId);
    const imgElement = document.querySelector(`[data-filename="img#${event}"]`);
    const imgContainer = imgElement?.parentElement;

    if(nameId == "imgDataBase"){
      if(!removeImgArr.includes(removeArrId)){
         removeImgArr.push(removeArrId);
       }
    }

   for (let index = 0; index < newImgArr.length; index++) {

      const element = newImgArr[index];

      if(element.name == imgElement?.getAttribute('data-filename')){
        newImgArr.splice(index, 1);
      }
      
    }

    imgElement?.setAttribute('data-filename', event);
    imgContainer?.remove();
  }

  function handleSizeChange(event:any){
    console.log(sizeListCreate);


    sizeList.forEach(element => {
        if(element.id == event){
          console.log(element.id);
          const verifyItem = sizeListCreate.find(item => item.id == event);

          if(verifyItem == undefined){
            sizeListCreate = [...sizeListCreate, element];
          }
        }
    });

    //sizeListCreate = sizeListCreate;
    
    // sizesList = sizesList.filter(item => item.id !== event);
    
  }

  function handleRemoveChange(event:any){
    console.log(sizeListCreate);

    sizeListCreate.forEach(element => {
        if(element.id == event){
          console.log(element.id);
          const index = sizeListCreate.findIndex(item => item.id == event);

          if(index != -1){
            sizeListCreate.splice(index, 1);
            sizeListCreate = sizeListCreate
          }
          
            const indexDelete = sizeListDelete.findIndex(item => item.id == event);
          if(indexDelete == -1){
            sizeListDelete.push(event);
          }

          console.log(sizeListCreate);
          console.log(sizeListDelete);
        }
    });
  }
</script>

<div>
    {#if product}
    <div class="text-center ml-auto mr-auto pt-8 w-3/5">

        <h3 class="font-bold text-3xl mb-10">Editar Produto</h3>
        <div class="flex items-center">
        <div id="imgDataBase" class="flex gap-4 imgsEdit">
          {#each product.pictures as pic (pic.id)}
          <div>
          <img id="{pic.namePath}" src="{pic.namePath}" data-filename="{pic.namePath}" class="img#{pic.namePath} transition-all w-24 h-28"/>
          <div id="svgRemove" class="cursor-pointer w-fit inline-block mr-2" on:click={() => {removeArrId = pic.id; handleFileRemove(pic.namePath, "imgDataBase")}}>     
            <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 hover:scale-110"
            viewBox="0 0 448 512"
            ><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
              d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
            /></svg>
          </div>
          <div class="cursor-pointer w-fit inline-block ml-2" on:click={() => {selectImage(pic.id, pic.namePath)}}>       
            <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 hover:scale-110"
            viewBox="0 0 512 512"
            ><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
              d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
            /></svg>
          </div>
        </div>
          {/each}
        </div>
        <label for="newInputile" class="cursor-pointer ml-4 hover:scale-110"><svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg></label>
        <input name="newInputile" class="hidden" type="file" id="newInputile" on:change={handleFileChange}/>
      </div>
        <div id="imgContainerNew" class="flex mt-8">
 
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

          <select bind:value={sizeId} on:change={() => {handleSizeChange(sizeId)}} class="select select-bordered w-full mt-4">
            <option disabled selected value={0}>Sizes</option>
            {#each sizeList as c (c.id)}
            <option value="{c.id}">
              {c.size}
            </option>
          {/each}
          </select>

          <div class="w-full">
            {#each sizeListCreate as s(s.id)}
            <div class="badge badge-info gap-2">
              <svg
                on:click={() => {handleRemoveChange(s.id)}}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-4 w-4 stroke-current cursor-pointer">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              {s.size}
            </div>
            {/each}
          </div>

          <input
            type="text"
            bind:value={product.description}
            placeholder="Description"
            class="input input-bordered w-[48%] max-w-xs mt-4"
          />
        <input
        type="text"
        bind:value={product.tag}
        placeholder="tag"
        class="input input-bordered w-[48%] max-w-xs mt-4"
      />
          <button id="insertButton" class="btn btn-success w-full mt-8" type="submit"
            >Cadastrar</button
          >
        </form>
      </div>
      </div>
 {/if}
</div>

<style>

</style>