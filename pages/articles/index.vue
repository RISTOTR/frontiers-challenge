<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import ArticleFilters from '~/components/articles/ArticleFilters.vue'
import ArticleCard from '~/components/articles/ArticleCard.vue'
import ArticlePagination from '~/components/articles/ArticlePagination.vue'

const route = useRoute()

const { fetchArticles } = useArticlesApi()
const { queryState, updateQuery, pageSizes } = useArticleQuery()

const searchInput = ref(queryState.value.q)

watch(
  () => queryState.value.q,
  (value) => {
    if (value !== searchInput.value) {
      searchInput.value = value
    }
  }
)

const debouncedSearch = useDebounceFn(async (value: string) => {
  await updateQuery(
    { q: value },
    { resetPage: true, replace: true }
  )
}, 350)

watch(searchInput, (value) => {
  if (value !== queryState.value.q) {
    debouncedSearch(value)
  }
})

const requestParams = computed(() => ({
  q: queryState.value.q,
  author: queryState.value.author,
  page: queryState.value.page,
  pageSize: queryState.value.pageSize,
}))

const asyncKey = computed(
  () =>
    `articles:${requestParams.value.q}:${requestParams.value.author}:${requestParams.value.page}:${requestParams.value.pageSize}`
)

const {
  data: articlesResult,
  pending,
  error,
} = await useAsyncData(
  asyncKey,
  () => fetchArticles(requestParams.value),
  {
    watch: [requestParams],
  }
)

function onAuthorChange(event: Event) {
  const target = event.target as HTMLSelectElement
  void updateQuery(
    { author: target.value },
    { resetPage: true }
  )
}

function onPageSizeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  void updateQuery(
    { pageSize: Number(target.value) },
    { resetPage: true }
  )
}

function goToPage(page: number) {
  void updateQuery({ page })
}
</script>

<template>
  <main class="page">
    <header class="page__header">
      <h1>Articles</h1>
      <p class="page__intro">
        Explore articles with server-side rendering, search, filtering, and pagination.
      </p>
    </header>

    <ArticleFilters
      v-model:search-input="searchInput"
      :author-value="queryState.author"
      :page-size-value="queryState.pageSize"
      :authors="articlesResult?.authors ?? []"
      :page-sizes="pageSizes"
      @author-change="onAuthorChange"
      @page-size-change="onPageSizeChange"
    />

    <section class="panel" aria-live="polite">
      <template v-if="error">
        <p role="alert">Something went wrong while loading articles.</p>
      </template>

      <template v-else-if="pending">
        <p>Loading articles…</p>
      </template>

      <template v-else-if="articlesResult">
        <p class="results-summary">
          {{ articlesResult.total }} result<span v-if="articlesResult.total !== 1">s</span> found.
        </p>

        <template v-if="articlesResult.items.length === 0">
          <p>No articles match your current filters.</p>
        </template>

        <template v-else>
          <section aria-label="Article results">
            <ul class="articles">
              <ArticleCard
                v-for="article in articlesResult.items"
                :key="article.id"
                :article="article"
                :query="route.query"
              />
            </ul>
          </section>

          <ArticlePagination
            :page="articlesResult.page"
            :total-pages="articlesResult.totalPages"
            @go-to-page="goToPage"
          />
        </template>
      </template>
    </section>
  </main>
</template>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
}

.page__header {
  margin-bottom: 1.5rem;
}

.page__intro {
  max-width: 60ch;
  color: #555;
}

.panel {
  margin-bottom: 1.25rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #fff;
}

.articles {
  display: grid;
  gap: 1rem;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

.results-summary {
  margin: 0;
}
</style>