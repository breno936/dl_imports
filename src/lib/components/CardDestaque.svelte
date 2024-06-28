<script lang="ts">
  import { onMount } from "svelte";

  var lastScrollTop = 0;
  let card1:any;
  let card2:any;
  let path86:any;
  let path154:any;
  
  onMount(() => {
    // var st = window.pageYOffset || document.documentElement.scrollTop;
    // var countScroll = 0;

    const options1 = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.3 // 50% visível
    };
    const options2 = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.3 // 50% visível
    };

    const options3 = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.3 // 50% visível
    };


    const callback1 = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animationPathDrawFill");
          observer.unobserve(entry.target); // Para animar apenas uma vez
        }
      });
    };

    const callback2 = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animationPathDraw");
          observer.unobserve(entry.target); // Para animar apenas uma vez
        }
      });
    };

    const callback3 = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("cardAnimate");
          card2.classList.add("cardAnimate");
          observer.unobserve(entry.target); // Para animar apenas uma vez
        }
      });
    };
    


        // Create IntersectionObservers
    const observer1 = new IntersectionObserver(callback1, options1);
    const observer2 = new IntersectionObserver(callback2, options2);
    const observer3 = new IntersectionObserver(callback3, options3);
    console.log(path86);
    observer1.observe(path86);
    if (path154) observer2.observe(path154);
    if (card1) observer3.observe(card1);

  });
</script>

<div class="bg-black h-[600px] top-[-300px] w-full relative divCorte">
</div>
<div id="blackSection" class="bg-black w-full box-border pb-10 px-44 top-[-300px] relative">
    <svg
       version="1.0"
       width="953.000000pt"
       height="960.000000pt"
       viewBox="0 0 953.000000 960.000000"
       preserveAspectRatio="xMidYMid meet"
       id="svg164"
       xmlns="http://www.w3.org/2000/svg"
       class="absolute imgBackDL left-0"
       >
      <defs
         id="defs168" />
      <sodipodi:namedview
         id="namedview166"
         pagecolor="#ffffff"
         bordercolor="#ffffff"
         borderopacity="0.25"
         inkscape:showpageshadow="2"
         inkscape:pageopacity="0.0"
         inkscape:pagecheckerboard="0"
         inkscape:deskcolor="#d1d1d1"
         inkscape:document-units="pt"
         showgrid="false"
         inkscape:zoom="0.36875"
         inkscape:cx="238.64407"
         inkscape:cy="720"
         inkscape:window-width="1920"
         inkscape:window-height="1111"
         inkscape:window-x="-9"
         inkscape:window-y="-9"
         inkscape:window-maximized="1"
         inkscape:current-layer="svg164" />
      <path bind:this={path86}
         d="m 653.00878,294.89536 c 8.71274,-6.9702 51.98604,-40.07862 95.84016,-73.47747 43.85414,-33.68927 81.89979,-63.02218 84.22319,-65.05514 7.55105,-6.09893 60.9892,-46.75839 74.92959,-56.923256 13.06912,-9.293598 13.06912,-9.293598 -3.77553,7.260606 -9.584,9.58402 -22.65312,21.49144 -29.04247,27.00951 -9.87444,8.42232 -51.11476,45.01584 -60.69877,54.01901 -1.74255,1.74254 -26.13823,23.23398 -54.01901,47.92008 -27.88078,24.68611 -51.40518,45.5967 -52.27645,46.46797 -0.87129,0.87126 -12.48827,11.32656 -26.13823,23.23398 -13.64998,11.90742 -26.71909,23.81483 -29.04248,26.13822 -2.3234,2.3234 -9.58402,8.71274 -15.97337,14.23083 -6.38934,5.22764 -18.00634,15.68293 -26.13823,23.23398 -7.84147,7.26061 -19.74887,17.7159 -26.13823,23.23397 -6.38933,5.22764 -18.00633,15.97337 -26.13822,23.23398 -7.84147,7.55104 -19.74888,18.00633 -26.42865,23.5244 -6.38934,5.51808 -34.56055,30.49461 -62.44133,55.18072 -69.99237,62.73174 -77.54341,67.37854 -126.33477,80.44766 -28.75206,7.55104 -29.04248,7.55104 -170.18891,8.71274 L 31.499781,584.73928 V 302.73682 20.734373 h 9.584022 C 131.69633,20.153527 285.04719,29.668917 294.92164,31.121047 548.77606,21.991459 558.45687,337.62329 524.35363,367.41869 c -31.22488,27.28064 74.23576,-35.5626 128.65515,-72.52333 z m -2.90426,311.04492 v 210.55795 l 135.9188,0.58085 135.62836,0.87127 v 68.24983 68.24981 H 708.18949 494.72729 L 493.856,773.51536 c -0.29042,-99.32526 -1.45211,-180.64419 -2.3234,-180.64419 -1.45211,0 -72.89661,52.56688 -88.28912,64.76472 -2.3234,2.03298 -23.23399,17.71591 -46.46797,34.85097 l -46.46795,34.85098 c -2.61382,2.03296 -12.19784,9.29358 -21.78186,16.26378 -9.58402,7.26062 -22.07228,16.5542 -27.59036,20.62016 -85.67531,65.34557 -143.46983,108.038 -147.53577,109.19971 -6.38935,2.3234 -26.138227,20.03931 205.62073,-186.16228 66.21684,-58.95623 138.82303,-123.72095 161.47617,-143.76025 22.36271,-20.03932 49.66263,-44.14457 60.69877,-53.72859 11.03615,-9.58402 38.91692,-34.56054 62.1509,-55.76155 23.23398,-21.20102 43.27329,-38.33607 44.72542,-38.62649 1.16169,0 2.03296,94.67846 2.03296,210.55795 z"
         id="path86"
         style="stroke:#ffffff;stroke-width:5.80849;stroke-opacity:1" />
      <path bind:this={path154}
         d="m 202.26955,159.26699 -13.94039,1.1617 -0.58086,139.40389 c -0.58084,76.38171 -0.29042,140.56558 0,142.01771 1.45213,3.77552 71.15408,3.77552 97.2923,0 89.1604,-13.06911 138.53261,-90.61253 115.29863,-180.93463 -13.64996,-53.72859 -47.62966,-84.80404 -107.45716,-97.87315 -15.10209,-3.48509 -70.86364,-5.80849 -90.61252,-3.77552 z"
         id="path154"
         style="stroke:#ffffff;stroke-width:5.80849;stroke-opacity:1"
          />
    </svg>
    
        <div id="card1" bind:this={card1} class="w-2/5 h-[500px] mb-10 bg-green-50 relative cursor-pointer card">
        <div class="description w-full h-2/6 bottom-0 transition-all absolute text-center">
            <h1 class="text-[#FFBF00] text-[60px] transition-all">DJ ARANA</h1>
            <h2 class="text-white transition-all">Conjunto Andy</h2>
        </div>
    </div>
    <div id="card2" bind:this={card2} class="w-2/5 ml-auto mt-24 h-[500px] mb-10 bg-green-50 cursor-pointer relative card">
        <div class="description transition-all w-full h-2/6 bottom-0 absolute text-center">
            <h1 class="text-[#FFBF00] text-[60px] transition-all">4 POR 2</h1>
            <h2 class="text-white">Cool Cats</h2>
        </div>
    </div>
</div>
<style>
    .divCorte{
        clip-path:  polygon(0 100%, 100% 100%, 0 0, 0 0);
    }
   
    #card1{
        background-image: url("static/img/417006646_18405483268059327_6530026535263804862_n.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        left: -30%;
        opacity: 0;
    }
    #card2{
        background-image: url("static/img/419752615_18407757085059327_2323054749524548969_n.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        left: 30%;
        opacity: 0;
    }
    .animationPathDraw,
	  :global(#blackSection .animationPathDraw){
      animation: dash 7s linear forwards;
    }
    .animationPathDrawFill,
	  :global(#blackSection .animationPathDrawFill){
      animation: dash 7s linear forwards, fillColor 0.6s linear 2.4s forwards;
      animation-iteration-count: 1;
    }
    .cardAnimate,
	  :global(#card1.cardAnimate, #card2.cardAnimate){
      animation-name: cardShow;
      animation-duration: 1s;
      animation-delay: 2s;
      animation-iteration-count: 1;
      animation-fill-mode: forwards;  
    }

    .card:hover .description{
        height: 100%;
    }
    .card:hover .description h1{
        margin-top: 50%;
    }
   
    .description{
        background-color: rgb(30, 30, 30, 0.3);
    }
    h1{
        text-shadow: 4px 4px 0px black;
        font-family: "Roboto-Black";
    }
    h2{
        font-family: "Roboto-Black";
    }
    .imgBackDL{
        width: 100%;
        height: 100%;
        top:-80px;
    }


    #path154{
        stroke-dasharray: 8000; /* Comprimento total da linha */
        stroke-dashoffset: 8000;
 

    }
    #path86{
        fill: none;
        stroke-dasharray: 8000; /* Comprimento total da linha */
        stroke-dashoffset: 8000;
        transition: all 0.3s linear;

    }
    @keyframes cardShow {
    to {
    left: 0;
    opacity: 1;

    }
    }

    @keyframes dash {
    to {
        stroke-dashoffset: 0;
        stroke-dasharray: 8000;

    }
    }
    
    @keyframes fillColor {
    from{
        fill:black;
    }
    to {
        fill: #FFBF00;

    }
    }
</style>