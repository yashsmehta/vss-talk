export default {
  html: `
    <section class="slide pc-scatter-slide">
      <h1>Internal representations</h1>
      <div class="pc-grid">
        <div class="pc-col">
          <div class="pc-col-heading">
            <span class="pc-col-name">Behavior</span>
            <span class="pc-col-sub">ground truth</span>
          </div>
          <img src="images/pc_scatter_panel_1.svg" alt="">
        </div>
        <div class="pc-col step step-1">
          <div class="pc-col-heading">
            <span class="pc-col-name">standard labels</span>
            <span class="pc-col-sub">1000 categories</span>
          </div>
          <img src="images/pc_scatter_panel_2.svg" alt="">
        </div>
        <div class="pc-col step step-1">
          <div class="pc-col-heading">
            <span class="pc-col-name">coarse labels</span>
            <span class="pc-col-sub">8 categories</span>
          </div>
          <img src="images/pc_scatter_panel_3.svg" alt="">
        </div>
      </div>
    </section>
  `,
  steps: 1,
};

