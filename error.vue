<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

function handleGoHome() {
  clearError({ redirect: '/articles' })
}
</script>

<template>
  <main class="page">
    <section class="error-card">
      <p class="error-code">{{ error.statusCode }}</p>
      <h1>{{ error.statusMessage || 'Something went wrong' }}</h1>
      <p class="error-text">
        The page could not be found or an unexpected error occurred.
      </p>

      <button type="button" class="error-button" @click="handleGoHome">
        Go back to articles
      </button>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem 1rem;
}

.error-card {
  width: 100%;
  max-width: 560px;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fff;
  text-align: center;
}

.error-code {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  color: #666;
}

.error-text {
  color: #555;
  margin-bottom: 1.5rem;
}

.error-button {
  padding: 0.75rem 1rem;
  border: 1px solid #bbb;
  border-radius: 8px;
  background: #fff;
  font: inherit;
  cursor: pointer;
}
</style>