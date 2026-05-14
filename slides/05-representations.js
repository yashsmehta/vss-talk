export default {
  html: `
    <section class="slide figure-slide">
      <h1>Coarse training yields more categorical representations</h1>
      <figure>
        <div class="svg-wrap" style="aspect-ratio: 892.628606 / 460.980012;">
          <img src="images/representations.svg" alt="">
          <span class="col-title" style="left: 28.28%;">CNN trained on 1,000 classes</span>
          <span class="col-title" style="left: 77.89%;">CNN trained on 4 classes</span>
        </div>
        <figcaption class="caption step step-1">1000-way vs 4-way CNN — the 4-way model's internal representations become more categorical.</figcaption>
      </figure>
    </section>
  `,
  steps: 1,
};
