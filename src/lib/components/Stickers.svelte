<script>
  const stickers = [
    {
      src: "/images/workflow-sticker/s-f-0.svg",
      alt: "Sticker 1",
      size: 150,
    },
    {
      src: "/images/workflow-sticker/s-f-1.svg",
      alt: "Sticker 2",
      size: 170,
    },
    {
      src: "/images/workflow-sticker/s-f-2.svg",
      alt: "Sticker 3",
      size: 130,
    },
    {
      src: "/images/workflow-sticker/s-f-3.svg",
      alt: "Sticker 4",
      size: 160,
    },
    {
      src: "/images/workflow-sticker/s-f-0.svg",
      alt: "Sticker 5",
      size: 120,
    },
    {
      src: "/images/workflow-sticker/s-f-1.svg",
      alt: "Sticker 6",
      size: 180,
    },
    {
      src: "/images/workflow-sticker/s-f-2.svg",
      alt: "Sticker 7",
      size: 140,
    },
    
  ];



</script>


<div class="stickers">
  {#each stickers as sticker, index}
    <div 
      class="sticker sticker-{index}"
      style="--sticker-size: {sticker.size}px;"
    >
      <img src={sticker.src} alt={sticker.alt} />
    </div>
  {/each}
</div>


