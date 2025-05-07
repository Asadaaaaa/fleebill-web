<script>
  import PhonePlaceholder from "./PhonePlaceholder.svelte";
  import Spacer from "./Spacer.svelte";
  import Stickers from "./Stickers.svelte";
  import AppButton from "./AppButton.svelte";
  import { gsap } from "gsap";
  import { onMount } from "svelte";
  import { app } from "$lib/shared.svelte";
  import Icon from "./Icon.svelte";
  import PhoneScreen from "./PhoneScreen.svelte";
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

  let phoneScreenRef = $state(null);
  let timeline1;
  let timeline2;

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

      // Initialize timelines
      timeline1 = gsap.timeline({ paused: true });
      timeline2 = gsap.timeline({ paused: true });

      // Setup timeline1 (first transition)
      timeline1.to(stickersRef, {
        duration: 0.5,
        stagger: 0.05,
        x: -(innerWidth * 1.2),
        ease: "back.in(10)",
      }).to(stickers2Ref, {
        duration: 0.5,
        stagger: 0.05,
        x: 0,
        ease: "back.out(10)",
      });

      // Setup timeline2 (second transition)
      timeline2.to(stickers2Ref, {
        duration: 0.5,
        stagger: 0.05,
        x: -(innerWidth * 1.2),
        ease: "back.in(10)",
      }).to(stickers3Ref, {
        duration: 0.5,
        stagger: 0.05,
        x: 0,
        ease: "back.out(10)",
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
      phoneScreenRef.playTimeline1();
      timeline1.play();
    } else if (activeIndex == 1) {
      timeline2.play();
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
      phoneScreenRef.reverseTimeline1();
      timeline1.reverse();
    } else if (activeIndex == 2) {
      timeline2.reverse();
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
      <PhoneScreen bind:this={phoneScreenRef} />
    </PhonePlaceholder>
    <AppButton classes="phone-navigation next-button" onclick={handleNext}>
      <Icon name="NextArrow" />
    </AppButton>
  </div>
  <Stickers {stickers} {stickers2} {stickers3} />
</div>
