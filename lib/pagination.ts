export const DEFAULT_PER_PAGE = 10;
export const PER_PAGE_OPTIONS = [10, 20, 30, 40, 50] as const;

export type PageSearchParams = {
  [key: string]: string | string[] | undefined;
};

/**
 * Parse pagination params from a page's searchParams into a 1-based page
 * number, the validated page size, and the Prisma `skip`/`take` values.
 *
 * `perPage` is read from `searchParams.perPage` and validated against
 * `PER_PAGE_OPTIONS`; invalid values fall back to `fallbackPerPage`.
 */
export function getPagination(
  searchParams: PageSearchParams,
  fallbackPerPage: number = DEFAULT_PER_PAGE
) {
  const rawPage = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;
  const parsedPage = Number.parseInt(rawPage ?? "", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const rawPerPage = Array.isArray(searchParams.perPage)
    ? searchParams.perPage[0]
    : searchParams.perPage;
  const parsedPerPage = Number.parseInt(rawPerPage ?? "", 10);
  const perPage = (PER_PAGE_OPTIONS as readonly number[]).includes(parsedPerPage)
    ? parsedPerPage
    : fallbackPerPage;

  return {
    page,
    perPage,
    skip: (page - 1) * perPage,
    take: perPage,
  };
}

export function getTotalPages(totalItems: number, perPage: number) {
  return Math.max(1, Math.ceil(totalItems / perPage));
}

/**
 * Build a `?key=value` query string for a target page while preserving any
 * other params already present (e.g. filters).
 */
export function buildPageHref(
  searchParams: PageSearchParams,
  page: number,
  pageParam = "page"
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === pageParam || value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) params.append(key, v);
    } else {
      params.set(key, value);
    }
  }
  if (page > 1) params.set(pageParam, String(page));

  const qs = params.toString();
  return qs ? `?${qs}` : "?";
}
