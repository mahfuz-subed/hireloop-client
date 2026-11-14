import { SiteNavbar } from "@/components/site-navbar"
import { BrowseJobsView } from "@/app/components/jobs/browse-jobs-view"
import { getJobs } from "@/lib/api/jobs"
import { buildJobQuery } from "@/lib/jobs-filter"

type SearchParams = Record<string, string | string[] | undefined>

/** Read one query parameter and ignore duplicates (`?jobType=a&jobType=b`). */
const readParam = (value: string | string[] | undefined) =>
  typeof value === "string" && value !== "" ? value : null

const BrowseJobsPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) => {
  const params = await searchParams

  // 1. What is selected right now? It all comes from the URL.
  const search = readParam(params.search) ?? ""
  const jobType = readParam(params.jobType)
  const category = readParam(params.category)

  // 2. Ask the API twice:
  //    - `jobs`    → filtered results for the current URL
  //    - `allJobs` → every job, only to count the numbers in the filter panel
  const query = buildJobQuery({ search, jobType, category })
  const [jobs, allJobs] = await Promise.all([getJobs(query), getJobs()])

  return (
    <div className="min-h-svh bg-[#010103] text-zinc-100">
      <SiteNavbar />
      <main>
        <BrowseJobsView
          jobs={jobs}
          allJobs={allJobs}
          filters={{ jobType, category }}
          search={search}
        />
      </main>
    </div>
  )
}

export default BrowseJobsPage
