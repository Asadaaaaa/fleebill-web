<script>
  import { onMount } from "svelte";
  import { gsap } from "gsap";

  let footerElement;

  onMount(() => {
    // Simple fade-in animation
    gsap.from(footerElement, {
      duration: 1.5,
      y: 20,
      ease: "expo.out",
    });
  });
</script>

<footer bind:this={footerElement} class="footer">
  <div class="footer-container">
    <div class="footer-content">
      <div class="footer-brand">
        <h1>FleeBill</h1>

        <p class="footer-tagline">
          Don't let your friend <span class="flee">Flee</span> From Their
          <span class="accent">Bill</span>
        </p>
      </div>

      <div class="footer-links">
        <div class="link-group">
          <h4>Resources</h4>
          <a href="/blog">Blog</a>
          <a href="/help">Help Center</a>
          <a href="/faqs">FAQs</a>
        </div>

        <div class="link-group">
          <h4>Legal</h4>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="copyright">
        © {new Date().getFullYear()} FleeBill. All rights reserved.
      </p>
      <div class="social-links">
        <a href="/" aria-label="Twitter">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><path
              d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
            ></path></svg
          >
        </a>
        <a href="/" aria-label="Instagram">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path
              d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
            ></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg
          >
        </a>
        <a href="/" aria-label="LinkedIn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><path
              d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
            ></path><rect x="2" y="9" width="4" height="12"></rect><circle
              cx="4"
              cy="4"
              r="2"
            ></circle></svg
          >
        </a>
      </div>
    </div>
  </div>
</footer>
