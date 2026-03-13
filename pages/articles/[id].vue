<script setup lang="ts">
const route = useRoute()

const id = Number(route.params.id)

const { fetchArticleById, fetchRelatedArticles } = useArticlesApi()

const { data: article } = await useAsyncData(
  `article-${id}`,
  () => fetchArticleById(id)
)

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article not found'
  })
}

const { data: related } = await useAsyncData(
  `related-${id}`,
  () => fetchRelatedArticles(article.value!)
)

useHead({
  title: article.value.title,
  meta: [
    {
      name: 'description',
      content: article.value.body.slice(0, 120)
    }
  ]
})
</script>

<template>
  <main class="page">
    <article v-if="article">
      <header>
        <h1>{{ article.title }}</h1>
        <p class="meta">By {{ article.authorName }}</p>
      </header>

      <section class="body">
        <p>{{ article.body }}</p>
      </section>
    </article>

    <nav>
      <NuxtLink
        :to="{
          path: '/articles',
          query: route.query
        }"
      >
        ← Back to results
      </NuxtLink>
    </nav>

    <section v-if="related?.length">
      <h2>Related articles</h2>

      <ul>
        <li v-for="item in related" :key="item.id">
          <NuxtLink
            :to="{
              path: `/articles/${item.id}`,
              query: route.query
            }"
          >
            {{ item.title }}
          </NuxtLink>
        </li>
      </ul>
    </section>
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

nav {
  margin-top: 2rem;
}

section {
  margin-top: 2rem;
}
</style>