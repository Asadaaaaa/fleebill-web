<script>
  import FriendAvatar from "./FriendAvatar.svelte";
  import { bill, app } from "$lib/shared.svelte";

  let { item, index, isEditing, onItemEdit, formatCurrency } = $props();

  const handleInputChange = (field, value) => {
    onItemEdit(index, field, value);
  };
</script>

<div class="item-card">
  <div class="item-header">
    <div class="item-number">#{index + 1}</div>
    <div class="item-type">{item.type}</div>
  </div>
  
  <div class="item-details">
    <div class="item-name-section">
      {#if isEditing}
        <input 
          type="text" 
          class="item-name-input"
          value={item.name}
          oninput={(e) => handleInputChange('name', e.target.value)}
          placeholder="Item name"
        />
      {:else}
        <h3 class="item-name">{item.name}</h3>
      {/if}
    </div>
    
    <div class="item-pricing">
      <div class="price-row">
        <span class="label">Unit Price:</span>
        {#if isEditing}
          <input 
            type="number" 
            class="price-input"
            value={item.unitPrice}
            oninput={(e) => handleInputChange('unitPrice', e.target.value)}
            min="0"
          />
        {:else}
          <span class="price">{formatCurrency(item.unitPrice)}</span>
        {/if}
      </div>
      
      <div class="price-row">
        <span class="label">Amount:</span>
        {#if isEditing}
          <input 
            type="number" 
            class="amount-input"
            value={item.amount}
            oninput={(e) => handleInputChange('amount', e.target.value)}
            min="1"
          />
        {:else}
          <span class="amount">× {item.amount} {item.type}</span>
        {/if}
      </div>
      
      <div class="price-row total-row">
        <span class="label">Total:</span>
        <span class="total-price">{formatCurrency(item.totalPrice)}</span>
      </div>
    </div>
  </div>

  <div class="item-friends">
    <div class="item-friends-label">Select Friend(s) for this item</div>
    <div class="item-friends-list">
      {#each bill.friends as friend}
        <FriendAvatar id={friend.id} />
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  @use '$lib/styles/abstracts' as *;

  .item-friends {
    border-top: 1px solid $color-gray-200;
    width: 100%;
    margin-top: $space-2;
    padding-top: $space-2;
    display: flex;
    flex-direction: column;
    gap: $space-2;
    flex-wrap: wrap;
    overflow: hidden;
  }

  .item-friends-label {
    font-size: $font-size-sm;
    color: $color-gray-600;
  }

  .item-friends-list {
    width: 100%;
    display: flex;
    flex-direction: row;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
    gap: $space-2;
    overflow: auto;
  }

  .item-card {
    width: 100%;
    overflow: hidden;
    background: white;
    border-radius: $border-radius-lg;
    padding: $space-6;
    box-shadow: $box-shadow;
    border: 1px solid $color-gray-200;
    transition: all 0.2s ease;
    
    &:hover {
      box-shadow: $box-shadow-md;
      transform: translateY(-2px);
    }
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $space-4;
  }

  .item-number {
    background: $color-primary;
    color: $color-on-primary;
    font-weight: $font-weight-bold;
    padding: $space-1 $space-3;
    border-radius: $border-radius-full;
    font-size: $font-size-sm;
  }

  .item-type {
    background: $color-secondary;
    color: $color-gray-900;
    font-weight: $font-weight-medium;
    padding: $space-1 $space-3;
    border-radius: $border-radius-full;
    font-size: $font-size-sm;
    text-transform: capitalize;
  }

  .item-details {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: $space-4;
    flex-wrap: wrap;
    flex-direction: column;
  }

  .item-name-section {
    width: 100%;
    flex: 1;
    min-width: 0;
  }

  .item-name {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    margin: 0;
    line-height: $line-height-tight;
  }

  .item-name-input {
    width: 100%;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    background: transparent;
    border: 2px solid $color-primary;
    border-radius: $border-radius;
    padding: $space-2 $space-3;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: $color-primary-dark;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
    }
  }

  .item-pricing {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: $space-2;
    min-width: 150px;
  }

  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $space-3;
    
    &.total-row {
      border-top: 1px solid $color-gray-200;
      padding-top: $space-2;
      margin-top: $space-2;
      font-weight: $font-weight-semibold;
    }
  }

  .label {
    color: $color-gray-600;
    font-size: $font-size-sm;
  }

  .price, .amount, .total-price {
    flex: 1;
    text-align: right;
    font-weight: $font-weight-medium;
    color: $color-gray-900;
  }

  .total-price {
    color: $color-primary-dark;
    font-weight: $font-weight-bold;
  }

  .price-input, .amount-input {
    width: 80px;
    text-align: right;
    background: transparent;
    border: 2px solid $color-primary;
    border-radius: $border-radius;
    padding: $space-1 $space-2;
    font-size: $font-size-sm;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: $color-primary-dark;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
    }
  }

  @media (max-width: $breakpoint-md) {
    .item-details {
      flex-direction: column;
      align-items: flex-start;
      gap: $space-3;
    }
    
    .item-pricing {
      width: 100%;
      min-width: auto;
    }
  }
</style> 