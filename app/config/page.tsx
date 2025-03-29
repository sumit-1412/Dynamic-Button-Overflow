"use client"

// This is the main configuration page where users can build their button workflow
// It handles adding, removing, and reordering actions in the workflow

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowLeft, Plus, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { ActionItem } from "@/components/action-item"
import { ActionForm } from "@/components/action-form"
import { WorkflowPreview } from "@/components/workflow-preview"
import { useToast } from "@/hooks/use-toast"

export type Action = {
  id: string
  type: string
  config: Record<string, any>
}

export default function ConfigPage() {
  const { toast } = useToast()
  const [buttonLabel, setButtonLabel] = useState("Click Me!")
  const [actions, setActions] = useState<Action[]>([])
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  useEffect(() => {
    // Load config from localStorage on mount
    const savedConfig = localStorage.getItem("buttonWorkflow")
    if (savedConfig) {
      const { label, actions: savedActions } = JSON.parse(savedConfig)
      setButtonLabel(label)
      setActions(savedActions)
    }
  }, [])

  const handleAddAction = (type: string) => {
    const newAction: Action = {
      id: `action-${Date.now()}`,
      type,
      config: {},
    }
    setActions([...actions, newAction])
    setSelectedAction(newAction.id)
  }

  const handleRemoveAction = (id: string) => {
    setActions(actions.filter((action) => action.id !== id))
    if (selectedAction === id) {
      setSelectedAction(null)
    }
  }

  const handleUpdateAction = (id: string, config: Record<string, any>) => {
    setActions(actions.map((action) => (action.id === id ? { ...action, config } : action)))
  }

  const handleMoveAction = (dragIndex: number, hoverIndex: number) => {
    const newActions = [...actions]
    const draggedAction = newActions[dragIndex]
    newActions.splice(dragIndex, 1)
    newActions.splice(hoverIndex, 0, draggedAction)
    setActions(newActions)
  }

  const saveWorkflow = () => {
    const workflow = {
      label: buttonLabel,
      actions,
    }
    localStorage.setItem("buttonWorkflow", JSON.stringify(workflow))

    // Show a success message
    toast({
      title: "Workflow saved! 🎉",
      description: "Your button is ready to test.",
    })
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto max-w-5xl p-4">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Configure Button Workflow</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Button Settings</CardTitle>
                <CardDescription>Customize how your button looks and behaves</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="button-label">Button Label</Label>
                    <Input
                      id="button-label"
                      value={buttonLabel}
                      onChange={(e) => setButtonLabel(e.target.value)}
                      placeholder="Enter button text"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Workflow Actions</CardTitle>
                  <CardDescription>Define what happens when the button is clicked</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => saveWorkflow()}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Workflow
                </Button>
              </CardHeader>
              <CardContent>
                {actions.length === 0 ? (
                  <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center bg-muted/30">
                    <AlertCircle className="mb-2 h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Your workflow is empty. Add some actions to get started!
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Try adding an Alert action first</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {actions.map((action, index) => (
                      <ActionItem
                        key={action.id}
                        action={action}
                        index={index}
                        isSelected={selectedAction === action.id}
                        onSelect={() => setSelectedAction(action.id)}
                        onRemove={() => handleRemoveAction(action.id)}
                        onMove={handleMoveAction}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleAddAction("alert")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Alert
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAddAction("showText")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Show Text
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAddAction("showImage")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Show Image
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    // Reset everything when clearing
                    setActions([])
                    setSelectedAction(null)
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </CardFooter>
            </Card>

            {selectedAction && (
              <Card>
                <CardHeader>
                  <CardTitle>Configure Action</CardTitle>
                  <CardDescription>Set parameters for the selected action</CardDescription>
                </CardHeader>
                <CardContent>
                  <ActionForm
                    action={actions.find((a) => a.id === selectedAction)!}
                    onUpdate={(config) => handleUpdateAction(selectedAction, config)}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Tabs defaultValue="add">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="add">Add Actions</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="add" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Actions</CardTitle>
                    <CardDescription>Click to add to your workflow</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleAddAction("alert")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Alert
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddAction("showText")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Show Text
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddAction("showImage")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Show Image
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddAction("refreshPage")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Refresh Page
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddAction("setLocalStorage")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Set LocalStorage
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddAction("getLocalStorage")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Get LocalStorage
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddAction("increaseButtonSize")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Increase Button Size
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddAction("closeWindow")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Close Window
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddAction("promptAndShow")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Prompt and Show
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddAction("changeButtonColor")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Change Button Color
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAddAction("disableButton")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Disable Button
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="preview" className="pt-4">
                <WorkflowPreview buttonLabel={buttonLabel} actions={actions} />
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Test Your Button</CardTitle>
                <CardDescription>Save and try your workflow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={saveWorkflow} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Workflow
                </Button>
                <Link href="/output" className="block w-full">
                  <Button variant="outline" className="w-full">
                    Test Button
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DndProvider>
  )
}

