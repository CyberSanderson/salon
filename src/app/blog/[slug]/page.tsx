import { getPostData, getAllPostIds } from '@/lib/posts'
import Image from 'next/image'
import Link from 'next/link'

// This function tells Next.js which blog posts exist so it can generate them
export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths.map((path) => ({ slug: path.params.slug }))
}

// This function fetches the metadata (like the title) for a specific post for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const postData = await getPostData(params.slug)
  return {
    title: postData.title,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const postData = await getPostData(params.slug)

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-6 prose lg:prose-xl">
        {/* Post Header */}
        <h1>{postData.title}</h1>

        {/* Header Image */}
        <div className="relative my-8 h-96 w-full">
          <Image
            src={postData.image}
            alt={postData.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* Post Content, rendered from Markdown */}
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />

        {/* Final CTA */}
        <div className="text-center mt-12 p-8 bg-teal-50 rounded-lg">
          <h3 className="text-2xl font-bold">Ready to End No-Shows for Good?</h3>
          <p className="mt-2">
            See how Ariah Desk can transform your booking process and give you
            back your time. Check out our{' '}
            <Link href="/#pricing" className="text-teal-600 font-semibold">
              simple, transparent pricing plans
            </Link>{' '}
            and start your free trial today.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block px-8 py-3 bg-yellow-500 text-white font-semibold rounded-full shadow-lg hover:bg-yellow-600 transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
      </div>
    </div>
  )
}