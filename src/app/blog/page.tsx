import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'

export default function BlogPage() {
  const allPostsData = getSortedPostsData()

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-12">The Ariah Desk Blog</h1>
        <div className="max-w-3xl mx-auto space-y-8">
          {allPostsData.map(({ id, title, excerpt }) => (
            <div key={id} className="border-b pb-8">
              <h2 className="text-3xl font-bold hover:text-teal-500">
                <Link href={`/blog/${id}`}>{title}</Link>
              </h2>
              <p className="mt-2 text-gray-600">{excerpt}</p>
              <Link
                href={`/blog/${id}`}
                className="mt-4 inline-block text-teal-500 font-semibold"
              >
                Read More &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
