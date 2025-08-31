<script>
  import { page } from '$app/stores';
  import AppButton from '$lib/components/AppButton.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import { goto } from '$app/navigation';

  // Get breakdown data from URL params or localStorage
  let breakdownData = [];
  let billData = null;

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate total
  $: totalAmount = breakdownData.reduce((sum, friend) => sum + friend.totalOwed, 0);

  // Go back to bill detail
  const goBack = () => {
    goto('/bill-detail');
    // console.log(breakdownData);
  };

  // Share breakdown
  const shareBreakdown = () => {
    const text = breakdownData.map(friend => 
      `${friend.name}: ${formatCurrency(friend.totalOwed)}`
    ).join('\n') + `\n\nTotal: ${formatCurrency(totalAmount)}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Bill Breakdown',
        text: text
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert('Breakdown copied to clipboard!');
    }
  };

  // Load data on mount
  import { onMount } from 'svelte';
  
  onMount(() => {
    // Try to get data from URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const breakdownParam = urlParams.get('breakdown');
    
    if (breakdownParam) {
      try {
        breakdownData = JSON.parse(decodeURIComponent(breakdownParam));
      } catch (e) {
        console.error('Failed to parse breakdown data:', e);
      }
    } else {
      // Fallback to localStorage
      const stored = localStorage.getItem('billBreakdown');
      if (stored) {
        try {
          breakdownData = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse stored breakdown data:', e);
        }
      }
    }

    // Load bill data
    const storedBillData = localStorage.getItem('finalBillData');
    if (storedBillData) {
      try {
        billData = JSON.parse(storedBillData);
      } catch (e) {
        console.error('Failed to parse stored bill data:', e);
      }
    }
  });
</script>

<div class="bill-breakdown-page">
  <!-- Header -->
  <div class="header">
    <div class="container">
      <div class="header-content">
        <button class="back-button" onclick={goBack}>
          <Icon name="BackArrow" />
        </button>
        <h1 class="page-title">Bill Breakdown</h1>
        <button class="share-button" onclick={shareBreakdown}>
          <Icon name="Share" />
        </button>
      </div>
    </div>
  </div>

  <!-- Content -->
  <div class="content">
    <div class="container">
      <!-- Restaurant Info -->
      {#if billData}
        <div class="restaurant-info">
          <h2 class="restaurant-name">{billData.data.name}</h2>
          <p class="restaurant-date">
            {new Date(billData.data.billDate).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      {/if}

      <!-- Friends Breakdown -->
      <div class="friends-breakdown">
        <h3 class="section-title">Split Summary</h3>
        
        <div class="friends-grid">
          {#each breakdownData as friend, index}
            <div class="friend-card" style="--delay: {index * 0.1}s">
              <div class="friend-header">
                <div class="friend-avatar" 
                  style="background-image: url('/images/placeholder/placeholder_{friend.id}.webp'); background-size: cover; background-position: center;"
                >
                </div>
                <div class="friend-info">
                  <h4 class="friend-name">{friend.name}</h4>
                  <p class="friend-role">Owes</p>
                </div>
              </div>
              
              <div class="friend-breakdown">
                <div class="breakdown-row">
                  <span class="label">Items:</span>
                  <span class="amount">{formatCurrency(friend.itemSubtotal)}</span>
                </div>
                
                {#if friend.shareOfCosts > 0}
                  <div class="breakdown-row">
                    <span class="label">Fees:</span>
                    <span class="amount">{formatCurrency(friend.shareOfCosts)}</span>
                  </div>
                {/if}
                
                {#if friend.shareOfDiscounts > 0}
                  <div class="breakdown-row discount">
                    <span class="label">Discount:</span>
                    <span class="amount">-{formatCurrency(friend.shareOfDiscounts)}</span>
                  </div>
                {/if}
                
                <div class="breakdown-row total">
                  <span class="label">Total:</span>
                  <span class="amount">{formatCurrency(friend.totalOwed)}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Total Summary -->
      <div class="total-summary">
        <div class="total-card">
          <div class="total-header">
            <h3 class="total-title">Total Bill</h3>
          </div>
          <div class="total-amount">
            {formatCurrency(totalAmount)}
          </div>
          <p class="total-subtitle">Split among {breakdownData.length} {breakdownData.length === 1 ? 'person' : 'people'}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="actions">
        <AppButton onclick={goBack} variant="secondary">
          Back
        </AppButton>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use '$lib/styles/abstracts' as *;

  .bill-breakdown-page {
    min-height: 100vh;
    background: linear-gradient(135deg, $color-gray-100 0%, $color-white 100%);
    padding-bottom: $space-16;
  }

  .header {
    background: $color-white;
    border-bottom: 1px solid $color-gray-200;
    padding: $space-4 0;
    position: sticky;
    top: 0;
    z-index: $z-index-sticky;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
  }

  .back-button, .share-button {
    background: none;
    border: none;
    padding: $space-2;
    border-radius: $border-radius;
    cursor: pointer;
    transition: all 0.2s ease;
    color: $color-gray-700;

    &:hover {
      background: $color-gray-100;
      color: $color-gray-900;
    }
  }

  .page-title {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    margin: 0;
  }

  .content {
    padding-top: $space-6;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 $space-4;
  }

  .restaurant-info {
    text-align: center;
    margin-bottom: $space-8;
    padding: $space-6;
    background: $color-white;
    border-radius: $border-radius-lg;
    box-shadow: $box-shadow;
  }

  .restaurant-name {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    margin: 0 0 $space-2 0;
  }

  .restaurant-date {
    font-size: $font-size-sm;
    color: $color-gray-600;
    margin: 0;
  }

  .section-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    margin: 0 0 $space-6 0;
    text-align: center;
  }

  .friends-grid {
    display: grid;
    gap: $space-4;
    margin-bottom: $space-8;
  }

  .friend-card {
    background: $color-white;
    border-radius: $border-radius-lg;
    padding: $space-6;
    box-shadow: $box-shadow;
    border: 1px solid $color-gray-200;
    animation: slideIn 0.5s ease-out forwards;
    animation-delay: var(--delay, 0s);
    opacity: 0;
    transform: translateY(20px);
  }

  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .friend-header {
    display: flex;
    align-items: center;
    gap: $space-4;
    margin-bottom: $space-4;
  }

  .friend-avatar {
    width: 48px;
    height: 48px;
    border-radius: $border-radius-full;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: $font-weight-bold;
    color: $color-white;
    font-size: $font-size-lg;
  }

  .friend-info {
    flex: 1;
  }

  .friend-name {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-gray-900;
    margin: 0 0 $space-1 0;
  }

  .friend-role {
    font-size: $font-size-sm;
    color: $color-gray-600;
    margin: 0;
  }

  .friend-breakdown {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  .breakdown-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-2 0;

    &.total {
      border-top: 1px solid $color-gray-200;
      padding-top: $space-3;
      margin-top: $space-2;
      font-weight: $font-weight-semibold;
      font-size: $font-size-lg;
      color: $color-gray-900;
    }

    &.discount {
      color: $color-success;
    }
  }

  .label {
    color: $color-gray-600;
    font-size: $font-size-sm;
  }

  .amount {
    font-weight: $font-weight-medium;
    color: $color-gray-900;
  }

  .total-summary {
    margin-bottom: $space-8;
  }

  .total-card {
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 100%);
    border-radius: $border-radius-lg;
    padding: $space-6;
    text-align: center;
    box-shadow: $box-shadow-lg;
  }

  .total-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-on-primary;
    margin: 0 0 $space-2 0;
  }

  .total-amount {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $color-on-primary;
    margin: 0 0 $space-2 0;
  }

  .total-subtitle {
    font-size: $font-size-sm;
    color: $color-on-primary;
    opacity: 0.8;
    margin: 0;
  }

  .actions {
    display: flex;
    gap: $space-4;
    justify-content: center;
    flex-wrap: wrap;
  }

  // Responsive design
  @media (min-width: 768px) {
    .friends-grid {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .actions {
      flex-direction: row;
    }
  }

  @media (max-width: 480px) {
    .friend-card {
      padding: $space-4;
    }

    .total-amount {
      font-size: $font-size-2xl;
    }

    .actions {
      flex-direction: column;
    }
  }
</style>
