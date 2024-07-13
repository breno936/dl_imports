<script lang="ts">
  import type { DestBanner } from "@prisma/client";
  import { onMount, tick } from "svelte";
  let banner: DestBanner;
  let token: string;

      onMount(async () => {

        const res = await fetch("api/destBanner/getAll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    banner = data.banners[0];
    console.log(banner);
});
</script>

{#if banner}
<div class="flex items-center justify-center w-full bg-white py-20">
    <div class="flex w-8/12 items-center justify-center text-center h-96 md:h-64 bg-[#4B4B4B] rounded-[10px]" style="background-image: url('{banner.picture}');">
        <span class="text-[33px] md:text-[50px] italic font-bold text-white" >{banner.title}</span>
    </div>
</div>
{/if}
