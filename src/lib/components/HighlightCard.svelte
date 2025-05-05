<script>
    import Spacer from '$lib/components/Spacer.svelte';

    let {title, description, color, image} = $props()
</script>

<div class="highlight-card" style={`background-color: var(${color[0]})`}>
    <h1 style={`color: var(${color[1]})`}>{title}</h1>
    <p>{description}</p>
    <Spacer size={24} />
    <img src={image} alt="Highlight Card">
</div>
