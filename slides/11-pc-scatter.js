export default {
  html: `
    <section class="slide pc-scatter-slide">
      <h1>Internal representations</h1>
      <div class="pc-grid">
        <div class="pc-col">
          <span class="pc-col-heading">Behavioral ground truth</span>
          <img src="images/pc_scatter_panel_1.svg" alt="">
        </div>
        <div class="pc-col step step-1">
          <span class="pc-col-heading">AlexNet (1K classes)</span>
          <img src="images/pc_scatter_panel_2.svg" alt="">
        </div>
        <div class="pc-col step step-2">
          <span class="pc-col-heading">CNN (8 classes, CLIP representations)</span>
          <img src="images/pc_scatter_panel_3.svg" alt="">
        </div>
      </div>
    </section>
  `,
  steps: 2,
};
