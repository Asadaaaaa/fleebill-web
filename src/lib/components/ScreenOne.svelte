 <script>
  export let cameraScreenElement, receiptElement;
 </script>
 
 <div class="camera-screen" bind:this={cameraScreenElement}>
    <img src="/svg/camera-screen.svg" alt="Camera Screen" />
  </div>
  <div class="receipt" bind:this={receiptElement}>
    <img src="/images/receipt.webp" alt="Receipt" />
  </div>

  <style>
  .receipt {
    position: relative;
    will-change: transform, opacity;
  }
</style>