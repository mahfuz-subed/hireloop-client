import { NextResponse } from "next/server"

/**
 * Uploads one image to imgbb and returns its public URL.
 *
 * The browser posts the file here instead of calling imgbb directly, because
 * `IMAGEBB_API_KEY` is a server-only secret: env variables without the
 * `NEXT_PUBLIC_` prefix are `undefined` inside client components, so the
 * direct imgbb call sent `key=undefined` and imgbb answered 400.
 */
export async function POST(request: Request) {
  const apiKey = process.env.IMAGEBB_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "Image upload is not configured (IMAGEBB_API_KEY is missing)." },
      { status: 500 }
    )
  }

  const formData = await request.formData()
  const image = formData.get("image")

  if (!(image instanceof File)) {
    return NextResponse.json(
      { error: "No image file was sent." },
      { status: 400 }
    )
  }

  if (!image.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files can be uploaded." },
      { status: 400 }
    )
  }

  if (image.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Images must be 5 MB or smaller." },
      { status: 400 }
    )
  }

  // Forward the file to imgbb. The key stays on the server.
  const imgbbFormData = new FormData()
  imgbbFormData.append("image", image)

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: imgbbFormData,
  })
  const result = await response.json().catch(() => null)

  if (!response.ok || !result?.data?.url) {
    return NextResponse.json(
      { error: result?.error?.message || "The image could not be uploaded." },
      { status: 502 }
    )
  }

  return NextResponse.json({ url: result.data.url })
}
