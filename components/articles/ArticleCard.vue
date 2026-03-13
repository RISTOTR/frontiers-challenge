<script setup lang="ts">
import type { ArticleListItem } from '~/types/article'
import type { LocationQuery } from 'vue-router'

defineProps<{
  article: ArticleListItem
  query: LocationQuery
}>()
</script>

<template>
  <li class="article-card">
    <article>
      <header>
        <h2>
          <NuxtLink
            :to="{
              path: `/articles/${article.id}`,
              query,
            }"
          >
            {{ article.title }}
          </NuxtLink>
        </h2>
        <p class="meta">By {{ article.authorName }}</p>
      </header>

      <p>{{ article.excerpt }}</p>
    </article>
  </li>
</template>

<style scoped>
.article-card {
  padding: 1rem;
  border: 1px solid #e3e3e3;
  border-radius: 10px;
}

.article-card h2 {
  margin: 0 0 0.4rem;
  font-size: 1.1rem;
}

.meta {
  margin-bottom: 0.75rem;
  color: #666;
}
</style>