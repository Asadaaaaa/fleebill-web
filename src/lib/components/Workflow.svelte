<script>
  import PhonePlaceholder from "./PhonePlaceholder.svelte";
  import Spacer from "./Spacer.svelte";
  import Stickers from "./Stickers.svelte";
  import AppButton from "./AppButton.svelte";
  import { gsap } from "gsap";

  let innerWidth = $state(0);

  const handleNext = () => {
    const stickers = document.querySelectorAll(".sticker");

    gsap.to(stickers, {
      duration: .5,
      stagger: 0.05,
      x: -(innerWidth * 1.1),
      ease: "back.in(10)",
    });
  };

  const handleBack = () => {
    const stickers = document.querySelectorAll(".sticker");
    gsap.to(stickers, {
      duration: 1,
      stagger: 0.05,
      x: 0,
      ease: 'power2.inOut',
    });
  };
</script>

<svelte:window bind:innerWidth />

<div class="landing-workflow">
  <Spacer />
  <h2>Workflow</h2>
  <div class="phone-wrapper">
    <AppButton class="phone-navigation back-button" onclick={handleBack}>
      <h5>Back</h5>
    </AppButton>
    <PhonePlaceholder>
      <h1>Item 1</h1>
    </PhonePlaceholder>
    <AppButton class="phone-navigation next-button" onclick={handleNext}>
      <h5>Next</h5>
    </AppButton>
  </div>
  <Stickers />
</div>
