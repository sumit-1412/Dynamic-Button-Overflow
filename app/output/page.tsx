"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import type { Action } from "../config/page"

export default function OutputPage() {
  const [buttonLabel, setButtonLabel] = useState("Click Me!")
  const [actions, setActions] = useState<Action[]>([])
  const [outputElements, setOutputElements] = useState<React.ReactNode[]>([])
  const [buttonSize, setButtonSize] = useState(1)
  const [buttonColor, setButtonColor] = useState("")
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Load config from localStorage on mount
    const savedConfig = localStorage.getItem("buttonWorkflow")
    if (savedConfig) {
      const { label, actions: savedActions } = JSON.parse(savedConfig)
      setButtonLabel(label)
      setActions(savedActions)
    }
  }, [])

  const executeAction = async (action: Action, index: number) => {
    const { type, config } = action

    switch (type) {
      case "alert":
        alert(config.message || "Alert!")
        break

      case "showText":
        setOutputElements((prev) => [
          ...prev,
          <div key={`text-${index}`} className="mt-4 rounded-md bg-muted p-4">
            {config.text || "Text content"}
          </div>,
        ])
        break

      case "showImage":
        if (config.url) {
          setOutputElements((prev) => [
            ...prev,
            <div key={`image-${index}`} className="mt-4 flex justify-center">
              <Image
                src={config.url || "/placeholder.svg"}
                alt="Workflow image"
                width={300}
                height={200}
                className="rounded-md"
              />
            </div>,
          ])
        }
        break

      case "refreshPage":
        window.location.reload()
        break

      case "setLocalStorage":
        if (config.key) {
          localStorage.setItem(config.key, config.value || "")
          setOutputElements((prev) => [
            ...prev,
            <div key={`storage-set-${index}`} className="mt-4 rounded-md bg-muted p-4">
              Saved to localStorage: {config.key} = {config.value || ""}
            </div>,
          ])
        }
        break

      case "getLocalStorage":
        if (config.key) {
          const value = localStorage.getItem(config.key) || "Not found"
          setOutputElements((prev) => [
            ...prev,
            <div key={`storage-get-${index}`} className="mt-4 rounded-md bg-muted p-4">
              Retrieved from localStorage: {config.key} = {value}
            </div>,
          ])
        }
        break

      case "increaseButtonSize":
        setButtonSize((prev) => prev + 0.2)
        break

      case "closeWindow":
        window.close()
        break

      case "promptAndShow":
        const promptMessage = config.promptMessage || "Please enter a value:"
        const userInput = prompt(promptMessage)
        if (userInput !== null) {
          setOutputElements((prev) => [
            ...prev,
            <div key={`prompt-${index}`} className="mt-4 rounded-md bg-muted p-4">
              {config.prefix || ""} {userInput} {config.suffix || ""}
            </div>,
          ])
        }
        break

      case "changeButtonColor":
        if (config.color) {
          setButtonColor(config.color)
        } else {
          // Generate random color
          const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`
          setButtonColor(randomColor)
        }
        break

      case "disableButton":
        setButtonDisabled(true)
        break

      default:
        console.warn(`Unknown action type: ${type}`)
    }

    // Add a small delay between actions for better UX
    return new Promise((resolve) => setTimeout(resolve, 300))
  }

  const handleButtonClick = async () => {
    // Clear previous outputs
    setOutputElements([])

    // Execute each action in sequence
    for (let i = 0; i < actions.length; i++) {
      await executeAction(actions[i], i)
    }
  }

  const buttonStyle = {
    transform: `scale(${buttonSize})`,
    backgroundColor: buttonColor || undefined,
    transition: "transform 0.3s, background-color 0.3s",
  }

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Test Your Button</h1>
      </div>

      <Card className="flex flex-col items-center justify-center p-8 md:p-12 border-2">
        <div className="mb-8 text-center max-w-md">
          <h2 className="mb-3 text-xl font-semibold">Your Button is Ready!</h2>
          <p className="text-muted-foreground">Click it to see your workflow in action</p>
        </div>

        <div className="mb-10 flex justify-center">
          <Button
            ref={buttonRef}
            size="lg"
            style={buttonStyle}
            disabled={buttonDisabled}
            onClick={handleButtonClick}
            className="px-8 py-6 text-lg transition-all"
          >
            {buttonLabel}
          </Button>
        </div>

        {outputElements.length > 0 && (
          <div className="w-full space-y-3">
            <h3 className="mb-2 text-lg font-medium border-b pb-2">Output:</h3>
            <div className="space-y-4">{outputElements}</div>
          </div>
        )}
      </Card>

      <div className="mt-8 flex justify-center">
        <Link href="/config">
          <Button variant="outline" className="px-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Configuration
          </Button>
        </Link>
      </div>
    </div>
  )
}

