import ItemGrid from "@/components/item/item-grid";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getItems } from "@/data/item";
import {
  DEFAULT_SORT,
  ITEMS_PER_PAGE,
  SORT_FILTER_LIST,
} from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import type { SponsorItemListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { sponsorItemListQuery } from "@/sanity/lib/queries";

export const metadata = constructMetadata({
  title: "",
  canonicalUrl: `${siteConfig.url}/`,
});

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log("HomePage, searchParams", searchParams);

  // Option 1: use these code if you want to show sponsor items in the item grid
  // const sponsorItems = (await sanityFetch<SponsorItemListQueryResult>({
  //   query: sponsorItemListQuery,
  // })) || [];
  // const showSponsor = true;
  // const hasSponsorItem = showSponsor && sponsorItems.length > 0;

  // Option 2: use these code if you want to show sponsor items in the hero section
  const sponsorItems = [];
  const showSponsor = false;
  const hasSponsorItem = false;

  const {
    category,
    tag,
    sort,
    page,
    q: query,
    f: filter,
  } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;
  const currentPage = page ? Number(page) : 1;
  const { items, totalCount } = await getItems({
    category,
    tag,
    sortKey,
    reverse,
    query,
    filter,
    currentPage,
    hasSponsorItem,
  });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  console.log("HomePage, totalCount", totalCount, ", totalPages", totalPages);

  return (
    <div>
      {/* when no items are found */}
      {items?.length === 0 && <EmptyGrid />}

      {/* when items are found */}
      {items && items.length > 0 && (
        <section className="">
          <ItemGrid items={items} sponsorItems={sponsorItems} showSponsor={showSponsor} />

          <div className="mt-8 flex items-center justify-center">
            <CustomPagination routePreix="/home3" totalPages={totalPages} />
          </div>
        </section>
      )}
    </div>
  );
}
