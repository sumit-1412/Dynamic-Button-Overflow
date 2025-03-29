"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Action } from "@/app/config/page"

interface WorkflowPreviewProps {
  buttonLabel: string
  actions: Action[]
}

export function WorkflowPreview({ buttonLabel, actions }: WorkflowPreviewProps) {
  if (actions.length === 0) {
    return (
      <Card className="flex h-[300px] flex-col items-center justify-center p-6 text-center bg-muted/20">
        <p className="text-muted-foreground">Your workflow is empty</p>
        <p className="text-xs text-muted-foreground mt-1">Add some actions to see a preview</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex justify-center">
        <Button disabled>{buttonLabel || "Click Me!"}</Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-primary mr-2"></span>
          Workflow Sequence:
        </p>
        <ol className="space-y-2 pl-5 border-l-2 border-muted ml-1">
          {actions.map((action, index) => {
            let description = ""

            switch (action.type) {
              case "alert":
                description = `Show alert: "${action.config.message || "Alert!"}"`
                break
              case "showText":
                description = `Display text: "${action.config.text || "Text content"}"`
                break
              case "showImage":
                description = `Show image${action.config.url ? ` from ${action.config.url}` : ""}`
                break
              case "refreshPage":
                description = "Refresh the page"
                break
              case "setLocalStorage":
                description = `Save to localStorage: ${action.config.key || "key"} = ${action.config.value || "value"}`
                break
              case "getLocalStorage":
                description = `Get from localStorage: ${action.config.key || "key"}`
                break
              case "increaseButtonSize":
                description = "Make button larger"
                break
              case "closeWindow":
                description = "Attempt to close window"
                break
              case "promptAndShow":
                description = `Ask user: "${action.config.promptMessage || "Enter value"}"`
                break
              case "changeButtonColor":
                description = action.config.color
                  ? `Change button color to ${action.config.color}`
                  : "Change button color randomly"
                break
              case "disableButton":
                description = "Disable the button"
                break
              default:
                description = action.type
            }

            return (
              <li key={action.id} className="text-sm">
                <span className="font-medium">{index + 1}.</span> {description}
              </li>
            )
          })}
        </ol>
      </div>
    </Card>
  )
}

