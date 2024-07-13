<script lang="ts">
    import type { CardDest} from "@prisma/client";
    import type { Decimal } from "@prisma/client/runtime/library";
    import { onMount } from "svelte";
  
      export let message:string;
      export let metodoModal;
      export let card:CardDest;
      export let handleFileChange;
      let token: string;
      let categoryList:any[] = []
  
      
    onMount(async () => {
      //       token = localStorage.getItem("token");
  
      //   const resToken = await fetch("api/tokenAuth", {
      //         method: "POST",
      //         headers: { "Content-Type": "application/json",
      //         'Authorization' : `Bearer ${token}`
  
      //          },
  
      //       });
  
      //   if(resToken.status == 401){
      //     goto("/login");
      //   }
  
      // Carregar produtos quando a página é carregada
      const res = await fetch("api/cardDest/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      categoryList = data.categories;
  });
  
  </script>
  
  <dialog id="my_modal_1" class="modal">
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
        <h3 class="font-bold text-3xl mb-10">{message} Card</h3>
        <form class="w-fit" on:submit={metodoModal}>
          <input
            type="file"
            on:change={handleFileChange}
            class="file-input file-input-bordered file-input-sm w-full max-w-xs"
          />
          <input
          type="text"
          bind:value={card.title}
          placeholder="Título"
          class="input input-bordered w-full max-w-xs mt-4"
        />
          <input
            type="text"
            bind:value={card.subTitle}
            placeholder="Sub título"
            class="input input-bordered w-full max-w-xs mt-4"
          />
    

          <button class="btn btn-success w-full max-w-xs mt-8" type="submit"
            >Cadastrar</button
          >
        </form>
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button id="closeModal" class="btn btn-danger bg-red-500 w-full max-w-xs mt-8"
            >Cancelar</button
          >
        </form>
      </div>
    </dialog>
  