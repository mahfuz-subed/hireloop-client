import type { JobInput } from "@/types/job"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const createJob = async (data: JobInput) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const deleteJob = async (jobId: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: "DELETE",
  })
  return res.json()
}

// export const updateJobs = async(updatedData:Job)=>{
//   const res = await fetch(`${BASE_URL}/jobs/${updatedData._id}`,{
//     method: "PATCH",
//     headers: {"Content-Type": "application/json"},
//     body: JSON.stringify(updatedData)

//   })
// }
