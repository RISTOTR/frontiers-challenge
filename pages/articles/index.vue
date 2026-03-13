<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

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
  await updateQuery({ q: value }, { resetPage: true })
}, 350)

watch(searchInput, (value) => {
  if (value !== queryState.value.q) {
    debouncedSearch(value)
  }
})

const asyncKey = computed(() => `articles:${JSON.stringify(queryState.value)}`)

const {
  data: articlesResult,
  pending,
  error,
} = await useAsyncData(
  asyncKey,
  () => fetchArticles(queryState.value),
  {
    watch: [queryState],
  }
)

function onAuthorChange(event: Event) {
  const target = event.target as HTMLSelectElement
  void updateQuery({ author: target.value }, { resetPage: true })
}

function onPageSizeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  void updateQuery({ pageSize: Number(target.value) }, { resetPage: true })
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

    <section class="panel" aria-labelledby="filters-title">
      <h2 id="filters-title" class="sr-only">Filter articles</h2>

      <form class="filters" @submit.prevent>
        <div class="field">
          <label for="search">Search by title</label>
          <input
            id="search"
            v-model="searchInput"
            type="search"
            name="search"
            placeholder="Search articles"
          >
        </div>

        <div class="field">
          <label for="author">Author</label>
          <select
            id="author"
            name="author"
            :value="queryState.author"
            @change="onAuthorChange"
          >
            <option value="">All authors</option>
            <option
              v-for="author in articlesResult?.authors ?? []"
              :key="author.id"
              :value="String(author.id)"
            >
              {{ author.name }}
            </option>
          </select>
        </div>

        <div class="field">
          <label for="pageSize">Results per page</label>
          <select
            id="pageSize"
            name="pageSize"
            :value="queryState.pageSize"
            @change="onPageSizeChange"
          >
            <option
              v-for="size in pageSizes"
              :key="size"
              :value="size"
            >
              {{ size }}
            </option>
          </select>
        </div>
      </form>
    </section>

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
              <li
                v-for="article in articlesResult.items"
                :key="article.id"
                class="article-card"
              >
                <article>
                  <header>
                    <h2>
                      <NuxtLink
                        :to="{
                          path: `/articles/${article.id}`,
                          query: route.query,
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
            </ul>
          </section>

          <nav class="pagination" aria-label="Pagination">
            <button
              type="button"
              :disabled="articlesResult.page <= 1"
              @click="goToPage(articlesResult.page - 1)"
            >
              Previous
            </button>

            <span aria-current="page">
              Page {{ articlesResult.page }} of {{ articlesResult.totalPages }}
            </span>

            <button
              type="button"
              :disabled="articlesResult.page >= articlesResult.totalPages"
              @click="goToPage(articlesResult.page + 1)"
            >
              Next
            </button>
          </nav>
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

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.field {
  display: grid;
  gap: 0.4rem;
}

.field input,
.field select,
.pagination button {
  padding: 0.7rem 0.85rem;
  border: 1px solid #bbb;
  border-radius: 8px;
  font: inherit;
}

.articles {
  display: grid;
  gap: 1rem;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

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

.pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
}

.results-summary {
  margin: 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>