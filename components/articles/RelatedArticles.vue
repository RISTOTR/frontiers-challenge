<script setup lang="ts">
import type { ArticleListItem } from '~/types/article'
import type { LocationQuery } from 'vue-router'

defineProps<{
  related: ArticleListItem[]
  query: LocationQuery
}>()
</script>

<template>
  <section
    v-if="related.length"
    class="related"
    aria-labelledby="related-articles-title"
  >
    <h2 id="related-articles-title">Related articles</h2>

    <ul class="related-list">
      <li v-for="item in related" :key="item.id">
        <NuxtLink
          :to="{
            path: `/articles/${item.id}`,
            query,
          }"
        >
          {{ item.title }}
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.related {
  margin-top: 2rem;
}

.related-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.related-list a {
  text-decoration: none;
  color: #2c3e50;
}

.related-list a:hover {
  text-decoration: underline;
}
</style>