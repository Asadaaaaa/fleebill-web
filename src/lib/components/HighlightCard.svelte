<script>
  import Spacer from "$lib/components/Spacer.svelte";
  import { gsap } from "gsap";
  import { onMount } from "svelte";
  import { app } from "$lib/shared.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  gsap.registerPlugin(ScrollTrigger);

  let { title, description, color, icon, index } = $props();

  let card = $state(null);
  let texts = $state(null);
  let sticker = $state(null);

  const start = "top 90%";

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

  const handleStickerMouseEnter = () => {
    if(!app.isMobile)
    gsap.to(sticker, {
      duration: 0.1,
      scale: 1.05,
      rotation: -10,
    });
  };

  const handleStickerMouseLeave = () => {
    if (!app.isMobile)
    gsap.to(sticker, {
      duration: 0.1,
      scale: 1,
      rotation: 0,
    });
  };

  const desktopAnimation = () => {
    gsap.from(texts, {
      duration: 1,
      opacity: 0,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: card,
        start: start,
      },
    });

    gsap.from(sticker, {
      duration: 0.5,
      yPercent: 50,
      xPercent: 50,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: card,
        start: start,
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
  class="highlight-card highlight-{index}"
  style={`background-color: var(${color[0]})`}
  bind:this={card}
  onmouseenter={handleStickerMouseEnter}
  onmouseleave={handleStickerMouseLeave}
  role="presentation"
>
  <div class="text-content" bind:this={texts}>
    <h1 style={`color: var(${color[1]})`}>{title}</h1>
    <p>{description}</p>
  </div>
  <Spacer size={24} />
  <div class="sticker-icon" bind:this={sticker} >
    <Icon name={icon} />
  </div>
</div>
