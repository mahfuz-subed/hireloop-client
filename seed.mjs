import envPkg from "@next/env"
const { loadEnvConfig } = envPkg
loadEnvConfig(process.cwd())

// If .env still contains the <db_username>/<db_password> placeholders,
// substitute the real credentials from MONGODB_USER / MONGODB_PASSWORD.
const usedPlaceholderFix = process.env.BETTER_AUTH_DB_URI?.includes("<db_username>")
if (usedPlaceholderFix) {
  process.env.BETTER_AUTH_DB_URI = process.env.BETTER_AUTH_DB_URI
    .replace("<db_username>", process.env.MONGODB_USER)
    .replace("<db_password>", process.env.MONGODB_PASSWORD)
}
console.log("placeholder substitution applied:", !!usedPlaceholderFix)

const { auth } = await import(new URL("./lib/auth.ts", import.meta.url).href)

const PASSWORD = "password123"

const users = [
  // --- Seekers (most) ---
  ["Ayesha Rahman", "ayesha.rahman@example.com", "seeker"],
  ["Tanvir Ahmed", "tanvir.ahmed@example.com", "seeker"],
  ["Sofia Karim", "sofia.karim@example.com", "seeker"],
  ["Rafiul Islam", "rafiul.islam@example.com", "seeker"],
  ["Nusrat Jahan", "nusrat.jahan@example.com", "seeker"],
  ["Imran Hossain", "imran.hossain@example.com", "seeker"],
  ["Farhana Akter", "farhana.akter@example.com", "seeker"],
  ["Zayan Chowdhury", "zayan.chowdhury@example.com", "seeker"],
  // --- Recruiters ---
  ["Nabila Hasan", "nabila.hasan@example.com", "recruiter"],
  ["Arif Mahmud", "arif.mahmud@example.com", "recruiter"],
  ["Sadia Islam", "sadia.islam@example.com", "recruiter"],
  // --- Admin ---
  ["System Admin", "admin@hireloop.com", "admin"],
]

const created = []
const skipped = []
const failed = []

for (const [name, email, role] of users) {
  try {
    await auth.api.signUpEmail({
      body: { name, email, password: PASSWORD, role },
    })
    created.push(`${email} (${role})`)
  } catch (e) {
    const msg = e?.body?.message || e?.message || String(e)
    if (/already exists/i.test(msg)) skipped.push(`${email} (${role})`)
    else failed.push(`${email} (${role}) -> ${msg}`)
  }
}

console.log("\nCREATED:", created.length)
created.forEach((u) => console.log("  +", u))
console.log("SKIPPED (already in db):", skipped.length)
skipped.forEach((u) => console.log("  =", u))
console.log("FAILED:", failed.length)
failed.forEach((u) => console.log("  !", u))

// Remove my earlier test user (repro-bot) so it doesn't clutter the db
const { MongoClient } = await import("mongodb")
const client = new MongoClient(process.env.BETTER_AUTH_DB_URI)
try {
  await client.connect()
  const db = client.db("hireloopdb")
  const del = await db.collection("user").deleteMany({ email: "repro-bot@example.com" })
  if (del.deletedCount) console.log("\nremoved test user repro-bot:", del.deletedCount)

  const counts = await db
    .collection("user")
    .aggregate([{ $group: { _id: "$role", n: { $sum: 1 } } }])
    .toArray()
  console.log("\nusers in db by role:")
  for (const { _id, n } of counts.sort((a, b) => a._id.localeCompare(b._id))) {
    console.log(`  ${_id}: ${n}`)
  }
  const total = counts.reduce((s, c) => s + c.n, 0)
  console.log("  total:", total)
} finally {
  await client.close()
}

process.exit(0)
