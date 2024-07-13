<script lang="ts">
  import { goto } from "$app/navigation";
  import FormModalSubCategory from "$components/FormModalSubCategory.svelte";
  import ModalConfirm from "$components/ModalConfirm.svelte";
  import type { Category, Product, SubCategory } from "@prisma/client";
  import type { Decimal } from "@prisma/client/runtime/library";
  import { onMount } from "svelte";

  let categoryList: SubCategory[] = [];
  let category:SubCategory = {id:0, name:""};
  let message:string;
  let metodoModal:any;

  let token: string;

  //Product Variable Declaration
 


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
    const res = await fetch("api/subCategory/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    categoryList = data.subCategories;
});


  async function createCategory(event: any) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", category.name);

    const res = await fetch("/api/subCategory/create", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const newCategory = await res.json();


      categoryList = [...categoryList, newCategory.subCategory];
      category.name = "";
      document.getElementById("closeModal")?.click();

      // Adicione a lógica para atualizar a lista de produtos ou feedback ao usuário
    } else {
      console.error("Failed to create category");
    }
  }

  
  async function deleteCategory() {
    const res = await fetch("api/subCategory/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id:category.id }),
    });

    if (res.ok) {
      categoryList = categoryList.filter((c) => c.id !== category.id);
    }
  }

  function openModalConfirm(idParam:number){
    category.id = idParam;
    document.getElementById("my_modal_confirm")?.showModal();
  }

  function openEditModal(idParam:number, nameParam:string){
      category.id = idParam;
      category.name = nameParam;
      document.getElementById("my_modal_1")?.showModal();
        message = "Editar";
        metodoModal = editCategory;  
    }

    async function editCategory(event: any) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("id", category.id.toString());
    formData.append("name", category.name);


    const res = await fetch("/api/subCategory/update", {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const updateCategory = await res.json();

      categoryList = categoryList.map(c => c.id === updateCategory.category.id ? updateCategory.category : c);

      // Adicione a lógica para atualizar a lista de produtos ou feedback ao usuário
    } else {
      console.error("Failed to create category");
    }
  }

  function openCreateModal(){
        document.getElementById("my_modal_1")?.showModal();
        message = "Novo";
        metodoModal = createCategory;

  }
</script>

<div class="overflow-y-scroll h-screen">
  <div class="flex relative">

    <button
      class="btn btn-outline btn-accent ml-auto mr-8 mt-8"
      on:click={openCreateModal}>Adicionar</button
    >
  </div>

  <FormModalSubCategory message="{message}" metodoModal={metodoModal} category={category}/>
 
  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th> </th>
          <th>Nome</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        {#if categoryList}
          {#each categoryList as c (c.id)}
      

            <tr>
              <th>
                <label>
                  <input type="checkbox" class="checkbox" />
                </label>
              </th>

              
              <td>
                {c.name}
                <br />
              </td>
              
              <!--Edit Button-->
              <td
                ><button
                  class="btn btn-square"
                  on:click={() => {
                    openEditModal(c.id, c.name)
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
                  on:click={() => openModalConfirm(c.id)}>
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
          <th>Nome</th>
          <th></th>
          <th></th>
        </tr>
      </tfoot>
    </table>
  </div>

  <!--Delete Modal-->
  <ModalConfirm message="Excluir" metodo={deleteCategory} />
</div>
