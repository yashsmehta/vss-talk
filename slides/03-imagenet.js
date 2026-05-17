export default {
  steps: 2,
  html: `
    <section class="slide granularity-slide">
      <h1>Granularity of the feedback signal for training neural networks</h1>

      <figure class="granularity-figure" aria-label="Feedback granularity scale from coarser to finer learning signals">
        <div class="granularity-axis" aria-hidden="true">
          <span class="axis-line"></span>
          <span class="axis-arrow"></span>
          <span class="axis-label axis-label-left">coarser feedback</span>
          <span class="axis-label axis-label-right">finer feedback</span>
        </div>

        <div class="granularity-items">
          <article class="granularity-item coarse step step-2">
            <div class="granularity-visual two-class-visual">
              <svg viewBox="35 32.85 318 304.3" role="img" aria-label="Two coarse classes from the PCA split">
                <image href="images/pca_method.svg" width="708.017187" height="373.494687"/>
              </svg>
            </div>
            <p class="granularity-title">2 classes</p>
            <p class="granularity-source">ImageNet</p>
          </article>

          <article class="granularity-item imagenet">
            <div class="granularity-visual imagenet-visual">
              <img src="images/imagenet_1000.svg" alt="">
            </div>
            <p class="granularity-title">1,000 classes</p>
            <p class="granularity-source">ImageNet</p>
          </article>

          <article class="granularity-item self-supervised step step-1">
            <div class="granularity-visual self-supervised-visual">
              <span>self-supervised</span>
            </div>
          </article>
        </div>
      </figure>
    </section>
  `,
};
