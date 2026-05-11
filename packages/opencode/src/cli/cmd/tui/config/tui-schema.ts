import { ConfigPlugin } from "@/config/plugin"
import { TuiKeybind } from "./keybind"
import { Schema } from "effect"

export const KeymapLeaderTimeoutDefault = 2000
const KeymapLeaderTimeout = Schema.Int.check(Schema.isGreaterThan(0)).annotate({
  description: "Leader key timeout in milliseconds",
})

export const ScrollSpeed = Schema.Number.check(Schema.isGreaterThanOrEqualTo(0.001))

export const ScrollAcceleration = Schema.Struct({
  enabled: Schema.Boolean.annotate({ description: "Enable scroll acceleration" }),
}).annotate({ description: "Scroll acceleration settings" })

export const DiffStyle = Schema.Literals(["auto", "stacked"]).annotate({
  description: "Control diff rendering style: 'auto' adapts to terminal width, 'stacked' always shows single column",
})

const PromptMaxHeight = Schema.Int.check(Schema.isGreaterThanOrEqualTo(1), Schema.isLessThanOrEqualTo(50)).annotate({
  description: "Maximum number of rows the prompt input expands to",
})

export const TuiInfo = Schema.Struct({
  $schema: Schema.optional(Schema.String),
  theme: Schema.optional(Schema.String),
  keybinds: Schema.optional(TuiKeybind.KeybindOverrides),
  plugin: Schema.optional(Schema.Array(ConfigPlugin.Spec)),
  plugin_enabled: Schema.optional(Schema.Record(Schema.String, Schema.Boolean)),
  leader_timeout: Schema.optional(KeymapLeaderTimeout),
  scroll_speed: Schema.optional(ScrollSpeed).annotate({
    description: "TUI scroll speed",
  }),
  scroll_acceleration: Schema.optional(ScrollAcceleration),
  diff_style: Schema.optional(DiffStyle),
  vim: Schema.optional(Schema.Boolean).annotate({ description: "Enable vim-style input for the prompt" }),
  prompt_max_height: Schema.optional(PromptMaxHeight),
  prompt_scrollbar: Schema.optional(Schema.Boolean).annotate({ description: "Show a scrollbar for the prompt input" }),
  vim_enter_submit: Schema.optional(Schema.Boolean).annotate({
    description: "Submit prompt with Enter in vim insert and replace modes",
  }),
  vim_system_clipboard_register: Schema.optional(Schema.Boolean).annotate({
    description: "Use the system clipboard instead of Vim's internal register for yank and paste",
  }),
  mouse: Schema.optional(Schema.Boolean).annotate({ description: "Enable or disable mouse capture (default: true)" }),
})
