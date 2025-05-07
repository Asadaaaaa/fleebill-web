<script>
  import { gsap } from "gsap";
  import { onMount } from "svelte";
  import ScreenOne from "./ScreenOne.svelte";

  let receiptElement;
  let cameraScreenElement;
  let loadingScreenElement;
  let timeline1;
  let timeline2;
  onMount(() => {
    gsap.set(loadingScreenElement, {
        opacity: 0,
    });

    timeline1 = gsap.timeline({ paused: true,});
    timeline2 = gsap.timeline({ paused: true});
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
    }).to(loadingScreenElement, {
        opacity: 1,
        duration: duration,
        ease: ease,
    });

    timeline1.play()
  };

  export const reverseTimeline1 = () => {
    timeline1.reverse();
  };
</script>

<div class="phone-screen">
    <ScreenOne bind:cameraScreenElement bind:receiptElement/>
     <div class="loading-screen" bind:this={loadingScreenElement}>
        <img src="/images/lottie.gif" alt="Loading Screen" />
        <h2>Crunching your bill with AI magic...</h2>
     </div>
</div>


