<script>
    let { classes, children, onclick } = $props()
</script>

<div class="btn {classes}" onclick={onclick} role="presentation">
    <div class="foreground">
        {@render children()}
    </div>
    <div class="background">
    </div>
</div>
