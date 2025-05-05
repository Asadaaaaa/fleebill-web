<script>
    let { classes, children } = $props()
</script>

<div class="btn {classes}">
    <div class="foreground">
        {@render children()}
    </div>
    <div class="background">
    </div>
</div>
