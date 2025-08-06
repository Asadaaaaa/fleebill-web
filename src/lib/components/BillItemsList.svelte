<script>
  import BillItem from './BillItem.svelte';

  let { items, isEditing, onItemEdit, formatCurrency } = $props();
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

  .section-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    margin: $space-6 0;
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }
</style> 