<script>
  import { gsap } from "gsap";
  import { onMount } from "svelte";

  let receiptElement;
  let cameraScreenElement;
  let timeline1;
  let timeline2;
  onMount(() => {
    timeline1 = gsap.timeline({ paused: true,});
  });

  export const playTimeline1 = () => {
    const duration = 0.3;
    const ease = "power2.inOut";

    timeline1.to(receiptElement, {
        yPercent: 100,
        duration: duration,
        ease: ease,
    }).to(cameraScreenElement, {
        scale: 0.9,
        duration: duration,
        ease: ease,
    }).to(cameraScreenElement, {
        xPercent: -100,
        duration: duration,
        ease: ease,
    });

    timeline1.play();
  };

  export const reverseTimeline1 = () => {
    timeline1.reverse();
  };
</script>

<div class="phone-screen">
  <div class="camera-screen" bind:this={cameraScreenElement}>
    <img src="/svg/camera-screen.svg" alt="Camera Screen" />
  </div>
  <div class="receipt" bind:this={receiptElement}>
    <img src="/images/receipt.webp" alt="Receipt" />
  </div>
</div>

<style>
  .receipt {
    position: relative;
    will-change: transform, opacity;
  }
</style>
