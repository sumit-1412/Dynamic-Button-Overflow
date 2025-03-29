"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Action } from "@/app/config/page"

// This component renders the appropriate form fields based on the action type
// Each action type has its own unique configuration options

interface ActionFormProps {
  action: Action
  onUpdate: (config: Record<string, any>) => void
}

export function ActionForm({ action, onUpdate }: ActionFormProps) {
  const [config, setConfig] = useState<Record<string, any>>(action.config || {})

  useEffect(() => {
    setConfig(action.config || {})
  }, [action])

  const handleChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    onUpdate(newConfig)
  }

  const renderFormFields = () => {
    switch (action.type) {
      case "alert":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="alert-message">Alert Message</Label>
              <Textarea
                id="alert-message"
                value={config.message || ""}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="What message should pop up?"
                className="mt-1 min-h-[100px]"
              />
              {/* Little helper text */}
              <p className="text-xs text-muted-foreground mt-1">This will show as a browser alert popup</p>
            </div>
          </div>
        )

      case "showText":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-content">Text Content</Label>
              <Textarea
                id="text-content"
                value={config.text || ""}
                onChange={(e) => handleChange("text", e.target.value)}
                placeholder="Enter text to display"
                className="mt-1"
              />
            </div>
          </div>
        )

      case "showImage":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={config.url || ""}
                onChange={(e) => handleChange("url", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mt-1"
              />
              {/* Preview if URL exists */}
              {config.url && (
                <div className="mt-3 border rounded-md p-2 bg-muted/30">
                  <p className="text-xs mb-1">Preview:</p>
                  <img
                    src={config.url || "/placeholder.svg"}
                    alt="Preview"
                    className="max-h-[100px] max-w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=100&width=200"
                      e.currentTarget.alt = "Invalid image URL"
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )

      case "setLocalStorage":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="storage-key">Key</Label>
              <Input
                id="storage-key"
                value={config.key || ""}
                onChange={(e) => handleChange("key", e.target.value)}
                placeholder="Enter storage key"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="storage-value">Value</Label>
              <Input
                id="storage-value"
                value={config.value || ""}
                onChange={(e) => handleChange("value", e.target.value)}
                placeholder="Enter storage value"
                className="mt-1"
              />
            </div>
          </div>
        )

      case "getLocalStorage":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="get-storage-key">Key to Retrieve</Label>
              <Input
                id="get-storage-key"
                value={config.key || ""}
                onChange={(e) => handleChange("key", e.target.value)}
                placeholder="Enter storage key to retrieve"
                className="mt-1"
              />
            </div>
          </div>
        )

      case "promptAndShow":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt-message">Prompt Message</Label>
              <Input
                id="prompt-message"
                value={config.promptMessage || ""}
                onChange={(e) => handleChange("promptMessage", e.target.value)}
                placeholder="Enter prompt message"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="prefix">Text Prefix (before user input)</Label>
              <Input
                id="prefix"
                value={config.prefix || ""}
                onChange={(e) => handleChange("prefix", e.target.value)}
                placeholder="Hello,"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="suffix">Text Suffix (after user input)</Label>
              <Input
                id="suffix"
                value={config.suffix || ""}
                onChange={(e) => handleChange("suffix", e.target.value)}
                placeholder="!"
                className="mt-1"
              />
            </div>
          </div>
        )

      case "changeButtonColor":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="button-color">Button Color (leave empty for random)</Label>
              <Input
                id="button-color"
                type="color"
                value={config.color || "#000000"}
                onChange={(e) => handleChange("color", e.target.value)}
                className="mt-1 h-10"
              />
              <div className="mt-2 flex items-center gap-2">
                <Input
                  type="text"
                  value={config.color || ""}
                  onChange={(e) => handleChange("color", e.target.value)}
                  placeholder="#000000 or rgb(0,0,0)"
                />
                <button
                  type="button"
                  className="rounded-md border px-3 py-1 text-xs"
                  onClick={() => handleChange("color", "")}
                >
                  Random
                </button>
              </div>
            </div>
          </div>
        )

      // For actions that don't need configuration
      case "refreshPage":
      case "increaseButtonSize":
      case "closeWindow":
      case "disableButton":
        return (
          <div className="py-2 text-sm text-muted-foreground">
            This action doesn't require any configuration. It will disable the button after execution.
          </div>
        )

      default:
        return (
          <div className="py-2 text-sm text-muted-foreground">
            No configuration options available for this action type.
          </div>
        )
    }
  }

  return <div className="space-y-4">{renderFormFields()}</div>
}

