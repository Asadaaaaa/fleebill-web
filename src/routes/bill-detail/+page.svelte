<script>
  import { onMount } from 'svelte';
  import BillHeader from '$lib/components/BillHeader.svelte';
  import BillItemsList from '$lib/components/BillItemsList.svelte';
  import BillSummary from '$lib/components/BillSummary.svelte';
  import SaveFeedback from '$lib/components/SaveFeedback.svelte';
  import NoBillData from '$lib/components/NoBillData.svelte';
  import FriendsPanel from '$lib/components/FriendsPanel.svelte';

  // Bill data state
  let billData = $state(null);
  let editedBillData = $state(null);
  let isEditing = $state(false);
  let hasChanges = $state(false);
  let showSaveFeedback = $state(false);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Initialize bill data
  onMount(() => {
    billData = localStorage.getItem('billData');
    if (billData) {
      billData = JSON.parse(billData);
      editedBillData = JSON.parse(JSON.stringify(billData));
    }
  });

  // Recalculate all totals including subtotal, discounts, taxes, and final total
  const recalculateTotals = () => {
    if (!editedBillData) return;
    
    const data = editedBillData.billAnalysis.data;
    
    // Calculate subtotal from items
    data.billSubtotalPrice = data.items.reduce(
      (sum, item) => sum + item.totalPrice, 0
    );
    
    // Calculate total discounts
    const totalDiscounts = data.billDiscounts ? data.billDiscounts.reduce(
      (sum, discount) => sum + discount.value, 0
    ) : 0;
    
    // Calculate total after discounts
    const totalAfterDiscounts = data.billSubtotalPrice - totalDiscounts;
    
    // Calculate taxes and other costs based on percentage
    let totalOtherCosts = 0;
    if (data.otherCosts) {
      data.otherCosts.forEach(otherCost => {
        // Calculate percentage based on subtotal or total after discounts
        // Most taxes are calculated on subtotal, but some might be on total after discounts
        const baseAmount = otherCost.calculateOnSubtotal ? data.billSubtotalPrice : totalAfterDiscounts;
        otherCost.price = Math.round((baseAmount * otherCost.percentage) / 100);
        totalOtherCosts += otherCost.price;
      });
    }
    
    // Calculate final total
    data.billTotalPrice = totalAfterDiscounts + totalOtherCosts;
  };

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
    
    // Recalculate all totals
    recalculateTotals();
    
    hasChanges = true;
  };

  // Handle restaurant name edit
  const handleRestaurantEdit = (value) => {
    if (!editedBillData) return;
    editedBillData.billAnalysis.data.name = value;
    hasChanges = true;
  };

  // Handle discount editing
  const handleDiscountEdit = (index, field, value) => {
    if (!editedBillData || !editedBillData.billAnalysis.data.billDiscounts) return;
    
    const discount = editedBillData.billAnalysis.data.billDiscounts[index];
    
    if (field === 'name') {
      discount.name = value;
    } else if (field === 'value') {
      discount.value = parseInt(value) || 0;
    }
    
    recalculateTotals();
    hasChanges = true;
  };

  // Handle other cost (tax) editing
  const handleOtherCostEdit = (index, field, value) => {
    if (!editedBillData || !editedBillData.billAnalysis.data.otherCosts) return;
    
    const otherCost = editedBillData.billAnalysis.data.otherCosts[index];
    
    if (field === 'name') {
      otherCost.name = value;
    } else if (field === 'percentage') {
      otherCost.percentage = parseFloat(value) || 0;
    }
    
    recalculateTotals();
    hasChanges = true;
  };

  // Add new discount
  const addDiscount = () => {
    if (!editedBillData) return;
    
    if (!editedBillData.billAnalysis.data.billDiscounts) {
      editedBillData.billAnalysis.data.billDiscounts = [];
    }
    
    editedBillData.billAnalysis.data.billDiscounts.push({
      name: 'New Discount',
      value: 0
    });
    
    recalculateTotals();
    hasChanges = true;
  };

  // Add new other cost (tax)
  const addOtherCost = () => {
    if (!editedBillData) return;
    
    if (!editedBillData.billAnalysis.data.otherCosts) {
      editedBillData.billAnalysis.data.otherCosts = [];
    }
    
    editedBillData.billAnalysis.data.otherCosts.push({
      name: 'New Tax',
      percentage: 0,
      price: 0,
      calculateOnSubtotal: true // Default to calculating on subtotal
    });
    
    recalculateTotals();
    hasChanges = true;
  };

  // Remove discount
  const removeDiscount = (index) => {
    if (!editedBillData || !editedBillData.billAnalysis.data.billDiscounts) return;
    
    editedBillData.billAnalysis.data.billDiscounts.splice(index, 1);
    recalculateTotals();
    hasChanges = true;
  };

  // Remove other cost
  const removeOtherCost = (index) => {
    if (!editedBillData || !editedBillData.billAnalysis.data.otherCosts) return;
    
    editedBillData.billAnalysis.data.otherCosts.splice(index, 1);
    recalculateTotals();
    hasChanges = true;
  };

  // Save changes
  const saveChanges = () => {
    billData = JSON.parse(JSON.stringify(editedBillData));
    localStorage.setItem('billData', JSON.stringify(billData));
    isEditing = false;
    hasChanges = false;
    
    // Show save feedback
    showSaveFeedback = true;
    setTimeout(() => {
      showSaveFeedback = false;
    }, 3000);
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
    <FriendsPanel />
    <!-- Header Section -->
    <BillHeader 
      {billData}
      {editedBillData}
      {isEditing}
      {hasChanges}
      onToggleEdit={toggleEdit}
      onSaveChanges={saveChanges}
      onRestaurantEdit={handleRestaurantEdit}
    />

    <!-- Bill Content -->
    <div class="bill-content">
      <div class="container">
        <!-- Items Section -->
        <BillItemsList 
          items={editedBillData.billAnalysis.data.items}
          {isEditing}
          onItemEdit={handleItemEdit}
          {formatCurrency}
        />

        <!-- Total Section -->
        <BillSummary 
          billData={editedBillData}
          {isEditing}
          onDiscountEdit={handleDiscountEdit}
          onOtherCostEdit={handleOtherCostEdit}
          onAddDiscount={addDiscount}
          onAddOtherCost={addOtherCost}
          onRemoveDiscount={removeDiscount}
          onRemoveOtherCost={removeOtherCost}
          {formatCurrency}
        />
      </div>
    </div>

    <div class="spacer"></div>
    <!-- Save Feedback -->
    <SaveFeedback show={showSaveFeedback} />
  </div>
{:else}
  <NoBillData />
{/if}

<style lang="scss">
  @use '$lib/styles/abstracts' as *;

  .spacer {
    height: 100px;
  }

  .bill-detail-page {
    min-height: 100vh;
    background: $color-white;
    padding-top: $space-8;
  }

  .container {
    margin: 0 auto;
    padding: 0 $space-4;
    max-width: 1200px;
  }

  // Bill Content
  .bill-content {
    padding-bottom: $space-16;
  }

  // Responsive Design
  @media (max-width: $breakpoint-md) {
    .container {
      padding: 0 $space-3;
    }
  }
</style>
