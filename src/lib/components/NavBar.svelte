<script lang="ts">
  import { onMount } from "svelte";

  var lastScrollTop = 0;
  // element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.

  onMount(() => {

    let closeTimeout;

    document.querySelectorAll("li").forEach((li) => {
      li.addEventListener("mouseenter", () => {
        const submenu = li.querySelector(".subMenu");
        if (submenu) {
          clearTimeout(closeTimeout);
          submenu.style.height = "fit-content";
          submenu.style.opacity = "1";
        }
        console.log(submenu);
      });

      li.addEventListener("mouseleave", () => {
        const submenu = li.querySelector(".subMenu");
        if (submenu) {
          closeTimeout = setTimeout(() => {
            submenu.style.height = "0";
            submenu.style.opacity = "0";
          }, 300); // 1 second delay
        }
      });
    });

    window.addEventListener("resize", function(){
      const screenWidth = window.innerWidth;

      if(screenWidth > 769){
        let nav = document.getElementById("collapse-nav-menu");
        nav.style.display = "none";
        nav.style.height = "0";
      }
    });

    window.addEventListener(
      "scroll",
      function () {
        const screenWidth = window.innerWidth;

        var st = window.pageYOffset || document.documentElement.scrollTop;
        let nav = document.getElementById("collapse-nav-menu");
        nav.style.display = "none";
        nav.style.height = "0";

        if (st > lastScrollTop) {
          // Do scroll down code
          if (st > 120) {
            this.document.getElementById("navTopo").style.opacity = 0;
            this.document.getElementById("navScroll").style.display = "block";
            this.document.getElementById("collapse-nav-menu").style.top = "6rem"

            setTimeout(() => {
              this.document.getElementById("navTopo").style.display = "none";
              this.document.getElementById("navScroll").style.opacity = 1;
            }, 100);
          }
        } else {
          // Do scroll down code
          if (st == 0) {
            this.document.getElementById("collapse-nav-menu").style.top = "12rem"

            this.document.getElementById("navTopo").style.display = "block";

            this.document.getElementById("navScroll").style.opacity = 0;

            setTimeout(() => {
              this.document.getElementById("navTopo").style.opacity = 1;
              this.document.getElementById("navScroll").style.display = "none";
            }, 100);
          }
        }
      
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
      },
      false
    );
  });

  function collapseNav(){
    let nav = document.getElementById("collapse-nav-menu");

    if(nav?.style.height == "0px"){
      nav.style.display = "block";

        setTimeout(() => {
          nav.style.height = "20rem";
        }, 100);
    }else{
      setTimeout(() => {
          nav.style.display = "none";
        }, 100);
      nav.style.height = "0";
    }
  }

    // const subMenu = document.querySelector(".subMenu");
    
</script>

<div class="w-full absolute z-40" id="navTopo">
    <div class="w-full h-10 bg-[#1E1E1E] flex text-white justify-around items-center">
        <div class="hidden md:block w-1/3">
        </div>
        <div class="w-full text-center text-xs">
            ALGUMA FRASE PROMOCIONAL AQUI COM 50% DE DESCONTO
        </div>
        <div class="w-1/3 pr-6 flex justify-end socialIcons">
            <a href="https://wa.me/+5511989098443" target="_blank">
                <img
                  src="/img/whatsapp-pb.png"
                  class="w-5 h-5 mr-3 cursor-pointer transition-all"
                />
                </a>
                <a href="https://www.instagram.com/_dlvendas?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank">
                <img
                  src="/img/white-instagram-icon-instagram-logo-instagram-instagram-icon-white-11553385558pigg7yyye3.webp"
                  class="w-5 h-5 cursor-pointer transition-all"
                />
                </a>
        </div>
    </div>
    <div class="flex">
    <hr class="hr1"/>
    <hr class="hr2"/>
    </div>
    <div class="w-full h-40  transparentNav flex items-center justify-between md:justify-around text-white">

        <div class="w-2/12 pl-10">
            <div class="w-32 h-auto">
                <a href="/">
                 <img src="/img/WhatsApp Image 2024-06-04 at 19.12.24.jpeg" class=" w-full h-full"/>
                </a>
            </div>
        </div>
        <div class="w-8/12 text-center hidden md:block">
<nav>
    <ul class="flex justify-center">
        <li class="mr-6"><a href="/" class="transition-all cursor-pointer">HOME</a></li>
        <li class="mr-6"><a class="transition-all cursor-pointer">PRODUTOS</a>
        <ul class="absolute subMenu top-[100%] px-12 flex flex-col gap-2 -ml-12 py-0 h-0 overflow-hidden">
          <li><a href="/products/6" data-sveltekit-reload class="transition-all cursor-pointer">CAMISAS</a></li>
          <li><a href="/products/5" data-sveltekit-reload class="transition-all cursor-pointer">POLOS</a></li>
          <li><a href="/products/3" data-sveltekit-reload class="transition-all cursor-pointer">CHINELOS</a></li>
          <li><a href="/products/1" data-sveltekit-reload class="transition-all cursor-pointer">TÊNIS</a></li>
          <li><a href="/products/4" data-sveltekit-reload class="transition-all cursor-pointer">BONÉS</a></li>
          <li><a href="/products/2" data-sveltekit-reload class="transition-all cursor-pointer">BLUSAS</a></li>
        </ul>
        </li>
        <li class="mr-6"><a class="transition-all cursor-pointer">AVALIAÇÕES</a></li>
        <li class="mr-6"><a href="/about" class="transition-all cursor-pointer">SOBRE NÓS</a></li>
        <li> <a href="/contact" class="transition-all cursor-pointer">CONTATO</a></li>
    </ul>
</nav>
        </div>
       

        <div class="w-fit md:w-1/12 justify-end text-right flex md:pr-10">
          <div class="blck md:hidden cursor-pointer mr-3" on:click={collapseNav}>
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 17 14">
              <path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
          </div>

          <label for="my-drawer-4" class="drawer-button relative mr-10 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg></label>
        </div>
    </div>
</div>

<div class="fixed w-full z-40 hidden" id="navScroll">
    <div class="w-full h-24  transparentNav flex items-center justify-between md:justify-around text-white">

        <div class="w-2/12 pl-10">
            <div class="w-20 h-auto">
                <a href="/">
                 <img src="/img/WhatsApp Image 2024-06-04 at 19.12.24.jpeg" class=" w-full h-full"/>
                </a>
            </div>
        </div>
        <div class="w-8/12 text-center hidden md:block">
<nav>
    <ul class="flex justify-center">
        <li class="mr-6"><a href="/" class="transition-all cursor-pointer">HOME</a></li>
        <li class="mr-6"><a class="transition-all cursor-pointer">PRODUTOS</a>
          <ul class="absolute subMenu top-[100%] px-12 flex flex-col gap-2 -ml-12 py-0 h-0 overflow-hidden">
          
            <li><a href="/products/6" data-sveltekit-reload class="transition-all cursor-pointer">CAMISAS</a></li>
            <li><a href="/products/5" data-sveltekit-reload class="transition-all cursor-pointer">POLOS</a></li>
            <li><a href="/products/3" data-sveltekit-reload class="transition-all cursor-pointer">CHINELOS</a></li>
            <li><a href="/products/1" data-sveltekit-reload class="transition-all cursor-pointer">TÊNIS</a></li>
            <li><a href="/products/4" data-sveltekit-reload class="transition-all cursor-pointer">BONÉS</a></li>
            <li><a href="/products/2" data-sveltekit-reload class="transition-all cursor-pointer">BLUSAS</a></li>
          </ul></li>
        <li class="mr-6"><a class="transition-all cursor-pointer">AVALIAÇÕES</a></li>
        <li class="mr-6"><a href="/about" class="transition-all cursor-pointer">SOBRE NÓS</a></li>
        <li><a href="/contact" class="transition-all cursor-pointer">CONTATO</a></li>
    </ul>
</nav>
        </div>
        <div class="w-fit md:w-1/12 justify-end text-right flex md:pr-10">
          <div class="blck md:hidden cursor-pointer mr-3" on:click={collapseNav}>
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 17 14">
              <path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
          </div>

          <label for="my-drawer-4" class="drawer-button relative mr-10 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg></label>
        </div>
    </div>
</div>

<div id="collapse-nav-menu" class="h-0 top-48 w-full bg-black transition-all fixed z-40 overflow-hidden md:hidden">
  <nav class="h-full mt-auto relative">
    <ul class="flex justify-center text-white h-full items-center flex-col">
      <li class=""><a href="/" on:click={collapseNav}>HOME</a></li>
      <li class="mt-4"><a>PRODUTOS</a>
        <ul class="subMenu bg-black absolute -mt-6 px-12 flex flex-col gap-2 ml-24 py-0 h-0 overflow-hidden">
          <li><a href="/products/6" data-sveltekit-reload on:click={collapseNav} class="transition-all cursor-pointer">CAMISAS</a></li>
          <li><a href="/products/5" data-sveltekit-reload on:click={collapseNav} class="transition-all cursor-pointer">POLOS</a></li>
          <li><a href="/products/3" data-sveltekit-reload on:click={collapseNav} class="transition-all cursor-pointer">CHINELOS</a></li>
          <li><a href="/products/1" data-sveltekit-reload on:click={collapseNav} class="transition-all cursor-pointer">TÊNIS</a></li>
          <li><a href="/products/4" data-sveltekit-reload on:click={collapseNav} class="transition-all cursor-pointer">BONÉS</a></li>
          <li><a href="/products/2" data-sveltekit-reload on:click={collapseNav} class="transition-all cursor-pointer">BLUSAS</a></li>
        </ul></li>
      <li class="mt-4"><a href="" on:click={collapseNav}>AVALIAÇÕES</a></li>
      <li class="mt-4"><a href="/about" on:click={collapseNav}>SOBRE NÓS</a></li>
      <li class="mt-4"><a href="/contact" on:click={collapseNav}>CONTATO</a></li>
    </ul>
  </nav>
</div>
<style>
  @keyframes openSubMenu{
    0%{
      height: fit-content;
    }
    95%{
      height: fit-content;
    }
    to{
      height: 0;
    }
  }
    ul li{
        font-family: "Roboto-Regular";
    }
    /* ul li:hover ul{
      animation-name: openSubMenu;
    animation-duration: 4s;
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    animation-delay: 1s; 
    } */
    .subMenu{
      background-color: rgb(53, 53, 53, 50%);
      transition: all 0.1s linear;
    }
    .transparentNav{
        background-color: rgb(53, 53, 53, 50%);
    }
    .hr1 {
    height: 1px;
    margin-left: auto;
    width: 50%;
    border: none;
    background-image: linear-gradient(to right, white, black);
  }
  .hr2 {
    height: 1px;
    margin-left: auto;
    width: 50%;
    border: none;
    background-image: linear-gradient(to left, white, black);
  }

  ul li a:hover{
    color:#FFBF00;
  }
   svg:hover path{
    fill: #ffbf00 !important;;
  }
  .socialIcons img:hover{
    transform: scale(1.1);
  }
</style>