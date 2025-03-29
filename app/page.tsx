import { Button } from "@/components/ui/button"
import Link from "next/link"
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 bg-gradient-to-b from-background to-muted/30">
      <div className="text-center max-w-md">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">Dynamic Button Workflow</h1>
        <p className="text-muted-foreground">
          Build your own interactive button with custom actions. No coding required!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <Link href="/config">
          <Button size="lg" className="min-w-[180px]">
            Configure Workflow
          </Button>
        </Link>
        <Link href="/output">
          <Button size="lg" variant="outline" className="min-w-[180px]">
            Test Your Button
          </Button>
        </Link>
      </div>

      {/* Little hint for new users */}
      <p className="text-xs text-muted-foreground mt-8 max-w-md text-center">
        Tip: Start by configuring your button, then test it out on the test page!
      </p>
    </div>
  )
}

