<script>
  import { onMount } from 'svelte';
  import BillHeader from '$lib/components/BillHeader.svelte';
  import BillItemsList from '$lib/components/BillItemsList.svelte';
  import BillSummary from '$lib/components/BillSummary.svelte';
  import FeedBack from '$lib/components/FeedBack.svelte';
  import NoBillData from '$lib/components/NoBillData.svelte';
  import FriendsPanel from '$lib/components/FriendsPanel.svelte';
  import AppButton from '$lib/components/AppButton.svelte';
  import { bill } from '$lib/shared.svelte';
  // Bill data state
  let billData = $state(null);
  let editedBillData = $state(null);
  let isEditing = $state(false);
  let hasChanges = $state(false);
  let showSaveFeedback = $state(false);
  let showErrorFeedback = $state(false);
  let error = $state(null);
  let finalBillData = $state(null);
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

  const validateBill = () => {
    if(editedBillData.billAnalysis.data.items.length === 0) {
      error = 'Please add at least one item';
      return false;
    }
    
    // Check if every item is assigned to at least one friend
    const allItemsAssigned = editedBillData.billAnalysis.data.items.every((item, itemIndex) => {
      // Check if this item index exists in any friend's items array
      return bill.friends.some(friend => 
        friend.items.some(friendItem => friendItem.itemIndex === itemIndex)
      );
    });
    
    if(!allItemsAssigned) {
      error = 'Please assign all items to at least one friend';
      return false;
    }
    
    return allItemsAssigned;
  };

  const calculateBillBreakdown = (data) => {
    // Step 1: Calculate Subtotals
    const friendSubtotals = {};
    
    // Initialize subtotals for all friends
    data.items.forEach(item => {
      item.friends.forEach(friendName => {
        if (!friendSubtotals[friendName]) {
          friendSubtotals[friendName] = 0;
        }
      });
    });
    
    // Calculate item subtotals for each friend
    data.items.forEach(item => {
      const costPerPerson = Math.round(item.totalPrice / item.friends.length);
      let distributedCost = 0;
      
      // Distribute cost to all friends except the last one
      for (let i = 0; i < item.friends.length - 1; i++) {
        const friendName = item.friends[i];
        friendSubtotals[friendName] += costPerPerson;
        distributedCost += costPerPerson;
      }
      
      // Last friend gets the remainder to ensure perfect sum
      const lastFriendName = item.friends[item.friends.length - 1];
      const remainder = item.totalPrice - distributedCost;
      friendSubtotals[lastFriendName] += remainder;
    });
    
    // Step 2: Calculate totals
    const totalSubtotal = Object.values(friendSubtotals).reduce((sum, subtotal) => sum + subtotal, 0);
    const totalOtherCosts = data.otherCosts.reduce((sum, cost) => sum + cost.price, 0);
    const totalDiscounts = data.billDiscounts ? data.billDiscounts.reduce((sum, discount) => sum + discount.value, 0) : 0;
    
    // Step 3: Distribute costs and discounts proportionally with proper rounding
    const friendNames = Object.keys(friendSubtotals);
    const friendBills = [];
    
    // First pass: calculate shares for all except the last friend
    for (let i = 0; i < friendNames.length - 1; i++) {
      const friendName = friendNames[i];
      const itemSubtotal = friendSubtotals[friendName];
      
      // Calculate proportional shares
      const costRatio = itemSubtotal / totalSubtotal;
      const discountRatio = itemSubtotal / totalSubtotal;
      
      const shareOfCosts = Math.round(costRatio * totalOtherCosts);
      const shareOfDiscounts = Math.round(discountRatio * totalDiscounts);
      const totalOwed = itemSubtotal + shareOfCosts - shareOfDiscounts;
      
      friendBills.push({
        name: friendName,
        itemSubtotal,
        shareOfCosts,
        shareOfDiscounts,
        totalOwed
      });
    }
    
    // Second pass: handle the last friend with remainder method
    const lastFriendName = friendNames[friendNames.length - 1];
    const lastItemSubtotal = friendSubtotals[lastFriendName];
    
    const distributedCosts = friendBills.reduce((sum, bill) => sum + bill.shareOfCosts, 0);
    const distributedDiscounts = friendBills.reduce((sum, bill) => sum + bill.shareOfDiscounts, 0);
    
    const shareOfCosts = totalOtherCosts - distributedCosts;
    const shareOfDiscounts = totalDiscounts - distributedDiscounts;
    const totalOwed = lastItemSubtotal + shareOfCosts - shareOfDiscounts;
    
    friendBills.push({
      name: lastFriendName,
      itemSubtotal: lastItemSubtotal,
      shareOfCosts,
      shareOfDiscounts,
      totalOwed
    });
    
    // Step 4: Final sanity check
    const calculatedTotal = friendBills.reduce((sum, bill) => sum + bill.totalOwed, 0);
    if (calculatedTotal !== data.billTotalPrice) {
      console.warn(`Total mismatch: calculated ${calculatedTotal}, expected ${data.billTotalPrice}`);
    }
    
    return friendBills;
  };

  const splitBill = () => {
    console.log('Validating bill...');
    console.log('Items:', editedBillData.billAnalysis.data.items);
    console.log('Friends:', bill.friends);
    
    if(validateBill()) {
      let finalItems = editedBillData.billAnalysis.data.items.map((item, itemIndex) => {
        // Find all friends who have this item
        const friendsWithThisItem = bill.friends.filter(friend => 
          friend.items.some(friendItem => friendItem.itemIndex === itemIndex)
        );
 
        return {
          ...item,
          friends: friendsWithThisItem.map(friend => friend.name)
        };
      });
      finalBillData = {data: { ...editedBillData.billAnalysis.data, items: finalItems }};
      
      // Calculate bill breakdown
      const breakdown = calculateBillBreakdown(finalBillData.data);
      console.log('Bill Breakdown:', breakdown);
      
      // Store data and navigate to breakdown page
      localStorage.setItem('billBreakdown', JSON.stringify(breakdown));
      localStorage.setItem('finalBillData', JSON.stringify(finalBillData));
      
      // Navigate to breakdown page
      const breakdownParam = encodeURIComponent(JSON.stringify(breakdown));
      window.location.href = `/bill-breakdown?breakdown=${breakdownParam}`;
    } else {
      console.log('Bill is invalid:', error);
      showErrorFeedback = true;
      setTimeout(() => {
        showErrorFeedback = false;
        error = null;
      }, 3000);
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
        
      <div class="split-bill-button">
        <AppButton onclick={splitBill}>
          <h1>Split</h1>
        </AppButton>
      </div>
    </div>

    <div class="spacer"></div>
    <!-- Save Feedback -->
    <FeedBack show={showSaveFeedback} type={'success'} message={'Changes saved successfully!'} />
    <FeedBack show={showErrorFeedback} type={'error'} message={error} />
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

  .split-bill-button {
    width: 100%;
    margin: 0 auto;
    padding: 0 $space-4;
    margin-top: $space-4;
    max-width: 1200px;

    h1 {
      font-size: $font-size-2xl;
    }
  }

  // Responsive Design
  @media (max-width: $breakpoint-md) {
    .container {
      padding: 0 $space-3;
    }
  }
</style>
