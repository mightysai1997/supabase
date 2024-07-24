import { useState } from 'react'

import {
  ScaffoldContainer,
  ScaffoldSection,
  ScaffoldSectionContent,
  ScaffoldSectionDetail,
} from 'components/layouts/Scaffold'
import { useIntegrationDirectoryEntryDeleteMutation } from 'data/integrations-directory/integration-directory-entry-delete-mutation'
import { useIntegrationsDirectoryQuery } from 'data/integrations-directory/integrations-directory-query'
import { useSelectedOrganization } from 'hooks/misc/useSelectedOrganization'
import toast from 'react-hot-toast'
import { Button, Sheet, SheetContent } from 'ui'
import ConfirmationModal from 'ui-patterns/Dialogs/ConfirmationModal'
import { CreateIntegrationSheet } from './CreateIntegrationSheet'
import IntegrationsDirectoryPlanNotice from 'components/interfaces/Organization/IntegrationSettings/IntegrationsDirectoryPlanNotice'
import { useOrgSubscriptionQuery } from 'data/subscriptions/org-subscription-query'
import { getURL } from 'lib/helpers'

const SupabaseSection = () => {
  const organization = useSelectedOrganization()
  const { data: subscription } = useOrgSubscriptionQuery({ orgSlug: organization?.slug })
  const isFreePlan = subscription?.plan.id === 'free'
  const [showDeleteEntryDialog, setShowDeleteEntryDialog] = useState(false)

  const { data, isLoading, isSuccess, isError } = useIntegrationsDirectoryQuery(
    { orgSlug: organization?.slug! },
    { enabled: !!organization?.slug }
  )
  const { mutate: deleteIntegrationEntry, isLoading: isDeleting } =
    useIntegrationDirectoryEntryDeleteMutation({
      onSuccess: () => {
        toast.success('Successfully deleted integration entry.')

        setShowDeleteEntryDialog(false)
        setVisible(false)
      },
    })

  const entries = data || []

  const entry = entries.find((entry) => entry.approved)
  const draftEntry = entries.find((entry) => !entry.approved)

  const [visible, setVisible] = useState(false)

  return (
    <ScaffoldContainer>
      <ScaffoldSection>
        <ScaffoldSectionDetail title="Integrations Directory Entry">
          <p>
            Add your own integrations to{' '}
            <a
              className="cursor-pointer"
              href={`${process.env.NEXT_PUBLIC_SITE_URL}/partners/integrations`}
              target="_blank"
            >
              our Integrations Directory
            </a>
          </p>
        </ScaffoldSectionDetail>
        {isFreePlan && (
          <ScaffoldSectionContent>
            <IntegrationsDirectoryPlanNotice />
          </ScaffoldSectionContent>
        )}
        {!isFreePlan && (
          <ScaffoldSectionContent>
            {isLoading && <div>Loading...</div>}

            {isSuccess && (
              <>
                {/* 
                The logic here handles the following cases:
                - if there's no entry, Submit draft application for review
                - if there's no entry and a draft, Edit draft application
                - if there's an entry and no draft, Submit draft application for review
                - if there's an entry and a draft, Edit draft application 
              */}
                {!entry && !draftEntry && (
                  <div className="prose text-sm">
                    <p>
                      If you want your integration to be listed in{' '}
                      <a
                        className="cursor-pointer"
                        href={`${process.env.NEXT_PUBLIC_SITE_URL}/partners/integrations`}
                        target="_blank"
                      >
                        our Integrations Directory
                      </a>
                      , please submit an application. We will review it and get back to you.
                    </p>
                    <Button type="primary" className="w-fit" onClick={() => setVisible(true)}>
                      Submit an application
                    </Button>
                  </div>
                )}
                {!entry && draftEntry && (
                  <div className="prose text-sm">
                    <p>
                      Your entry awaits approval by Supabase team. In the meantime, you can see the
                      preview{' '}
                      <a
                        className="cursor-pointer"
                        href={`${process.env.NEXT_PUBLIC_SITE_URL}/partners/integrations/${draftEntry?.slug}?preview_token=${draftEntry?.preview_token}`}
                        target="_blank"
                      >
                        here
                      </a>
                      . Once you're finished with the draft and want to submit the draft for review,
                      please contact us via support.
                    </p>
                    <Button type="primary" className="w-fit" onClick={() => setVisible(true)}>
                      Edit draft for review
                    </Button>
                  </div>
                )}
                {entry && !draftEntry && (
                  <div className="prose text-sm text-foreground-light">
                    <p>
                      Your integration entry is live at{' '}
                      <a
                        className="cursor-pointer"
                        href={`${process.env.NEXT_PUBLIC_SITE_URL}/partners/integrations/${entry.slug}`}
                        target="_blank"
                      >
                        {process.env.NEXT_PUBLIC_SITE_URL}/partners/integrations/{entry.slug}
                      </a>
                      . If you want to remove your integration from our directory,{' '}
                      <a className="cursor-pointer" onClick={() => setShowDeleteEntryDialog(true)}>
                        click here.
                      </a>
                    </p>
                    <Button type="primary" className="w-fit" onClick={() => setVisible(true)}>
                      Submit draft for review
                    </Button>
                  </div>
                )}
                {entry && draftEntry && (
                  <>
                    <div className="prose text-sm text-foreground-light">
                      Your integration entry is live at{' '}
                      <a
                        className="cursor-pointer"
                        href={`${process.env.NEXT_PUBLIC_SITE_URL}/partners/integrations/${entry.slug}`}
                        target="_blank"
                      >
                        {process.env.NEXT_PUBLIC_SITE_URL}/partners/integrations/{entry.slug}
                      </a>
                      . If you want to remove your integration from our directory,{' '}
                      <a className="cursor-pointer" onClick={() => setShowDeleteEntryDialog(true)}>
                        click here.
                      </a>{' '}
                    </div>
                    <div className="prose text-sm">
                      <p>
                        Your entry updates await approval by Supabase team. In the meantime, you can
                        see the preview{' '}
                        <a
                          className="cursor-pointer"
                          href={`${process.env.NEXT_PUBLIC_SITE_URL}/partners/integrations/${draftEntry?.slug}?preview_token=${draftEntry?.preview_token}`}
                          target="_blank"
                        >
                          here
                        </a>
                        . Once you're finished with the draft and want to submit the draft for
                        review, please contact us via support.
                      </p>
                      <Button type="primary" className="w-fit" onClick={() => setVisible(true)}>
                        Edit draft for review
                      </Button>
                    </div>
                  </>
                )}

                <ConfirmationModal
                  visible={showDeleteEntryDialog}
                  title="Delete integration entry"
                  confirmLabel="Delete"
                  loading={isDeleting}
                  onCancel={() => setShowDeleteEntryDialog(false)}
                  onConfirm={() => {
                    if (entry) {
                      deleteIntegrationEntry({
                        orgSlug: organization!.slug,
                        entryId: entry?.id,
                      })
                    }
                  }}
                >
                  <p className="text-sm text-foreground-light">
                    Are you sure you want to delete the integration entry? This action cannot be
                    undone.
                  </p>
                </ConfirmationModal>
                <Sheet open={visible} onOpenChange={(open) => setVisible(open)}>
                  <SheetContent showClose={false} className="flex flex-col gap-0">
                    <CreateIntegrationSheet
                      setVisible={(open) => setVisible(open)}
                      integrationEntry={draftEntry || entry}
                    />
                  </SheetContent>
                </Sheet>
              </>
            )}
          </ScaffoldSectionContent>
        )}
      </ScaffoldSection>
    </ScaffoldContainer>
  )
}

export default SupabaseSection
