<script setup lang="ts">
import RelatedArticles from '~/components/articles/RelatedArticles.vue'

const route = useRoute()
const id = Number(route.params.id)

if (!Number.isInteger(id) || id <= 0) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article not found',
  })
}

const { fetchArticleById, fetchRelatedArticles } = useArticlesApi()

const { data: article } = await useAsyncData(
  `article-${id}`,
  () => fetchArticleById(id)
)

const articleValue = article.value

if (!articleValue) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article not found',
  })
}

const { data: related } = await useAsyncData(
  `related-${id}`,
  () => fetchRelatedArticles(articleValue)
)

useHead({
  title: articleValue.title,
  meta: [
    {
      name: 'description',
      content: articleValue.body.replace(/\s+/g, ' ').trim().slice(0, 140),
    },
  ],
})
</script>

<template>
  <main class="page">
    <article>
      <header>
        <h1>{{ articleValue.title }}</h1>
        <p class="meta">By {{ articleValue.authorName }}</p>
      </header>

      <section class="body">
        <p>{{ articleValue.body }}</p>
      </section>
    </article>

    <nav class="back-nav" aria-label="Back navigation">
      <NuxtLink
        :to="{
          path: '/articles',
          query: route.query,
        }"
      >
        ← Back to results
      </NuxtLink>
    </nav>

    <RelatedArticles
      v-if="related"
      :related="related"
      :query="route.query"
    />
  </main>
</template>

<style scoped>
.page {
  max-width: 760px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.meta {
  color: #666;
  margin-bottom: 1rem;
}

.body {
  line-height: 1.6;
}

.back-nav {
  margin-top: 2rem;
}

section {
  margin-top: 2rem;
}

.related-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}
</style>