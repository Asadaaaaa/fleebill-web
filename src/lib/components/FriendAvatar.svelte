<script>
  let {id} = $props();
</script>

<div class="friend-avatar" style="background-image: url('/images/placeholder/placeholder_{id}.webp'); background-size: cover; background-position: center;"></div>

<style lang="scss">
  @use "$lib/styles/abstracts" as *;

  .friend-avatar {
    @include flex(row, center, center);
    width: 40px;
    height: 40px;
    border-radius: $border-radius-full;
    color: $color-gray-900;
    font-family: $font-family-primary;
    font-weight: $font-weight-bold;
    font-size: $font-size-sm;
    aspect-ratio: 1;
  }
</style>
