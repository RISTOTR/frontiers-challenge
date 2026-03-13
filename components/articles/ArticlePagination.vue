<script setup lang="ts">
defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits<{
  goToPage: [page: number]
}>()
</script>

<template>
  <nav class="pagination" aria-label="Pagination">
    <button
      type="button"
      :disabled="page <= 1"
      aria-label="Go to previous page"
      @click="emit('goToPage', page - 1)"
    >
      Previous
    </button>

    <span aria-current="page">
      Page {{ page }} of {{ totalPages }}
    </span>

    <button
      type="button"
      :disabled="page >= totalPages"
      aria-label="Go to next page"
      @click="emit('goToPage', page + 1)"
    >
      Next
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.7rem 0.85rem;
  border: 1px solid #bbb;
  border-radius: 8px;
  font: inherit;
}
</style>