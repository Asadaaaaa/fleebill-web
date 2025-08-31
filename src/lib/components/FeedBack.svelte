<script>
  export let show = false;
  export let type = 'success'; // 'success' or 'error'
  export let message = 'Changes saved successfully!'; // 'success' or 'error'
</script>

{#if show}
  <div class="save-feedback {type}">
    <div class="feedback-content">
      <span>
        {#if type === 'success'}
          {message}
        {:else if type === 'error'}
          {message}
        {/if}
      </span>
    </div>
  </div>
{/if}

<style lang="scss">
  @use '$lib/styles/abstracts' as *;

  .save-feedback {
    position: fixed;
    bottom: $space-6;
    right: $space-6;
    color: $color-white;
    padding: $space-3 $space-4;
    border-radius: $border-radius-lg;
    box-shadow: $box-shadow-lg;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: $z-index-modal;
    animation: slideIn 0.3s ease forwards;

    &.success {
      background: $color-success;
    }

    &.error {
      background: $color-danger;
    }
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