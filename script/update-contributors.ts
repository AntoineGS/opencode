#!/usr/bin/env bun

import { $ } from "bun"
import { parseArgs } from "util"

type Pull = {
  number: number
  base?: { ref?: string }
  user?: { login?: string; type?: string }
}

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    from: { type: "string", short: "f" },
    to: { type: "string", short: "t", default: "HEAD" },
    repo: { type: "string", default: process.env.GITHUB_REPOSITORY ?? "leohenon/opencode-vim" },
    base: { type: "string", default: "ocv" },
    readme: { type: "string", default: "README.md" },
    team: { type: "string", default: ".github/TEAM_MEMBERS" },
    help: { type: "boolean", short: "h", default: false },
  },
})

if (values.help || !values.from) {
  console.log(`Usage: bun script/update-contributors.ts --from <ref> [--to HEAD] [--repo owner/name] [--base ocv]

Adds missing merged PR authors to README.md's Contributors section.`)
  process.exit(values.help ? 0 : 1)
}

const botLogins = new Set(["actions-user", "github-actions[bot]", "opencode", "opencode-agent[bot]"])
const team = new Set([
  ...botLogins,
  ...(await Bun.file(values.team!)
    .text()
    .catch(() => "")
    .then((text) => text.split(/\r?\n/).map((line) => line.trim().toLowerCase()))
    .then((lines) => lines.filter((line) => line && !line.startsWith("#")))),
])

const commits = await $`git log --first-parent --reverse --format=%H ${`${values.from}..${values.to}`}`.text()
const authors = new Map<string, number>()

for (const sha of commits.split("\n").filter(Boolean)) {
  const pulls = await $`gh api ${`repos/${values.repo}/commits/${sha}/pulls`}`
    .json()
    .catch(() => [] as Pull[])

  for (const pull of pulls as Pull[]) {
    const login = pull.user?.login
    if (!login) continue
    if (pull.base?.ref !== values.base) continue
    if (pull.user?.type === "Bot") continue
    if (login.endsWith("[bot]")) continue
    if (team.has(login.toLowerCase())) continue
    if (!authors.has(login)) authors.set(login, pull.number)
  }
}

if (authors.size === 0) {
  console.log("No external merged PR authors found")
  process.exit(0)
}

const readme = await Bun.file(values.readme!).text()
const missing = [...authors.keys()].filter((login) => !new RegExp(`github\\.com/${escapeRegExp(login)}(?:["/.])`, "i").test(readme))

if (missing.length === 0) {
  console.log("All release contributors are already listed")
  process.exit(0)
}

await Bun.write(values.readme!, addContributors(readme, missing))
console.log(`Added contributors: ${missing.map((login) => `@${login}`).join(", ")}`)

function addContributors(readme: string, logins: string[]) {
  const heading = "## Contributors"
  const headingIndex = readme.indexOf(heading)
  if (headingIndex === -1) throw new Error(`${values.readme} is missing ${heading}`)

  const thanks = "Thanks to everyone who contributed."
  const thanksIndex = readme.indexOf(thanks, headingIndex)
  if (thanksIndex === -1) throw new Error(`${values.readme} is missing contributors intro text`)

  const contentStart = readme.indexOf("\n\n", thanksIndex + thanks.length)
  if (contentStart === -1) throw new Error(`${values.readme} has an invalid Contributors section`)

  const start = contentStart + 2
  const nextHeading = readme.slice(start).search(/\n## /)
  const end = nextHeading === -1 ? readme.length : start + nextHeading
  const current = readme.slice(start, end).trimEnd()
  const avatars = logins.map(
    (login) => `<a href="https://github.com/${login}"><img src="https://github.com/${login}.png" width="40" height="40" /></a>`,
  )
  const next = current ? `${current} ${avatars.join(" ")}` : avatars.join(" ")
  return readme.slice(0, start) + next + (readme.slice(end) || (readme.endsWith("\n") ? "\n" : ""))
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
