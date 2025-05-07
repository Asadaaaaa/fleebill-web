<script>
    import { onMount } from "svelte";
    export let name;

    let iconComponent;
      const getIcon = async () => {
        iconComponent = (await import(`../../lib/components/Icons/${name}.svelte`)).default
    }

  onMount(async () => await getIcon())
</script>

{#if iconComponent}
    <svelte:component this={iconComponent} />
{/if}
