/** @jsxImportSource @opentui/solid */
import { ScrollBoxRenderable } from "@opentui/core"
import { testRender } from "@opentui/solid"
import { expect, test } from "bun:test"
import { For } from "solid-js"
import { createSidebarScrollCommands } from "../../../src/routes/session/sidebar"

test("sidebar commands scroll lines and half pages", async () => {
  let scroll: ScrollBoxRenderable | undefined
  const app = await testRender(
    () => (
      <scrollbox ref={(element: ScrollBoxRenderable) => (scroll = element)} height={6}>
        <box flexShrink={0}>
          <For each={Array.from({ length: 30 }, (_, index) => index)}>
            {(index) => <text>{`Item ${index}`}</text>}
          </For>
        </box>
      </scrollbox>
    ),
    { width: 42, height: 6 },
  )

  try {
    await app.renderOnce()
    const commands = new Map(createSidebarScrollCommands(() => scroll).map((command) => [command.name, command]))

    commands.get("session.sidebar.line.down")!.run()
    await app.renderOnce()
    expect(scroll!.scrollTop).toBe(1)

    commands.get("session.sidebar.page.down")!.run()
    await app.renderOnce()
    expect(scroll!.scrollTop).toBe(4)

    commands.get("session.sidebar.line.up")!.run()
    await app.renderOnce()
    expect(scroll!.scrollTop).toBe(3)

    commands.get("session.sidebar.page.up")!.run()
    await app.renderOnce()
    expect(scroll!.scrollTop).toBe(0)
  } finally {
    app.renderer.destroy()
  }
})
