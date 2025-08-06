<script>
  import AppButton from './AppButton.svelte';

  export let billData;
  export let editedBillData;
  export let isEditing;
  export let hasChanges;
  export let onToggleEdit;
  export let onSaveChanges;
  export let onRestaurantEdit;

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
</script>

<div class="header-section">
  <div class="container">
    <div class="header-content">
      <div class="bill-header">
        <div class="restaurant-info">
          {#if isEditing}
            <input 
              type="text" 
              class="restaurant-name-input"
              value={editedBillData.billAnalysis.data.name}
              oninput={(e) => onRestaurantEdit(e.target.value)}
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
            onclick={onToggleEdit}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </AppButton>
          
          {#if isEditing && hasChanges}
            <AppButton 
              classes="btn-save btn-primary" 
              onclick={onSaveChanges}
            >
              Save
            </AppButton>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use '$lib/styles/abstracts' as *;

  .header-section {
    background: $color-white;
    border-bottom: 1px solid $color-gray-200;
    padding: $space-6 0;
    margin-bottom: $space-8;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 $space-4;
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
  }
</style> 