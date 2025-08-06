<script>
  import BillItem from './BillItem.svelte';

  export let items;
  export let isEditing;
  export let onItemEdit;
  export let formatCurrency;
</script>

<div class="items-section">
  <h2 class="section-title">Bill Items</h2>
  
  <div class="items-list">
    {#each items as item, index}
      <BillItem 
        {item}
        {index}
        {isEditing}
        {onItemEdit}
        {formatCurrency}
      />
    {/each}
  </div>
</div>

<style lang="scss">
  @use '$lib/styles/abstracts' as *;

  .items-section {
    margin-bottom: $space-8;
  }

  .section-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    margin: 0 0 $space-6 0;
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }
</style> 