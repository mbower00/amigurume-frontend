<script setup>
import { ref } from 'vue'
</script>

<template>
  <div class="hero-container">
    <div class="header-container">
      <h1 class="fancy-font header">
        What will <br />
        you make?
      </h1>
      <router-link class="link" to="browse">
        <v-btn class="hero-btn" variant="tonal" color="var(--lilac)">get creative</v-btn>
      </router-link>
    </div>
    <img
      class="full-img"
      src="https://storage.googleapis.com/amigurume/full_resize.png"
      alt="Image of a blue elephant amigurumi."
    />
  </div>

  <div class="details-grid">
    <div class="detail light-blackberry">
      Every year, there are more movies shot, games developed, books written, family memories made,
      and stories told.
    </div>
    <div class="detail blackberry">
      We give those who cherish unique and personal stories the chance to bring them to life with
      toys of their favorite characters.
    </div>
    <div class="detail lilac">
      <router-link class="lilac" to="browse">Browse</router-link> our selection, visualize your
      AmiguruMe, select your pieces, sew them together, and enjoy your new stuffed friend!
    </div>
  </div>

  <img
    class="long-img"
    src="https://storage.googleapis.com/amigurume/long_resize.png"
    alt="Image of an amigurumi body connected to thread with a tapesty needle."
  />
</template>

<style scoped>
.image-container {
  padding: 20px;
}
.long-img {
  display: block;
  margin: 0 auto 80px auto;
  padding: 0 60px;
  max-width: 1120px;
  width: 100%;
}
.full-img {
  display: block;
  max-width: 400px;
  width: 100%;
}
.hero-container {
  max-width: 1000px;
  margin: 80px auto 0 auto;
  display: flex;
  justify-content: center;
  gap: 70px;
  align-items: center;
  padding: 0 60px;
}
.hero-btn {
  margin: 15px auto 0 auto;
  display: block;
}
.link {
  text-decoration: none;
}
.header-container {
  max-width: 400px;
}
.header {
  font-size: 70px;
  color: var(--lilac);
  text-align: center;
}
.details-grid {
  display: grid;
  padding: 0 60px;
  max-width: 1200px;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 50px;
  margin: 100px auto 100px auto;
  justify-items: center;
}
.detail {
  border-radius: 4px;
  font-size: x-large;
  max-width: 300px;
}

.lilac {
  /* border: var(--mid-lilac) solid 2px; */
  color: var(--lilac);
}
.blackberry {
  /* border: var(--light-blackberry) solid 2px; */
  color: var(--blackberry);
}
.light-blackberry {
  color: var(--light-blackberry);
}

@media (max-width: 1000px) {
  .hero-container {
    flex-direction: column;
    gap: 50px;
    margin-top: 30px;
  }
  .details-grid {
    margin: 50px auto;
  }
  .detail {
    font-size: large;
  }
}

@media (max-width: 775px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 475px) {
  .header {
    font-size: 50px;
  }
  .long-img {
    padding: 0 30px;
  }
}
@media (max-width: 375px) {
  .header {
    font-size: 35px;
  }
  .long-img {
    padding: 0 15px;
  }
}
</style>
