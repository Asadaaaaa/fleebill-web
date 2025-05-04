<script>
  import { onMount } from "svelte";
  import gsap from "gsap";
  import AppButton from "$lib/components/AppButton.svelte";

  let topLeft = $state(null);
  let bottomRight = $state(null);
  let topRight = $state(null);
  let bottomLeft = $state(null);

  const curve = "expo.out";
  const duration = 2;

  const handleStickers = () => {

    gsap.from(topLeft, {
      duration: duration,
      xPercent: -100,
      yPercent: -100,
      ease: curve,
    });
    gsap.from(bottomRight, {
      duration: duration,
      xPercent: 100,
      yPercent: 100,
      ease: curve,
    });
    gsap.from(topRight, {
      duration: duration,
      xPercent: 100,
      yPercent: -100,
      ease: curve,
    });
    gsap.from(bottomLeft, {
      duration: duration,
      xPercent: -100,
      yPercent: 100,
      ease: curve,
    });
  };

  const handleTexts = () => {
    const texts = document.querySelectorAll(".text");
    gsap.from(texts, {
      duration: duration,
      opacity: 0,
      y: 20,
      stagger: 0.2,
      ease: curve,
    });
  };

  const handleButton = () => {
    const button = document.querySelector(".button");
    gsap.from(button, {
      duration: duration,
      opacity: 0,
      y: 20,
      ease: curve,
    });
  };

  onMount(() => {
    handleStickers();
    handleTexts();
    handleButton();
  });
</script>

<div class="landing-page">
  <div class="stickers">
    <div class="top-left" bind:this={topLeft}>
      <img src="/svg/top-left.svg" alt="" />
    </div>
    <div class="bottom-right" bind:this={bottomRight}>
      <img src="/svg/bottom-right.svg" alt="" />
    </div>
    <div class="top-right" bind:this={topRight}>
      <img src="/svg/top-right.svg" alt="" />
    </div>
    <div class="bottom-left" bind:this={bottomLeft}>
      <img src="/svg/bottom-left.svg" alt="" />
    </div>
  </div>
  <h1>
    <span class="text">Don't</span>
    <span class="text flee">Flee</span>
    <span class="text">From<br /></span>
    <span class="text">Your</span>
    <span class="text bill">Bill</span>
  </h1>
  
  <AppButton classes="button">
    <img src="/svg/icon.svg" alt="icon" />
  </AppButton>
</div>
