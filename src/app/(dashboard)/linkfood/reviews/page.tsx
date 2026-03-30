import { redirect } from "next/navigation"
import { hasModuleAccess } from "@/lib/permissions"
import ReviewsPage from "@/components/linkfood/reviews-page"

export default async function LinkfoodReviewsPage() {
  const hasAccess = await hasModuleAccess("LINKFOOD")
  if (!hasAccess) redirect("/")

  return <ReviewsPage />
}
