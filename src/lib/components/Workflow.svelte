<script>
  import PhonePlaceholder from "./PhonePlaceholder.svelte";
  import Spacer from "./Spacer.svelte";
  import Stickers from "./Stickers.svelte";
  import AppButton from "./AppButton.svelte";
  import { gsap } from "gsap";
  import { onMount } from "svelte";
  import { app } from "$lib/shared.svelte";
  import Icon from "./Icon.svelte";
  const stickers = [
    {
      src: "/images/workflow-sticker/s-f-0.svg",
      alt: "Sticker 1",
      size: 150,
    },
    {
      src: "/images/workflow-sticker/s-f-1.svg",
      alt: "Sticker 2",
      size: 170,
    },
    {
      src: "/images/workflow-sticker/s-f-2.svg",
      alt: "Sticker 3",
      size: 130,
    },
    {
      src: "/images/workflow-sticker/s-f-3.svg",
      alt: "Sticker 4",
      size: 160,
    },
    {
      src: "/images/workflow-sticker/s-f-1.svg",
      alt: "Sticker 6",
      size: 180,
    },
    {
      src: "/images/workflow-sticker/s-f-2.svg",
      alt: "Sticker 7",
      size: 140,
    },
  ];

  const stickers2 = [
    {
      src: "/images/workflow-sticker/s-f-4.svg",
      alt: "Sticker 1",
      size: 150,
    },
    {
      src: "/images/workflow-sticker/s-f-5.svg",
      alt: "Sticker 2",
      size: 170,
    },
    {
      src: "/images/workflow-sticker/s-f-6.svg",
      alt: "Sticker 3",
      size: 130,
    },
    {
      src: "/images/workflow-sticker/s-f-7.svg",
      alt: "Sticker 4",
      size: 160,
    },
    {
      src: "/images/workflow-sticker/s-f-5.svg",
      alt: "Sticker 6",
      size: 180,
    },
    {
      src: "/images/workflow-sticker/s-f-6.svg",
      alt: "Sticker 7",
      size: 140,
    },
  ];

  const stickers3 = [
    {
      src: "/images/workflow-sticker/s-f-8.svg",
      alt: "Sticker 1",
      size: 150,
    },
    {
      src: "/images/workflow-sticker/s-f-9.svg",
      alt: "Sticker 2",
      size: 170,
    },
    {
      src: "/images/workflow-sticker/s-f-10.svg",
      alt: "Sticker 3",
      size: 130,
    },
    {
      src: "/images/workflow-sticker/s-f-11.svg",
      alt: "Sticker 4",
      size: 160,
    },
    {
      src: "/images/workflow-sticker/s-f-9.svg",
      alt: "Sticker 6",
      size: 180,
    },
    {
      src: "/images/workflow-sticker/s-f-10.svg",
      alt: "Sticker 7",
      size: 140,
    },
  ];

  let innerWidth = $state(0);

  let stickersRef = $state([]);
  let stickers2Ref = $state([]);
  let stickers3Ref = $state([]);
  let activeIndex = $state(0);

  onMount(() => {
    if (!app.isMobile) {
      stickersRef = document.querySelectorAll(".sticker");
      stickers2Ref = document.querySelectorAll(".sticker-sf");
      stickers3Ref = document.querySelectorAll(".sticker-sf-2");

      gsap.set(stickers2Ref, {
        x: innerWidth * 1.2,
        immediateRender: true,
      });
      gsap.set(stickers3Ref, {
        x: innerWidth * 1.2,
        immediateRender: true,
      });
    }
  });

  const handleNext = () => {
    if (app.isMobile) {
      return;
    }

    if (activeIndex == 2) {
      return;
    } else if (activeIndex == 0) {
      gsap.to(stickersRef, {
        duration: 0.5,
        stagger: 0.05,
        x: -(innerWidth * 1.2),
        ease: "back.in(10)",
      });

      gsap.to(stickers2Ref, {
        duration: 0.5,
        stagger: 0.05,
        x: 0,
        ease: "back.out(10)",
      });
    } else if (activeIndex == 1) {
      gsap.to(stickers2Ref, {
        duration: 0.5,
        stagger: 0.05,
        x: -(innerWidth * 1.2),
        ease: "back.in(10)",
      });

      gsap.to(stickers3Ref, {
        duration: 0.5,
        stagger: 0.05,
        x: 0,
        ease: "back.out(10)",
      });
    }

    activeIndex++;
  };

  const handleBack = () => {
    if (app.isMobile) {
      return;
    }

    if (activeIndex == 0) {
      return;
    } else if (activeIndex == 1) {
      gsap.to(stickersRef, {
        duration: 0.5,
        stagger: 0.05,
        x: 0,
        ease: "power2.inOut",
      });

      gsap.to(stickers2Ref, {
        duration: 0.5,
        stagger: 0.05,
        x: innerWidth * 1.2,
      });
    } else if (activeIndex == 2) {
      gsap.to(stickers3Ref, {
        duration: 0.5,
        stagger: 0.05,
        x: innerWidth * 1.2,
      });

      gsap.to(stickers2Ref, {
        duration: 0.5,
        stagger: 0.05,
        x: 0,
      });
    }

    activeIndex--;
  };
</script>

<svelte:window bind:innerWidth />

<div class="landing-workflow">
  <Spacer />
  <Icon name="Subtitle-2" />
  <div class="phone-wrapper">
    <AppButton classes="phone-navigation back-button" onclick={handleBack}>
      <Icon name="BackArrow" />
    </AppButton>
    <PhonePlaceholder>
      <h1>Item 1</h1>
    </PhonePlaceholder>
    <AppButton classes="phone-navigation next-button" onclick={handleNext}>
      <Icon name="NextArrow" />
    </AppButton>
  </div>
  <Stickers {stickers} {stickers2} {stickers3} />
</div>
