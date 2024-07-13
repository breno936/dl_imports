<script lang="ts">
  import { goto } from "$app/navigation";
  import FormCardDest from "$components/FormCardDest.svelte";
  import FormModal from "$components/FormModal.svelte";
  import FormSlide from "$components/FormSlide.svelte";
  import ModalConfirm from "$components/ModalConfirm.svelte";
  import type { CardDest, Pictures, Product, SlideHome } from "@prisma/client";
  import { Decimal } from 'decimal.js';
  import { onMount } from "svelte";

  let cardList: CardDest[] = [];
  let metodoModal:any = null;
  let message: String = "";
  let token: string;

  let cardDest:CardDest = {id:0, picture:"", subTitle:"",title:""};
  let filePic:any;
  
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

    // Carregar produtos quando a página é carregada
    const res = await fetch("api/cardDest/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    cardList = data.cards;
    console.log(cardList);
});


  async function createCard(event: any) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("picture", filePic);
    formData.append("subTitle", cardDest.subTitle);
    formData.append("title", cardDest.title);


    console.log(filePic);
    const res = await fetch("/api/cardDest/create", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const newCard = await res.json();
      console.log(newCard);
      cardList = [...cardList, newCard.newCard];
      filePic = null;
      cardDest.subTitle = "";
      cardDest.title = "";
      // Adicione a lógica para atualizar a lista de produtos ou feedback ao usuário
    } else {
      console.error("Failed to create card");
    }
  }

  
  async function deleteCard() {
    const res = await fetch("api/cardDest/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id:cardDest.id }),
    });

    if (res.ok) {
      console.log("aaa");
      cardList = cardList.filter((p) => p.id !== cardDest.id);
    }
  }

  function handleFileChange(event:any) {
    const input = event.target as HTMLInputElement;
    console.log(input);
    filePic = input.files[0];
  }

  function openModalConfirm(idParam:number){
    cardDest.id = idParam;
    document.getElementById("my_modal_confirm")?.showModal();
  }

  function editCard(idParam:number){
            cardDest.id = idParam;
            goto(`/cardDestAdmin/${cardDest.id}`);

  }

  function openCreateModal(){
        document.getElementById("my_modal_1")?.showModal();
        message = "Novo";
        metodoModal = createCard;

  }
</script>

<div class="overflow-y-scroll h-screen">
  <div class="flex relative">

    <button
      class="btn btn-outline btn-accent ml-auto mr-8 mt-8"
      on:click={openCreateModal}>Adicionar</button
    >
  </div>

  <FormCardDest message="Novo" metodoModal={metodoModal} handleFileChange={handleFileChange} card={cardDest}/>
 
  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th> </th>
          <th>Foto</th>
          <th>Título</th>
          <th>Sub Título</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        {#if cardList}
          {#each cardList as p (p.id)}
      

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
                        {#if p.picture}
                        <img
                        src={p.picture}
                        alt="Avatar Tailwind CSS Component"
                      />
                        {/if}
                   
                    </div>
                  </div>
                </div>
              </td>
              <td>{p.title}</td>
              <th>
               {p.subTitle}
              </th>

              <!--Edit Button-->
              <td
                ><button
                  class="btn btn-square"
                  on:click={() => {
                    editCard(p.id)
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
          <th>Foto</th>
          <th>Título</th>
          <th>Sub Título</th>
          <th></th>
          <th></th>
        </tr>
      </tfoot>
    </table>
  </div>

  <!--Delete Modal-->
  <ModalConfirm message="Excluir" metodo={deleteCard} />
</div>
