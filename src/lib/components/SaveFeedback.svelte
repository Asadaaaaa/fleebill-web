<script>
  export let show = false;
</script>

{#if show}
  <div class="save-feedback">
    <div class="feedback-content">
      <span>Changes saved successfully!</span>
    </div>
  </div>
{/if}

<style lang="scss">
  @use '$lib/styles/abstracts' as *;

  .save-feedback {
    position: fixed;
    bottom: $space-6;
    right: $space-6;
    background: $color-success;
    color: $color-white;
    padding: $space-3 $space-4;
    border-radius: $border-radius-lg;
    box-shadow: $box-shadow-lg;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: $z-index-modal;
    animation: slideIn 0.3s ease forwards;
  }

  .feedback-content {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-weight: $font-weight-medium;
  }

  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: $breakpoint-md) {
    .save-feedback {
      bottom: $space-4;
      right: $space-4;
      left: $space-4;
    }
  }
</style> 