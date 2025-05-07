<script>
  import Spacer from "$lib/components/Spacer.svelte";
  import HighlightCard from "$lib/components/HighlightCard.svelte";
  import { onMount } from "svelte";
  import { app } from "$lib/shared.svelte";
  import { gsap } from "gsap";
  import Icon from "$lib/components/Icon.svelte";

  let title = $state(null);

  onMount(async () => {
    let scrollTrigger = await import("gsap/dist/ScrollTrigger.js");
    gsap.registerPlugin(scrollTrigger);

    gsap.from(title, {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: title,
        start: "top 80%",
      },
    });
  });

  const highlights = [

    {
      title: "Quick Fix",
      description:
        "See a typo? Just tap, edit in place, and FleeBill’s suggestion engine learns as you go—no tedious modes or menus required",
      color: ["--color-accent-1-light", "--color-accent-1-dark"],
      icon: "Highlight-1",
    },
    {
      title: "Split & Settle",
      description:
        "Review each person’s share in a clean list or chart, then tap “Settle Up” to send instant payment links—so you all wrap up in style",
      color: ["--color-secondary-light", "--color-secondary-dark"],
      icon: "Highlight-2",
    },
        {
      title: "Smart & Scan",
      description: "FleeBill’s AI-powered scanner instantly captures and digitizes any handwritten or printed receipt, so you can split the bill in seconds.",
      color: ["--color-primary-light", "--color-primary-dark"],
      icon: "Highlight-3",
    },
  ];
</script>

<div class="landing-highlight">
  <Spacer />
  <div class="subtitle-1" bind:this={title}>
    <Icon name="Subtitle-1" />
  </div>
  {#each highlights as highlight, index}
    <HighlightCard
      color={highlight.color}
      icon={highlight.icon}
      title={highlight.title}
      description={highlight.description}
      {index}
    />
  {/each}
</div>
{#if !app.isMobile}
<Spacer />
{/if} 