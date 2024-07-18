<script lang="ts">
  import { goto } from "$app/navigation";
  import FormModal from "$components/FormModal.svelte";
  import ModalConfirm from "$components/ModalConfirm.svelte";
  import type { Novidades, Pictures, Sizes } from "@prisma/client";
  import { Decimal } from 'decimal.js';
  import { onMount } from "svelte";

  let novidadesList: Novidades[] = [];
  let metodoModal:any = null;
  let message: String = "";
  let token: string;

  let novidade:Novidades = {categoryId:0, description:"", id:0, name:"", price:new Decimal(0.0), tag:"", subCategoryId:0};
  let picture:Pictures = {id:0, namePath:"", destaquesId:null, maisVendidosId:null, novidadesId:null, productId:null}
  let picturesList:any[] = [];
  let sizeListCreate:{id:number, size:string}[] = [];
  let sizesList:Sizes[] = [];
  
  //Product Variable Declaration
//   let id: number | null = null;
//   let categoryId: number | null = null;
//   let name = "";
//   let description = "";
//   let size = "";
//   let tag = "";
//   let price: any;
//   let picture: any[] = [];

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

    // Carregar produtos quando a página é carregada
    const res = await fetch("api/novidades/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    novidadesList = data.novidades;
    console.log(novidadesList);
});


  async function createNovidades(event: any) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", novidade.name);
    formData.append("description", novidade.description);
    formData.append("tag", novidade.tag);
    formData.append("categoryId", novidade.categoryId.toString());
    formData.append("price", novidade.price.toString());
    console.log(novidade.categoryId);
 
    picturesList.forEach((file) => {
        formData.append("picture", file);
    });

    sizeListCreate.forEach((s) =>{
      formData.append("size", s.id);
    });

    console.log(picture);
    const res = await fetch("/api/novidades/create", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const newNovidade = await res.json();
      console.log(newNovidade);
      novidadesList = [...novidadesList, newNovidade.novidade];

      novidade.name = "";
      novidade.description = "";
      novidade.tag = "";
      novidade.categoryId = 0;
      novidade.subCategoryId = 0;
      novidade.price = new Decimal(0.0);
      sizeListCreate = [];

      document.getElementById("closeModal")?.click();

      // Adicione a lógica para atualizar a lista de produtos ou feedback ao usuário
    } else {
      console.error("Failed to create novidade");
    }
  }

  
  async function deleteNovidade() {
    const res = await fetch("api/novidades/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id:novidade.id }),
    });

    if (res.ok) {
      console.log("aaa");
      novidadesList = novidadesList.filter((p) => p.id !== novidade.id);
    }
  }


  function handleFileChange(event:any) {
    const input = event.target as HTMLInputElement;
    console.log(input);
    if (input.files && input.files.length > 0) {
    for (const p of input.files) {
        picturesList.push(p);
        console.log(picturesList);

    }
    }
  }

  function openModalConfirm(idParam:number){
    novidade.id = idParam;
    document.getElementById("my_modal_confirm")?.showModal();
  }

  function editNovidade(idParam:number){
            novidade.id = idParam;
            goto(`/novidadesAdmin/${novidade.id}`);

  }

  function openCreateModal(){
        document.getElementById("my_modal_1")?.showModal();
        message = "Novo";
        metodoModal = createNovidades;

  }
</script>

<div class="overflow-y-scroll h-screen">
  <div class="flex relative">

    <button
      class="btn btn-outline btn-accent ml-auto mr-8 mt-8"
      on:click={openCreateModal}>Adicionar</button
    >
  </div>

  <FormModal message="Novo" metodoModal={metodoModal} sizesCreate={sizeListCreate} sizeList={sizesList} handleFileChange={handleFileChange} product={novidade}/>
 
  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th> </th>
          <th>Fotos</th>
          <th>Nome</th>
          <th>Preço</th>
          <th>Descrição</th>
          <th>Tamanho</th>
          <th>Tag</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        {#if novidadesList}
          {#each novidadesList as p (p.id)}
      

            <tr>
              <th>
                <label>
                  <input type="checkbox" class="checkbox" />
                </label>
              </th>

              <td>
                <div class="flex items-center gap-3">
                  <div class="avatar">
                    <div class="mask mask-squircle w-12 h-12">
                        {#if p.pictures[0]}
                        <img
                        src={p.pictures[0].namePath}
                        alt="Avatar Tailwind CSS Component"
                      />
                        {/if}
                   
                    </div>
                  </div>
                </div>
              </td>
              <td>
                {p.name}
                <br />
              </td>
              <td>{p.price}</td>
              <th>
               {p.description}
              </th>
              <th>
                {#each p.size as s(s.id)}
                { s.size } - 

                {/each}
               </th>
               <th>
                {p.tag}
               </th>
              <!--Edit Button-->
              <td
                ><button
                  class="btn btn-square"
                  on:click={() => {
                    editNovidade(p.id)
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    viewBox="0 0 512 512"
                    ><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
                      d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
                    /></svg
                  >
                </button></td
              >

              <!--Delete Button-->
              <td>
                <button
                  class="btn btn-square btn-error"
                  on:click={() => openModalConfirm(p.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    viewBox="0 0 448 512"
                    ><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
                      d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                    /></svg
                  >
                </button></td
              >
            </tr>
          {/each}
        {/if}

        <!-- row 2 -->

        <!-- foot -->
      </tbody><tfoot>
        <tr>
          <th></th>
          <th>Fotos</th>
          <th>Nome</th>
          <th>Preço</th>
          <th>Descrição</th>
          <th>Tamanho</th>
          <th>Tag</th>
          <th></th>
          <th></th>
        </tr>
      </tfoot>
    </table>
  </div>

  <!--Delete Modal-->
  <ModalConfirm message="Excluir" metodo={deleteNovidade} />
</div>
