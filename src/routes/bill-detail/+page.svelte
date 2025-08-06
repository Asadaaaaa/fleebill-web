<script>
  import { onMount } from 'svelte';
  import AppButton from '$lib/components/AppButton.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import { gsap } from 'gsap';
  import { goto } from '$app/navigation';

  // Bill data state
  let billData = $state(null);
  let editedBillData = $state(null);
  let isEditing = $state(false);
  let hasChanges = $state(false);

  // Animation refs
  let headerRef = $state(null);
  let itemsRef = $state(null);
  let totalRef = $state(null);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Initialize bill data
  onMount(() => {
    billData = localStorage.getItem('billData');
    if (billData) {
      billData = JSON.parse(billData);
      editedBillData = JSON.parse(JSON.stringify(billData));
    }
  });

  // Handle item editing
  const handleItemEdit = (index, field, value) => {
    if (!editedBillData) return;
    
    const item = editedBillData.billAnalysis.data.items[index];
    
    if (field === 'name') {
      item.name = value;
    } else if (field === 'amount') {
      const newAmount = parseInt(value) || 1;
      item.amount = newAmount;
      item.totalPrice = item.unitPrice * newAmount;
    } else if (field === 'unitPrice') {
      const newPrice = parseInt(value) || 0;
      item.unitPrice = newPrice;
      item.totalPrice = item.amount * newPrice;
    }
    
    // Recalculate total
    editedBillData.billAnalysis.data.billTotalPrice = editedBillData.billAnalysis.data.items.reduce(
      (sum, item) => sum + item.totalPrice, 0
    );
    
    hasChanges = true;
  };

  // Handle restaurant name edit
  const handleRestaurantEdit = (value) => {
    if (!editedBillData) return;
    editedBillData.billAnalysis.data.name = value;
    hasChanges = true;
  };

  // Save changes
  const saveChanges = () => {
    billData = JSON.parse(JSON.stringify(editedBillData));
    localStorage.setItem('billData', JSON.stringify(billData));
    isEditing = false;
    hasChanges = false;
    
  };

  // Cancel editing
  const cancelEditing = () => {
    editedBillData = JSON.parse(JSON.stringify(billData));
    isEditing = false;
    hasChanges = false;
  };

  // Toggle edit mode
  const toggleEdit = () => {
    isEditing = !isEditing;
    if (!isEditing) {
      cancelEditing();
    }
  };
</script>

{#if billData}
  <div class="bill-detail-page">
    <!-- Header Section -->
    <div class="header-section" bind:this={headerRef}>
      <div class="container">
        <div class="header-content">
          <div class="bill-header">
            <div class="restaurant-info">
              {#if isEditing}
                <input 
                  type="text" 
                  class="restaurant-name-input"
                  value={editedBillData.billAnalysis.data.name}
                  oninput={(e) => handleRestaurantEdit(e.target.value)}
                  placeholder="Restaurant name"
                />
              {:else}
                <h2 class="restaurant-name">{billData.billAnalysis.data.name}</h2>
              {/if}
              
              <p class="bill-date">{formatDate(billData.billAnalysis.data.billDate)}</p>
            </div>
            
            <div class="edit-actions">
              <AppButton 
                classes="btn-edit {isEditing ? 'btn-secondary' : 'btn-primary'}" 
                onclick={toggleEdit}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </AppButton>
              
              {#if isEditing && hasChanges}
                <AppButton 
                  classes="btn-save btn-primary" 
                  onclick={saveChanges}
                >
                  Save
                </AppButton>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bill Content -->
    <div class="bill-content">
      <div class="container">
        <!-- Items Section -->
        <div class="items-section" bind:this={itemsRef}>
          <h2 class="section-title">Bill Items</h2>
          
          <div class="items-list">
            {#each editedBillData.billAnalysis.data.items as item, index}
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
                        oninput={(e) => handleItemEdit(index, 'name', e.target.value)}
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
                          oninput={(e) => handleItemEdit(index, 'unitPrice', e.target.value)}
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
                          oninput={(e) => handleItemEdit(index, 'amount', e.target.value)}
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
                
                {#if item.discount}
                  <div class="discount-info">
                    <span class="discount-label">Discount:</span>
                    <span class="discount-amount">-{formatCurrency(item.discount)}</span>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>

        <!-- Total Section -->
        <div class="total-section" bind:this={totalRef}>
          <div class="total-card">
            <div class="total-header">
              <h2 class="total-title">Bill Summary</h2>
            </div>
            
            <div class="total-breakdown">
              <div class="total-row">
                <span class="label">Subtotal:</span>
                <span class="amount">{formatCurrency(editedBillData.billAnalysis.data.billSubtotalPrice)}</span>
              </div>
              
              {#if editedBillData.billAnalysis.data.billDiscounts}
                {#each editedBillData.billAnalysis.data.billDiscounts as discount}
                  <div class="total-row discount">
                    <span class="label">{discount.name}:</span>
                    <span class="amount">-{formatCurrency(discount.value)}</span>
                  </div>
                {/each}
              {/if}
              
              {#if editedBillData.billAnalysis.data.otherCosts}
              {#each editedBillData.billAnalysis.data.otherCosts as otherCost}
                <div class="total-row">
                  <span class="label">{otherCost.name} ({otherCost.percentage}%):</span>
                  <span class="amount">{formatCurrency(otherCost.price)}</span>
                </div>
              {/each}
              {/if}
              
              <div class="total-row final-total">
                <span class="label">Total:</span>
                <span class="amount">{formatCurrency(editedBillData.billAnalysis.data.billTotalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Feedback -->
    <div class="save-feedback">
      <div class="feedback-content">
        <Icon name="Bill" />
        <span>Changes saved successfully!</span>
      </div>
    </div>
  </div>
{:else}
  <div class="no-bill-data">
    <div class="container">
      <div class="no-data-content">
        <Icon name="Bill" />
        <h2>No Bill Data Available</h2>
        <p>Please scan a bill first to view the details.</p>
        <AppButton classes="btn-primary" onclick={() => goto('/')}>
          Go Back
        </AppButton>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use '$lib/styles/abstracts' as *;

  .bill-detail-page {
    min-height: 100vh;
    background: linear-gradient(135deg, $color-gray-100 0%, $color-white 100%);
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 $space-4;
  }

  // Header Section
  .header-section {
    background: $color-white;
    border-bottom: 1px solid $color-gray-200;
    padding: $space-6 0;
    margin-bottom: $space-8;
  }

  .header-content {
    display: flex;
    flex-direction: column;
    gap: $space-6;
  }

  .bill-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: $space-4;
    flex-wrap: wrap;
  }

  .restaurant-info {
    flex: 1;
    min-width: 0;
  }

  .restaurant-name {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    margin: 0 0 $space-2 0;
    line-height: $line-height-tight;
  }

  .restaurant-name-input {
    width: 100%;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
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

  .bill-date {
    color: $color-gray-600;
    font-size: $font-size-sm;
    margin: 0;
  }

  .edit-actions {
    display: flex;
    gap: $space-3;
    flex-wrap: wrap;
  }

  // Bill Content
  .bill-content {
    padding-bottom: $space-16;
  }

  .section-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    margin: 0 0 $space-6 0;
  }

  // Items Section
  .items-section {
    margin-bottom: $space-8;
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }

  .item-card {
    background: $color-white;
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
    color: $color-gray-800;
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
  }

  .item-name-section {
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

  .discount-info {
    margin-top: $space-3;
    padding-top: $space-3;
    border-top: 1px solid $color-gray-200;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .discount-label {
    color: $color-gray-600;
    font-size: $font-size-sm;
  }

  .discount-amount {
    color: $color-success;
    font-weight: $font-weight-medium;
  }

  // Total Section
  .total-section {
    margin-top: $space-8;
  }

  .total-card {
    background: $color-white;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-2 0;
    
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

  // Save Feedback
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
  }

  .feedback-content {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-weight: $font-weight-medium;
  }

  // No Bill Data
  .no-bill-data {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, $color-gray-100 0%, $color-white 100%);
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

  // Responsive Design
  @media (max-width: $breakpoint-md) {
    .container {
      padding: 0 $space-3;
    }
    
    .bill-header {
      flex-direction: column;
      align-items: flex-start;
      gap: $space-4;
    }
    
    .edit-actions {
      width: 100%;
      justify-content: flex-start;
    }
    
    .item-details {
      flex-direction: column;
      align-items: flex-start;
      gap: $space-3;
    }
    
    .item-pricing {
      width: 100%;
      min-width: auto;
    }
    
    .save-feedback {
      bottom: $space-4;
      right: $space-4;
      left: $space-4;
    }
  }
</style>
