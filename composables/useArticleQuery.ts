import type {
  LocationQuery,
  LocationQueryRaw,
  LocationQueryValue,
} from 'vue-router'
import type { ArticleQueryState } from '~/types/article'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10
const ALLOWED_PAGE_SIZES = [5, 10, 20]

function readSingle(
  value: LocationQueryValue | LocationQueryValue[] | undefined
): string {
  if (Array.isArray(value)) {
    return value.find((item): item is string => typeof item === 'string') ?? ''
  }

  return typeof value === 'string' ? value : ''
}

function parsePositiveInt(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function normalizeArticleQuery(query: LocationQuery): ArticleQueryState {
  const q = readSingle(query.q).trim()
  const author = readSingle(query.author).trim()

  const page = parsePositiveInt(readSingle(query.page), DEFAULT_PAGE)

  const rawPageSize = parsePositiveInt(
    readSingle(query.pageSize),
    DEFAULT_PAGE_SIZE
  )

  const pageSize = ALLOWED_PAGE_SIZES.includes(rawPageSize)
    ? rawPageSize
    : DEFAULT_PAGE_SIZE

  return {
    q,
    author,
    page,
    pageSize,
  }
}

export function toArticleQuery(params: ArticleQueryState): LocationQueryRaw {
  return {
    ...(params.q ? { q: params.q } : {}),
    ...(params.author ? { author: params.author } : {}),
    ...(params.page !== DEFAULT_PAGE ? { page: String(params.page) } : {}),
    ...(params.pageSize !== DEFAULT_PAGE_SIZE
      ? { pageSize: String(params.pageSize) }
      : {}),
  }
}

export function useArticleQuery() {
  const route = useRoute()
  const router = useRouter()

  const queryState = computed(() => normalizeArticleQuery(route.query))

  async function updateQuery(
    patch: Partial<ArticleQueryState>,
    options?: { resetPage?: boolean }
  ) {
    const current = queryState.value

    const next: ArticleQueryState = {
      ...current,
      ...patch,
    }

    if (options?.resetPage) {
      next.page = DEFAULT_PAGE
    }

    await router.push({
      query: toArticleQuery(next),
    })
  }

  return {
    queryState,
    updateQuery,
    pageSizes: ALLOWED_PAGE_SIZES,
  }
}