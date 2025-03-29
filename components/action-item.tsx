"use client"

import { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { Button } from "@/components/ui/button"
import { Grip, Trash2 } from "lucide-react"
import type { Action } from "@/app/config/page"

interface ActionItemProps {
  action: Action
  index: number
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  onMove: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

export function ActionItem({ action, index, isSelected, onSelect, onRemove, onMove }: ActionItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag, preview] = useDrag({
    type: "ACTION_ITEM",
    item: { index, id: action.id, type: "ACTION_ITEM" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ handlerId }, drop] = useDrop({
    accept: "ACTION_ITEM",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  drag(drop(ref))

  // Get a human-readable name for the action type
  const getActionName = (type: string) => {
    const names: Record<string, string> = {
      alert: "Alert",
      showText: "Show Text",
      showImage: "Show Image",
      refreshPage: "Refresh Page",
      setLocalStorage: "Set LocalStorage",
      getLocalStorage: "Get LocalStorage",
      increaseButtonSize: "Increase Button Size",
      closeWindow: "Close Window",
      promptAndShow: "Prompt and Show",
      changeButtonColor: "Change Button Color",
      disableButton: "Disable Button",
    }
    return names[type] || type
  }

  // Get a summary of the action configuration
  const getActionSummary = (action: Action) => {
    const { type, config } = action

    switch (type) {
      case "alert":
        return config.message ? `"${config.message}"` : ""
      case "showText":
        return config.text ? `"${config.text}"` : ""
      case "showImage":
        return config.url ? `URL: ${config.url.substring(0, 20)}...` : ""
      case "setLocalStorage":
        return config.key ? `${config.key} = ${config.value || ""}` : ""
      case "getLocalStorage":
        return config.key ? `Key: ${config.key}` : ""
      case "promptAndShow":
        return config.promptMessage ? `"${config.promptMessage}"` : ""
      case "changeButtonColor":
        return config.color ? `Color: ${config.color}` : "Random color"
      default:
        return ""
    }
  }

  return (
    <div
      ref={preview}
      className={`flex items-center rounded-md border p-2 transition-all hover:border-primary/50 ${
        isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border"
      } ${isDragging ? "opacity-50" : "opacity-100"}`}
      onClick={onSelect}
      data-handler-id={handlerId}
    >
      <div ref={ref} className="cursor-move p-1 mr-1 hover:text-primary">
        <Grip className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="ml-1 flex-1">
        <div className="font-medium">{getActionName(action.type)}</div>
        {getActionSummary(action) && (
          <div className="text-xs text-muted-foreground truncate max-w-[200px]">{getActionSummary(action)}</div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-70 hover:opacity-100 hover:text-red-500"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

