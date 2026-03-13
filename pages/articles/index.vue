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

const { data, pending, error } = await useAsyncData(
  asyncKey,
  () => fetchArticles(requestParams.value),
  {
    watch: [requestParams],
  }
)

function goToPage(page: number) {
  updateQuery({ page: page })
}
</script>

<template>
  <main class="page">
    <header>
      <h1>Articles</h1>
      <p>Search and explore articles.</p>
    </header>

    <section>
      <form @submit.prevent>
        <label for="search">Search by title</label>

        <input
          id="search"
          v-model="searchInput"
          type="search"
          placeholder="Search articles"
        >
      </form>
    </section>

    <section>
      <template v-if="error">
        <p role="alert">Failed to load articles.</p>
      </template>

      <template v-else-if="pending">
        <p>Loading…</p>
      </template>

      <template v-else-if="data">
        <ul>
          <li
            v-for="article in data.items"
            :key="article.id"
          >
            <article>
              <h2>
                <NuxtLink
                  :to="{
                    path: `/articles/${article.id}`,
                    query: route.query
                  }"
                >
                  {{ article.title }}
                </NuxtLink>
              </h2>

              <p>By {{ article.authorName }}</p>

              <p>{{ article.excerpt }}</p>
            </article>
          </li>
        </ul>

        <nav>
          <button
            :disabled="data.page <= 1"
            @click="goToPage(data.page - 1)"
          >
            Previous
          </button>

          <span>
            Page {{ data.page }} of {{ data.totalPages }}
          </span>

          <button
            :disabled="data.page >= data.totalPages"
            @click="goToPage(data.page + 1)"
          >
            Next
          </button>
        </nav>
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