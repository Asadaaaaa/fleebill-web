<script lang="ts">
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import Icon from "$lib/components/Icon.svelte";

  let { error, onRetry, onClose } = $props<{
    error: string | null;
    onRetry?: () => void;
    onClose?: () => void;
  }>();

  let errorContainer = $state<HTMLDivElement | null>(null);
  let isVisible = $state(false);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleOverlayClick = (event: MouseEvent) => {
    // Only close if clicking the overlay itself, not its children
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const animateIn = () => {
    if (errorContainer) {
      gsap.fromTo(errorContainer, 
        { 
          opacity: 0, 
          y: -20, 
          scale: 0.95 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.4, 
          ease: "back.out(1.7)" 
        }
      );
    }
  };

  const animateOut = () => {
    if (errorContainer) {
      gsap.to(errorContainer, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          isVisible = false;
        }
      });
    }
  };

  $effect(() => {
    if (error) {
      isVisible = true;
      setTimeout(animateIn, 100);
    } else {
      animateOut();
    }
  });

  onMount(() => {
    if (error) {
      isVisible = true;
      setTimeout(animateIn, 100);
    }
  });
</script>

{#if isVisible && error}
  <div class="error-overlay" role="presentation" aria-live="polite" onclick={handleOverlayClick}>
    <div class="error-container" bind:this={errorContainer}>
      <!-- Decorative elements -->
      <div class="error-decoration">
        <div class="error-dot error-dot-1"></div>
        <div class="error-dot error-dot-2"></div>
        <div class="error-dot error-dot-3"></div>
      </div>

      <!-- Main error content -->
      <div class="error-content">
        <div class="error-text">
          <h3 class="error-title">Oops! Something went wrong</h3>
          <p class="error-message">{error}</p>
        </div>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use '../styles/abstracts' as *;

  .error-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($color-black, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: $z-index-modal;
    padding: $space-4;
  }

  .error-container {
    position: relative;
    max-width: 400px;
    width: 100%;
    background: $color-white;
    border-radius: $border-radius-xl;
    box-shadow: $box-shadow-xl;
    overflow: hidden;
  }

  .error-decoration {
    position: absolute;
    top: 10px;
    left: 0;
    height: 4px;
    background-size: 200% 100%;
    animation: shimmer 2s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .error-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: bounce 1.5s ease-in-out infinite;

    &.error-dot-1 {
      top: 12px;
      left: 20px;
      background-color: $color-danger;
      animation-delay: 0s;
    }

    &.error-dot-2 {
      top: 12px;
      left: 32px;
      background-color: $color-accent-1;
      animation-delay: 0.2s;
    }

    &.error-dot-3 {
      top: 12px;
      left: 44px;
      background-color: $color-warning;
      animation-delay: 0.4s;
    }
  }

  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
  }

  .error-content {
    padding: $space-8 $space-6 $space-6;
    text-align: center;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .error-text {
    margin-bottom: $space-6;
  }

  .error-title {
    font-family: $font-family-primary;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    margin: 0 0 $space-3;
    line-height: $line-height-tight;
  }

  .error-message {
    font-family: $font-family-primary;
    font-size: $font-size-base;
    color: $color-gray-700;
    margin: 0;
    line-height: $line-height-normal;
  }

  @include respond-to(sm) {
    .error-container {
      max-width: 450px;
    }

    .error-content {
      padding: $space-10 $space-8 $space-8;
    }

    .error-title {
      font-size: $font-size-xl;
    }

    .error-message {
      font-size: $font-size-lg;
    }
  }
</style> 