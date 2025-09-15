import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface NewsletterSectionProps {
  className?: string
}

export function NewsletterSection({ className }: NewsletterSectionProps) {
  return (
    <section className={cn("py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center glass dark:glass-dark rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>

          <form className="flex flex-col sm:flex-row gap-3">
            <Input type="email" placeholder="Your email address" className="flex-1 rounded-full" required />
            <Button type="submit" className="rounded-full">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
