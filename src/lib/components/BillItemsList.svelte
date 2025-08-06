<script>
  import BillItem from './BillItem.svelte';

  let { items, isEditing, onItemEdit, formatCurrency } = $props();
</script>

<div class="items-section">
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

  .items-list {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-4;
    
    @media (min-width: $breakpoint-md) {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
</style> 