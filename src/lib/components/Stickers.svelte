<script>
  let {stickers, stickers2, stickers3} = $props();
</script>


<div class="workflow-stickers">
  {#each stickers as sticker, index}
    <div 
      class="sticker sticker-{index}"
      style="--sticker-size: {sticker.size}px;"
    >
      <img src={sticker.src} alt={sticker.alt} />
    </div>
  {/each}
  {#each stickers2 as sticker, index}
    <div 
      class="sticker-sf sticker-{index}"
      style="--sticker-size: {sticker.size}px;"
    >
      <img src={sticker.src} alt={sticker.alt} />
    </div>
  {/each}
  {#each stickers3 as sticker, index}
    <div 
      class="sticker-sf-2 sticker-{index}"
      style="--sticker-size: {sticker.size}px;"
    >
      <img src={sticker.src} alt={sticker.alt} />
    </div>
  {/each}
</div>


