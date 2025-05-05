<script>
    import Spacer from '$lib/components/Spacer.svelte';
    import HighlightCard from '$lib/components/HighlightCard.svelte';


    const highlights = [
        {
            title: 'Smart & Scan',
            description: 'Point your camera at any receipt—handwritten or printed—and FleeBill’s AI-enhanced scanner instantly captures, corrects, and digitizes every line item so you can move straight to splitting the bill in seconds',
            color: ['--color-primary', '--color-primary-dark'],
            image: '/svg/highlight-1.svg'
        },
        {
            title: 'Quick Fix Assist',
            description: 'See a typo? Just tap, edit in place, and FleeBill’s suggestion engine learns as you go—no tedious modes or menus required',
            color: ['--color-accent-1', '--color-accent-1-dark'],
            image: '/svg/highlight-2.svg'
        },
        {
            title: 'Split & Settle Pro',
            description: 'Review each person’s share in a clean list or chart, then tap “Settle Up” to send instant payment links—so you all wrap up in style',
            color: ['--color-secondary', '--color-secondary-dark'],
            image: '/svg/highlight-3.svg'
        }
    ]
</script>

<div class="landing-highlight">
    <Spacer />
    <h1 class="text-center">Highlight<br>Hoopla</h1>
    {#each highlights as highlight}
        <HighlightCard color={highlight.color} image={highlight.image} title={highlight.title} description={highlight.description} />
    {/each}
</div>