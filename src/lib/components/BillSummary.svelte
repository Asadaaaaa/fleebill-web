<script>

  let { billData, isEditing, onDiscountEdit, onOtherCostEdit, onAddDiscount, onAddOtherCost, onRemoveDiscount, onRemoveOtherCost, formatCurrency } = $props();
  const handleDiscountInput = (index, field, value) => {
    onDiscountEdit(index, field, value);
  };

  const handleOtherCostInput = (index, field, value) => {
    onOtherCostEdit(index, field, value);
  };
</script>

<div class="total-section">
  <div class="total-card">
    <div class="total-header">
      <h2 class="total-title">Bill Summary</h2>
    </div>
    
    <div class="total-breakdown">
      <div class="total-row">
        <span class="label">Subtotal:</span>
        <span class="amount">{formatCurrency(billData.billAnalysis.data.billSubtotalPrice ?? billData.billAnalysis.data.billTotalPrice)}</span>
      </div>
      
      <!-- Discounts Section -->
      <div class="discounts-section">
        {#if billData.billAnalysis.data.billDiscounts}
          {#each billData.billAnalysis.data.billDiscounts as discount, index}
            <div class="total-row discount">
              {#if isEditing}
                <div class="discount-edit">
                  <input 
                    type="text" 
                    class="discount-name-input"
                    value={discount.name}
                    oninput={(e) => handleDiscountInput(index, 'name', e.target.value)}
                    placeholder="Discount name"
                  />
                  <input 
                    type="number" 
                    class="discount-value-input"
                    value={discount.value}
                    oninput={(e) => handleDiscountInput(index, 'value', e.target.value)}
                    min="0"
                    placeholder="0"
                  />
                  <button 
                    class="remove-btn"
                    onclick={() => onRemoveDiscount(index)}
                    title="Remove discount"
                  >
                    ×
                  </button>
                </div>
              {:else}
                <span class="label">{discount.name}:</span>
                <span class="amount">-{formatCurrency(discount.value)}</span>
              {/if}
            </div>
          {/each}
        {/if}
        
        {#if isEditing}
          <div class="add-item-row">
            <button class="add-btn" onclick={onAddDiscount}>
              + Add Discount
            </button>
          </div>
        {/if}
      </div>
      
      <!-- Other Costs Section -->
      <div class="other-costs-section">
        {#if billData.billAnalysis.data.otherCosts}
          {#each billData.billAnalysis.data.otherCosts as otherCost, index}
            <div class="total-row">
              {#if isEditing}
                <div class="other-cost-edit">
                  <input 
                    type="text" 
                    class="other-cost-name-input"
                    value={otherCost.name}
                    oninput={(e) => handleOtherCostInput(index, 'name', e.target.value)}
                    placeholder="Tax/Cost name"
                  />
                  <input 
                    type="number" 
                    class="other-cost-percentage-input"
                    value={otherCost.percentage}
                    oninput={(e) => handleOtherCostInput(index, 'percentage', e.target.value)}
                    min="0"
                    step="0.1"
                    placeholder="0"
                  />
                  <span class="percentage-symbol">%</span>
                  <button 
                    class="remove-btn"
                    onclick={() => onRemoveOtherCost(index)}
                    title="Remove tax/cost"
                  >
                    ×
                  </button>
                </div>
              {:else}
                <span class="label">{otherCost.name} ({otherCost.percentage}%):</span>
              {/if}
              <span class="amount">{formatCurrency(otherCost.price)}</span>
            </div>
          {/each}
        {/if}
        
        {#if isEditing}
          <div class="add-item-row">
            <button class="add-btn" onclick={onAddOtherCost}>
              + Add Tax/Cost
            </button>
          </div>
        {/if}
      </div>
      
      <div class="total-row final-total">
        <span class="label">Total:</span>
        <span class="amount">{formatCurrency(billData.billAnalysis.data.billTotalPrice)}</span>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use '$lib/styles/abstracts' as *;

  .total-section {
    margin-top: $space-8;
  }

  .total-card {
    background: white;
    border-radius: $border-radius-lg;
    padding: $space-6;
    box-shadow: $box-shadow-md;
    border: 2px solid $color-primary-light;
  }

  .total-header {
    margin-bottom: $space-4;
  }

  .total-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    margin: 0;
  }

  .total-breakdown {
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  .total-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-2 0;
    gap: $space-2;
    
    &.discount {
      color: $color-success;
    }
    
    &.final-total {
      border-top: 2px solid $color-primary;
      padding-top: $space-3;
      margin-top: $space-2;
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $color-primary-dark;
    }
  }

  .label {
    color: $color-gray-600;
    font-size: $font-size-sm;
  }

  .amount {
    flex: 1;
    text-align: right;
    font-weight: $font-weight-medium;
    color: $color-gray-900;
  }

  // Discount editing styles
  .discount-edit {
    display: flex;
    gap: $space-2;
    align-items: center;
    flex: 1;
  }

  .discount-name-input {
    width: 100%;
    background: transparent;
    border: 2px solid $color-success;
    border-radius: $border-radius;
    padding: $space-1 $space-2;
    font-size: $font-size-sm;
    color: $color-success;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: $color-accent-2-dark;
      box-shadow: 0 0 0 3px rgba($color-success, 0.1);
    }
  }

  .discount-value-input {
    width: 100px;
    text-align: right;
    background: transparent;
    border: 2px solid $color-success;
    border-radius: $border-radius;
    padding: $space-1 $space-2;
    font-size: $font-size-sm;
    color: $color-success;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: $color-accent-2-dark;
      box-shadow: 0 0 0 3px rgba($color-success, 0.1);
    }
  }

  // Other cost editing styles
  .other-cost-edit {
    display: flex;
    gap: $space-2;
    align-items: center;
    flex: 1;
  }

  .other-cost-name-input {
    width: 80px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    background: transparent;
    border: 2px solid $color-primary;
    border-radius: $border-radius;
    padding: $space-1 $space-2;
    font-size: $font-size-sm;
    color: $color-gray-900;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: $color-primary-dark;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
    }
  }

  .other-cost-percentage-input {
    width: 40px;
    text-align: right;
    background: transparent;
    border: 2px solid $color-primary;
    border-radius: $border-radius;
    padding: $space-1 $space-2;
    font-size: $font-size-sm;
    color: $color-gray-900;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: $color-primary-dark;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
    }
  }

  .percentage-symbol {
    color: $color-gray-600;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
  }

  // Section styles
  .discounts-section, .other-costs-section {
    margin: $space-2 0;
  }

  // Add/Remove button styles
  .add-item-row {
    margin: $space-2 0;
  }

  .add-btn {
    background: transparent;
    border: 2px dashed $color-gray-400;
    border-radius: $border-radius;
    padding: $space-2 $space-3;
    color: $color-gray-600;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    
    &:hover {
      border-color: $color-primary;
      color: $color-primary;
      background: rgba($color-primary, 0.05);
    }
  }

  .remove-btn {
    background: $color-danger;
    color: $color-white;
    border: none;
    border-radius: $border-radius-full;
    width: 24px;
    height: 24px;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    cursor: pointer;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    
    &:hover {
      background: darken($color-danger, 10%);
      transform: scale(1.1);
    }
  }
</style> 