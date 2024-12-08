<template>
  <header>
    <nav>
      <ul>
        <li v-for="tab in navTabs" :key="tab.name">
          <NuxtLink :to="tab.path">{{ tab.name }}</NuxtLink>
        </li>
      </ul>

      <button :class="[{ 'collapsed': !isBurgerOpen }]" class="navbar-toggler" @click="toggleBurger" :aria-expanded="isBurgerOpen" :aria-label="isBurgerOpen ? 'close menu' : 'open menu'">
        <span v-for="index in 3" :key="index"></span>
      </button>

      <div class="mobile-tabs">
        <ul :class="{ [!isBurgerOpen ? 'closed' : 'open']: true }" :aria-hidden="!isBurgerOpen">
          <li v-for="tab in navTabs" :key="tab.name">
            <NuxtLink :to="tab.path" :tabindex="isBurgerOpen ? 0 : -1" @click="toggleBurger">{{ tab.name }}</NuxtLink>
          </li>
        </ul>
      </div>

      <NuxtLink to="/profile" class="nav-profile" :class="{ 'loged-in': isLogedIn }"><Icon name="material-symbols-light:account-circle" /></NuxtLink>
    </nav>
  </header>
</template>

<script lang="ts" setup>
const navTabs = computed(() => [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Ads',
    path: '/',
  },
  {
    name: 'Post ad',
    path: '/',
  },
]);

const isBurgerOpen = ref(false);

function toggleBurger() {
  isBurgerOpen.value = !isBurgerOpen.value;
}

const user = useSupabaseUser();
var isLogedIn = computed(() => user.value);
</script>