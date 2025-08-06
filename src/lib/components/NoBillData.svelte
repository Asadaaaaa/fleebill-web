<script>
  import Icon from './Icon.svelte';
  import AppButton from './AppButton.svelte';
  import { goto } from '$app/navigation';

  const goBack = () => goto('/');
</script>

<div class="no-bill-data">
  <div class="container">
    <div class="no-data-content">
      <Icon name="Bill" />
      <h2>No Bill Data Available</h2>
      <p>Please scan a bill first to view the details.</p>
      <AppButton classes="btn-primary" onclick={goBack}>
        Go Back
      </AppButton>
    </div>
  </div>
</div>

<style lang="scss">
  @use '$lib/styles/abstracts' as *;

  .no-bill-data {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, $color-gray-100 0%, $color-white 100%);
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 $space-4;
  }

  .no-data-content {
    text-align: center;
    max-width: 400px;
    
    h2 {
      font-size: $font-size-2xl;
      font-weight: $font-weight-bold;
      color: $color-gray-900;
      margin: $space-4 0 $space-2 0;
    }
    
    p {
      color: $color-gray-600;
      margin-bottom: $space-6;
    }
  }
</style> 