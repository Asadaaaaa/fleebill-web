<script>
  import AppButton from './AppButton.svelte';

  let { billData, editedBillData, isEditing, hasChanges, onToggleEdit, onSaveChanges, onRestaurantEdit } = $props();

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
            {#if isEditing}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            {/if}
          </AppButton>
          
          {#if isEditing && hasChanges}
            <AppButton 
              classes="btn-save btn-primary" 
              onclick={onSaveChanges}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
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