import { createClient } from '@/utils/supabase/server'
import HomePageClient from '@/components/HomePageClient'

export default async function HomePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // The '!!user' syntax is a shortcut to turn the user object (or null)
  // into a true/false boolean value.
  return <HomePageClient isLoggedIn={!!user} />
}
