<script>
  import Spacer from "$lib/components/Spacer.svelte";
  import { gsap } from "gsap";
  import { onMount } from "svelte";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { app } from "$lib/shared.svelte";

  gsap.registerPlugin(ScrollTrigger);

  let { title, description, color, image, index } = $props();

  let card = $state(null);
  let texts = $state(null);
  let sticker = $state(null);

  const mobileAnimation = () => {
    gsap.from(card, {
      xPercent: index % 2 === 0 ? 110 : -110,
      duration: 0.5,
      rotation: index % 2 === 0 ? 10 : -10,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
      },
    });
  };

  const desktopAnimation = () => {
    gsap.from(texts, {
      duration: 1,
      yPercent: -200,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
      },
    });

    gsap.from(sticker, {
      duration: .5,
      yPercent: 50,
      xPercent: 50,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
      },
    });
  };

  onMount(() => {
    if (app.isMobile) {
      mobileAnimation();
    } else {
      desktopAnimation();
    }
  });
</script>

<div
  class="highlight-card"
  style={`background-color: var(${color[0]})`}
  bind:this={card}
>
  <div class="text-content" bind:this={texts}>
    <h1 style={`color: var(${color[1]})`}>{title}</h1>
    <p>{description}</p>
  </div>
  <Spacer size={24} />
  <img src={image} alt="Highlight Card" bind:this={sticker} />
</div>
