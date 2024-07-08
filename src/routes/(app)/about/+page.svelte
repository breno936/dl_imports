<script lang="ts">
  import { onMount } from "svelte";


</script>

<div class="divTopo"></div>

<div class="w-full text-center mt-12 text-[60px] titulo animate-once relative overflow-hidden">
    <h1 class="ml-auto mr-auto w-fit">SOBRE A DL <span class="text-[#FFBF00]">IMPORTS</span></h1>
    <h2 class="text-[18px]">Quem somos?</h2>
</div>

<div class="flex justify-center flex-col lg:flex-row items-center mt-16">
<div class="w-4/5 lg:w-2/5 px-0 lg:px-10 text-center lg:text-left">
    <h1 class="text-[32px]" style="font-family: Roboto-Bold;">Fundador</h1><br/>
    Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker.</div>
<div class="w-4/5 lg:w-2/5 mt-10 lg:mt-0 bg-black overflow-hidden rounded-2xl h-[500px]">
<img src="/img/WhatsApp Image 2024-07-02 at 13.37.37.jpeg" class="w-full h-full"/>
</div>
</div>

<div class="text-center mt-32 mb-20">
    <h1 class="text-[32px]" style="font-family: Roboto-Bold;">Nossos Pilares</h1>

    <div class="bg-base-200 collapse collapse-arrow w-4/5 lg:w-3/5 ml-auto mr-auto mt-10">
        <input type="checkbox" class="peer" />
        <div
          class="text-xl text-left collapse-title bg-black text-white peer-checked:bg-[#FFBF00] peer-checked:text-white">
            Objetivo
        </div>
        <div
          class="collapse-content bg-primary text-white peer-checked:bg-[#FFBF00] peer-checked:text-white">
          <p>passar confiança e a maior qualidade possível de cada produto aos nossos clientes.</p>
        </div>
      </div>

      <div class="bg-base-200 collapse collapse-arrow w-4/5 lg:w-3/5 ml-auto mr-auto mt-10">
        <input type="checkbox" class="peer" />
        <div
          class="text-xl text-left collapse-title bg-black text-white peer-checked:bg-[#FFBF00] peer-checked:text-white">
            Visão
        </div>
        <div
          class="collapse-content bg-primary text-white peer-checked:bg-[#FFBF00] peer-checked:text-white">
          <p>Sempre inovar trazendo as últimas novidades do mercado</p>
        </div>
      </div>

      <div class="bg-base-200 collapse collapse-arrow w-4/5 lg:w-3/5 ml-auto mr-auto mt-10">
        <input type="checkbox" class="peer" />
        <div
          class="text-xl text-left collapse-title bg-black text-white peer-checked:bg-[#FFBF00] peer-checked:text-white">
            Valores
        </div>
        <div
          class="collapse-content bg-primary text-white peer-checked:bg-[#FFBF00] peer-checked:text-white">
          <p>Somos uma empresa que entregamos o que prometemos, tanto na qualidade quanto no atendimento</p>
        </div>
      </div>
</div>

<style>
     .divTopo{
        height: 12.5rem;
    }
    h1{
        font-family: Roboto-Black;
    }
    .titulo h1::before {
  content: '';
  position: absolute;
  width: 50px;
  height: 400px;
  background-color: rgba(255, 255, 255, 1);
  margin-left: -100px;
  margin-top: -350px;
  transform: rotate(50deg);
}

.animate-once h1::before {
  animation-name: animateBefore;
  animation-duration: 0.8s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
}

/* .titulo:hover::before,
.titulo h1:hover::before {
  animation-play-state: paused;
} */

    @keyframes animateBefore{
        to{
            margin-left: 50%;
            margin-top:10%;
            opacity: 0;
            visibility: hidden;
        }
    }
</style>