<script>
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import AppButton from "$lib/components/AppButton.svelte";
  import Icon from "$lib/components/Icon.svelte";
  import ErrorHandler from "$lib/components/ErrorHandler.svelte";
  import { handleApiError } from "$lib/utils/error-handler";

  let topLeft = $state(null);
  let bottomRight = $state(null);
  let topRight = $state(null);
  let bottomLeft = $state(null);

  // Bill reader state
  let isAnalyzing = $state(false);
  let billResult = $state(null);
  let error = $state(null);
  let file = $state(null);

  // Reference to hidden file input
  let fileInput;

  const curve = "expo.out";
  const duration = 2;

  const handleStickers = () => {
    gsap.from(topLeft, { duration, xPercent: -100, yPercent: -100, ease: curve });
    gsap.from(bottomRight, { duration, xPercent: 100, yPercent: 100, ease: curve });
    gsap.from(topRight, { duration, xPercent: 100, yPercent: -100, ease: curve });
    gsap.from(bottomLeft, { duration, xPercent: -100, yPercent: 100, ease: curve });
  };

  const handleTexts = () => {
    const texts = document.querySelectorAll(".text");
    gsap.from(texts, { duration, opacity: 0, y: 20, stagger: 0.2, ease: curve });
  };

  const handleButton = () => {
    const button = document.querySelector(".button");
    gsap.from(button, { duration, opacity: 0, y: 20, ease: curve });
  };

  // Trigger file picker when button is clicked
  const openImagePicker = () => {
    fileInput.click();
  };

  // Handle file selection
  const handleFileChange = async (event) => {
    const target = event.target;
    if (target.files && target.files[0]) {
      const selectedFile = target.files[0];
      
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        error = 'Please select an image file';
        return;
      }
      
      file = selectedFile;
      await readBill();
    }
  };

  const readBill = async () => {
    if (!file) {
      error = "Please select an image first";
      return;
    }

    isAnalyzing = true;
    error = null;
    billResult = null;

    try {
      // Create FormData to send to the API endpoint
      const formData = new FormData();
      formData.append('image', file);

      // Call the API endpoint instead of the service directly
      const response = await fetch('/api/bill-reader', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      billResult = data;
      console.log("Bill analysis result:", data);
    } catch (err) {
      const apiError = handleApiError(err);
      error = apiError.message;
      console.error("Error analyzing bill:", apiError);
    } finally {
      isAnalyzing = false;
    }
  };

  const handleRetry = () => {
    error = null;
    if (file) {
      readBill();
    }
  };

  const handleCloseError = () => {
    error = null;
  };

  onMount(() => {
    handleStickers();
    handleTexts();
    handleButton();
  });
</script>

<div class="landing-hero">
  <div class="stickers">
    <div class="top-left" bind:this={topLeft}><img src="/svg/top-left.svg" alt="" /></div>
    <div class="bottom-right" bind:this={bottomRight}><img src="/svg/bottom-right.svg" alt="" /></div>
    <div class="top-right" bind:this={topRight}><img src="/svg/top-right.svg" alt="" /></div>
    <div class="bottom-left" bind:this={bottomLeft}><img src="/svg/bottom-left.svg" alt="" /></div>
  </div>

  <h1>
    <span class="text">Don't</span>
    <span class="text flee">Flee</span>
    <span class="text">From<br /></span>
    <span class="text">Your</span>
    <span class="text bill">Bill</span>
  </h1>

  <!-- Hidden File Input -->
  <input
    type="file"
    accept="image/*"
    bind:this={fileInput}
    onchange={handleFileChange}
    style="display: none;"
  />

  <!-- Button triggers image picker -->
  <AppButton classes="button" onclick={openImagePicker}>
    <Icon name="Bill" />
  </AppButton>

  <!-- Error Handler -->
  <ErrorHandler 
    error={error} 
    onRetry={handleRetry}
    onClose={handleCloseError}
  />
</div>
