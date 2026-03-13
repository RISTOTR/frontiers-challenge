<script setup lang="ts">
import type { Author } from '~/types/article'

defineProps<{
  searchInput: string
  authorValue: string
  pageSizeValue: number
  authors: Author[]
  pageSizes: number[]
}>()

const emit = defineEmits<{
  'update:searchInput': [value: string]
  authorChange: [event: Event]
  pageSizeChange: [event: Event]
}>()
</script>

<template>
  <section class="panel" aria-labelledby="filters-title">
    <h2 id="filters-title" class="sr-only">Filter articles</h2>

    <form class="filters" @submit.prevent>
      <div class="field">
        <label for="search">Search by title</label>
        <input
          id="search"
          :value="searchInput"
          type="search"
          name="search"
          placeholder="Search articles"
          @input="emit('update:searchInput', ($event.target as HTMLInputElement).value)"
        >
      </div>

      <div class="field">
        <label for="author">Author</label>
        <select
          id="author"
          name="author"
          :value="authorValue"
          @change="emit('authorChange', $event)"
        >
          <option value="">All authors</option>
          <option
            v-for="author in authors"
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
          :value="pageSizeValue"
          @change="emit('pageSizeChange', $event)"
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
</template>

<style scoped>
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
.field select {
  padding: 0.7rem 0.85rem;
  border: 1px solid #bbb;
  border-radius: 8px;
  font: inherit;
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