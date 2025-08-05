<script>
  import { onMount } from "svelte";
  import { browser } from '$app/environment';
  import { app } from "$lib/shared.svelte";
  import { fade } from 'svelte/transition';

  let { message = "Crunching your bill with AI magic", show = false } = $props();
  
  let lottieContainer = $state(null);
  let animation = $state(null);

  // Initialize Lottie animation when component becomes visible
  $effect(async () => {
    if (show && browser && lottieContainer && !animation) {
      try {
        const lottie = await import('lottie-web');
        animation = lottie.default.loadAnimation({
          container: lottieContainer,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '/lottie/lottie.json'
        });
      } catch (error) {
        console.error('Failed to load Lottie animation:', error);
      }
    }
  });

  // Cleanup animation when component is hidden
  $effect(() => {
    if (!show && animation) {
      animation.destroy();
      animation = null;
    }
  });
</script>

{#if show}
  <div class="loading-screen" class:isMobile={app.isMobile} transition:fade={{ duration: 300 }}>
    <div class="loading-content">
      <div class="lottie-container" bind:this={lottieContainer}></div>
      <h3 class="loading-message">{message}</h3>
    </div>
  </div>
{/if}

<style lang="scss">
  .loading-screen {
    position: fixed;
    width: 100%;
    height: 100%;
    background: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 24px;

    &.isMobile {
      .lottie-container {
        width: 300px;
      }
    }
  }

  .loading-content {
    text-align: center;
  }

  .lottie-container {
    width: 400px;
    justify-self: center;
  }

</style>
