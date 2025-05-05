<script>
  // Global styles import
  import '../app.scss';
  import { app } from '$lib/shared.svelte';
  import Footer from '$lib/components/Footer.svelte';
  
  let { children } = $props()

  let innerWidth = $state();

  const checkMobile = () => {
    app.isMobile = innerWidth < 768;
  }

  $effect.pre(() => {
    checkMobile();
  });
</script>

<svelte:window bind:innerWidth />

<main>
  {@render children()}
</main>

<Footer />