<script>
  import { bill } from "$lib/shared.svelte";
  let { id, item, itemIndex } = $props();

  const handleClick = () => {
    bill.friends = bill.friends.map((friend) => {
      if (friend.id === id) {
        if (friend.items.some((item) => item.itemIndex === itemIndex)) {
          friend.items = friend.items.filter(
            (item) => item.itemIndex !== itemIndex
          );
        } else {
          friend.items.push({ item, itemIndex });
        }
      }
      return friend;
    });

    console.log(bill.friends);
  };

  let isSelected = $derived(
    bill.friends.some((friend) =>
      friend.items.some((item) => item.itemIndex === itemIndex)
    )
  );
</script>

<div
  onclick={handleClick}
  class:selected={isSelected}
  role="presentation"
  class="friend-avatar"
  style="background-image: url('/images/placeholder/placeholder_{id}.webp'); background-size: cover; background-position: center;"
>
  {#if isSelected}
    <div class="selected-overlay">
      <div class="check-icon">✓</div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$lib/styles/abstracts" as *;

  .friend-avatar {
    @include flex(row, center, center);
    width: 40px;
    height: 40px;
    cursor: pointer;
    border-radius: $border-radius-full;
    color: $color-gray-900;
    font-family: $font-family-primary;
    font-weight: $font-weight-bold;
    font-size: $font-size-sm;
    aspect-ratio: 1;
    transition: transform 0.2s ease, border 0.2s ease;
    position: relative;

    &.selected {
      border: 4px solid $color-primary;
      transition: transform 0.2s ease, border 0.2s ease;
    }
  }

  .selected-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color-primary, 0.4);
    border-radius: $border-radius-full;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .check-icon {
    color: white;
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
</style>
