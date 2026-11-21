const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const updateApplicationStatus = async (
  id: string,
  data: { status: string }
) => {
  const response = await fetch(`${BASE_URL}/application/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export const updateUserRole = async (
  userId: string,
  role: "seeker" | "recruiter" | "admin"
) => {
  const response = await fetch(`${BASE_URL}/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ role }),
  })
  return response.json()
}
