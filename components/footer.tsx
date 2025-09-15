import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn("pt-16 pb-8 border-t", "dark:glass-dark glass")}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Luo Ancient Movies</h3>
            <p className="text-muted-foreground mb-4">
              Experience the rich heritage of Luo culture through our curated collection of ancient movies and series.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Browse</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/movies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/series" className="text-muted-foreground hover:text-foreground transition-colors">
                  Series
                </Link>
              </li>
              <li>
                <Link href="/updates" className="text-muted-foreground hover:text-foreground transition-colors">
                  Updates
                </Link>
              </li>
              <li>
                <Link href="/subscription" className="text-muted-foreground hover:text-foreground transition-colors">
                  Subscription
                </Link>
              </li>
              <li>
                <Link href="/genres" className="text-muted-foreground hover:text-foreground transition-colors">
                  Genres
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/customer-service"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Customer Service
                </Link>
              </li>
              <li>
                <Link href="/subscription" className="text-muted-foreground hover:text-foreground transition-colors">
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">Koch Goma, Uganda</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">+256 789 096 965</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">lightstarecord@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Luo Ancient Movies. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
