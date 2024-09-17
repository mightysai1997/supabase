import { Linkedin, Twitter, YCombinator } from 'icons'
import Link from 'next/link'

const ShareArticleActions = ({
  title,
  slug,
  iconSize = 20,
  basePath = 'https://supabase.com/blog/',
}: {
  title: string
  slug: string
  iconSize?: number
  basePath?: string
}) => {
  const permalink = encodeURIComponent(`${basePath}${slug}`)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className="mt-4 flex items-center gap-4">
      <Link
        aria-label="Share on X"
        href={`https://twitter.com/intent/tweet?url=${permalink}&text=${encodedTitle}`}
        target="_blank"
        className="text-foreground-lighter hover:text-foreground"
      >
        <Twitter size={iconSize} />
      </Link>

      <Link
        aria-label="Share on Linkedin"
        href={`https://www.linkedin.com/shareArticle?url=${permalink}&text=${encodedTitle}`}
        target="_blank"
        className="text-foreground-lighter hover:text-foreground"
      >
        <Linkedin size={iconSize} />
      </Link>
      <Link
        aria-label="Share on Hacker News"
        href={`https://news.ycombinator.com/submitlink?u=${permalink}&t=${encodedTitle}`}
        target="_blank"
        className="text-foreground-lighter hover:text-foreground"
      >
        <YCombinator size={iconSize} />
      </Link>
    </div>
  )
}

export default ShareArticleActions
