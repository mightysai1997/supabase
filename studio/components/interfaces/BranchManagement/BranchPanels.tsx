import { useParams } from 'common'
import dayjs from 'dayjs'
import Link from 'next/link'
import { PropsWithChildren, ReactNode } from 'react'
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconArrowRight,
  IconExternalLink,
  IconMoreVertical,
  IconShield,
  IconTrash,
} from 'ui'

import ShimmeringLoader from 'components/ui/ShimmeringLoader'
import { Branch } from 'data/branches/branches-query'
import { GitHubPullRequest } from 'data/integrations/integrations-github-pull-requests-query'
import { GitPullRequest } from 'lucide-react'

interface BranchManagementSectionProps {
  header: string
  footer?: ReactNode
}

export const BranchManagementSection = ({
  header,
  footer,
  children,
}: PropsWithChildren<BranchManagementSectionProps>) => {
  return (
    <div className="border rounded-lg">
      <div className="bg-surface-100 shadow-sm flex justify-between items-center px-6 py-2 rounded-t-lg text-sm">
        {header}
      </div>
      <div className="bg-surface border-t shadow-sm rounded-b-lg text-sm divide-y">{children}</div>
      {footer !== undefined && <div className="bg-surface-100 px-6 py-1 border-t">{footer}</div>}
    </div>
  )
}

export const BranchRowLoader = () => {
  return (
    <div className="flex items-center justify-between px-6 py-2.5">
      <div className="flex items-center gap-x-4">
        <ShimmeringLoader className="w-52" />
        <ShimmeringLoader className="w-52" />
      </div>
      <div className="flex items-center gap-x-4">
        <ShimmeringLoader className="w-52" />
        <ShimmeringLoader className="w-52" />
      </div>
    </div>
  )
}

export const BranchLoader = () => {
  return (
    <>
      <BranchRowLoader />
      <BranchRowLoader />
      <BranchRowLoader />
      <BranchRowLoader />
      <BranchRowLoader />
    </>
  )
}

interface BranchRowProps {
  branch: Branch
  isMain?: boolean
  repo?: string
  pullRequest?: GitHubPullRequest
  generateCreatePullRequestURL?: (branchName?: string) => string
  onSelectDeleteBranch?: () => void
}

export const BranchRow = ({
  branch,
  isMain = false,
  repo,
  pullRequest,
  generateCreatePullRequestURL,
  onSelectDeleteBranch,
}: BranchRowProps) => {
  const { ref } = useParams()
  const isActive = ref === branch?.project_ref

  const daysFromNow = dayjs().diff(dayjs(branch.created_at), 'day')
  const formattedTimeFromNow = dayjs(branch.created_at).fromNow()
  const formattedCreatedAt = dayjs(branch.created_at).format('DD MMM YYYY, HH:mm:ss (ZZ)')

  const pullRequestNumber = pullRequest?.url.split('/').slice(-1)[0]
  const createPullRequestURL =
    generateCreatePullRequestURL?.(branch.git_branch) ?? 'https://github.com'

  return (
    <div className="w-full flex items-center justify-between px-6 py-2.5">
      <div className="flex items-center gap-x-4">
        <Button
          type="default"
          icon={isMain && <IconShield strokeWidth={2} className="text-amber-900" />}
        >
          {branch.name}
        </Button>
        {isActive && <Badge color="slate">Current</Badge>}
        <p className="text-xs text-foreground-lighter">
          {daysFromNow > 1 ? `Created on ${formattedCreatedAt}` : `Created ${formattedTimeFromNow}`}
        </p>
      </div>
      <div className="flex items-center gap-x-8">
        {pullRequest !== undefined && (
          <div className="flex items-center">
            <p className="text-xs text-foreground-lighter mr-4">#{pullRequestNumber}</p>
            <div className="flex items-center gap-x-2 bg-brand-500 px-3 py-1 rounded-full">
              <GitPullRequest size={14} />
              <p className="text-xs">Open</p>
            </div>
            <IconArrowRight className="mx-1 text-foreground-light" strokeWidth={1.5} size={16} />
            {/* [Joshen TODO] Need API to return the target */}
            <Button type="default">main</Button>
          </div>
        )}
        {isMain ? (
          <div className="flex items-center gap-x-2">
            <Link passHref href={`https://github.com/${repo}`}>
              <Button asChild type="default" iconRight={<IconExternalLink />}>
                <a target="_blank" rel="noreferrer">
                  View Repository
                </a>
              </Button>
            </Link>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button type="text" icon={<IconMoreVertical />} className="px-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-0 w-56" side="bottom" align="end">
                <Link passHref href={`/project/${ref}/settings/integrations`}>
                  <DropdownMenuItem asChild className="gap-x-2">
                    <a>Change production branch</a>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-x-2">
            <Link passHref href={pullRequest?.url ?? createPullRequestURL}>
              <Button asChild type="default" iconRight={<IconExternalLink />}>
                <a target="_blank" rel="noreferrer">
                  {pullRequest !== undefined ? 'View Pull Request' : 'Create Pull Request'}
                </a>
              </Button>
            </Link>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button type="text" icon={<IconMoreVertical />} className="px-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-0 w-56" side="bottom" align="end">
                <DropdownMenuItem
                  className="gap-x-2"
                  onSelect={() => onSelectDeleteBranch?.()}
                  onClick={() => onSelectDeleteBranch?.()}
                >
                  <IconTrash size="tiny" />
                  <p>Delete branch</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  )
}
