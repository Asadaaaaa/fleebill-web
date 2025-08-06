<script>
  import FriendAvatar from "./FriendAvatar.svelte";
  import { bill } from "$lib/shared.svelte";

  let newFriendName = $state("");
  let isAddingFriend = $state(false);
  let showModal = $state(false);
  let internalFriends = $state([]);
  let onFriendsChange;  

  // Initialize with "Me" if friends array is empty
  $effect(() => {
    if (internalFriends.length === 0) {
      const meUser = {
        id: 897,
        name: "Me",
      };
      internalFriends = [meUser];
      onFriendsChange?.(internalFriends);
    }
  });

  $effect(() => {
    //assign internal friends to global state
    if (internalFriends) {
      bill.friends = internalFriends;
    }
  });

  const openAddFriendModal = () => {
    showModal = true;
    newFriendName = "";

    // Auto-focus the input after modal opens
    setTimeout(() => {
      const input = document.getElementById("friend-name");
      if (input) {
        input.focus();
      }
    }, 100);
  };

  const closeModal = () => {
    showModal = false;
    newFriendName = "";
  };

  const addFriend = () => {
    if (newFriendName.trim()) {
      const newFriend = {
        id: 897 + internalFriends.length,
        name: newFriendName.trim(),
      };

      internalFriends = [...internalFriends, newFriend];
      onFriendsChange?.(internalFriends);

      closeModal();
    }
  };

  const removeFriend = (friendId) => {
    // Don't allow removing "Me"
    if (friendId === 897) return;

    internalFriends = internalFriends.filter(
      (friend) => friend.id !== friendId
    );
    onFriendsChange?.(internalFriends);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addFriend();
    }
  };
</script>

<div class="friends-panel">
  <div class="panel-header">
    <h3 class="panel-title">Friends</h3>
    <button
      class="add-friend-btn"
      onclick={openAddFriendModal}
      aria-label="Add friend"
    >
      <span class="btn-icon">+</span>
    </button>
  </div>

  <div class="friends-list">
    {#each internalFriends as friend, index (friend.id)}
      <div class="friend-item" class:me-user={friend.id === 897}>
        <FriendAvatar id={897 + index} />
        <div class="friend-info">
          <span class="friend-name">{friend.name}</span>
        </div>
        <button
          class="remove-friend-btn"
          onclick={() => removeFriend(friend.id)}
          aria-label="Remove {friend.name}"
          disabled={friend.id === 897}
        >
          <span class="remove-icon">×</span>
        </button>
      </div>
    {/each}
  </div>
</div>

{#if showModal}
  <div class="modal-overlay" onclick={closeModal} role="presentation">
    <div
      class="modal-content"
      onclick={(e) => e.stopPropagation()}
      role="presentation"
    >
      <div class="modal-header">
        <h3 class="modal-title">Add Friend</h3>
        <button class="modal-close-btn" onclick={closeModal}>
          <span class="close-icon">×</span>
        </button>
      </div>

      <div class="modal-body">
        <div class="input-group">
          <label for="friend-name" class="input-label">Friend's Name</label>
          <input
            id="friend-name"
            type="text"
            class="friend-name-input"
            placeholder="Enter friend's name"
            bind:value={newFriendName}
            onkeypress={handleKeyPress}
          />
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-btn" onclick={closeModal}> Cancel </button>
        <button
          class="confirm-btn"
          onclick={addFriend}
          disabled={!newFriendName.trim()}
        >
          Add Friend
        </button>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use "$lib/styles/abstracts" as *;

  .friends-panel {
    background: $color-gray-900;
    padding: $space-4 0 $space-4 0;
    box-shadow: $box-shadow;
    position: fixed;
    bottom: 0;
    z-index: 1000;
    width: 100vw;
    display: flex;
    flex-direction: column;
    gap: $space-4;
    overflow-y: visible;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 $space-4;
  }

  .panel-title {
    @include heading(h4);
    color: $color-white;
    margin: 0;
  }

  .add-friend-btn {
    @include flex(row, center, center);
    width: 40px;
    height: 40px;
    background: $color-primary;
    border: none;
    border-radius: $border-radius-full;
    color: $color-white;
    cursor: pointer;
  }

  .btn-icon {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    line-height: 1;
  }

  .friends-list {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: visible;
    width: 100%;

    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
  .friend-item {
    display: flex;
    align-items: center;
    gap: $space-4;
    padding: $space-2;
    background: $color-gray-900;
    border-radius: $border-radius;
    border: 1px solid $color-gray-800;
    margin-left: $space-4;


    &.me-user {
      background: $color-primary-light;
      border-color: $color-primary;

      .friend-name {
        font-weight: $font-weight-semibold;
        color: $color-gray-900;
      }
    }
  }

  .friend-name {
    font-family: $font-family-primary;
    font-weight: $font-weight-medium;
    color: $color-white;
    font-size: $font-size-base;
  }

  .remove-friend-btn {
    @include flex(row, center, center);
    width: 28px;
    height: 28px;
    background: $color-danger;
    border: none;
    border-radius: $border-radius-full;
    color: $color-gray-900;
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.7;

    &:hover:not(:disabled) {
      opacity: 1;
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      background: $color-gray-400;
    }
  }

  .remove-icon {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    line-height: 1;
  }

  // Modal Styles
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba($color-black, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: $space-4;
  }

  .modal-content {
    background: $color-white;
    border-radius: $border-radius-lg;
    box-shadow: $box-shadow-xl;
    max-width: 400px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
  }

  .modal-header {
    @include flex(row, space-between, center);
    padding: $space-6;
    border-bottom: 1px solid $color-gray-200;
  }

  .modal-title {
    @include heading(h4);
    color: $color-gray-900;
    margin: 0;
  }

  .modal-close-btn {
    @include flex(row, center, center);
    width: 32px;
    height: 32px;
    background: $color-gray-200;
    border: none;
    border-radius: $border-radius-full;
    color: $color-gray-700;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: $color-gray-300;
      color: $color-gray-900;
    }
  }

  .close-icon {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    line-height: 1;
  }

  .modal-body {
    padding: $space-6;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  .input-label {
    font-family: $font-family-primary;
    font-weight: $font-weight-medium;
    color: $color-gray-700;
    font-size: $font-size-sm;
  }

  .friend-name-input {
    padding: $space-3 $space-4;
    border: 1px solid $color-gray-300;
    border-radius: $border-radius;
    font-family: $font-family-primary;
    font-size: $font-size-base;
    background: $color-white;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
    }

    &::placeholder {
      color: $color-gray-500;
    }
  }

  .modal-footer {
    @include flex(row, flex-end, center);
    gap: $space-3;
    padding: $space-6;
    border-top: 1px solid $color-gray-200;
  }

  .cancel-btn {
    padding: $space-3 $space-4;
    background: $color-gray-200;
    color: $color-gray-700;
    border: none;
    border-radius: $border-radius;
    font-family: $font-family-primary;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: $color-gray-300;
      color: $color-gray-900;
    }
  }

  .confirm-btn {
    padding: $space-3 $space-4;
    background: $color-primary;
    color: $color-white;
    border: none;
    border-radius: $border-radius;
    font-family: $font-family-primary;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: $color-primary-hover;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  @include respond-to(sm) {
    .friends-panel {
      min-width: 100vw;
    }

    .modal-content {
      max-width: 450px;
    }
  }
</style>
