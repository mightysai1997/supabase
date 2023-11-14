import { useParams, useTelemetryProps } from 'common'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import {
  AlertDescription_Shadcn_,
  AlertTitle_Shadcn_,
  Alert_Shadcn_,
  Button,
  CommandGroup_Shadcn_,
  CommandItem_Shadcn_,
  CommandList_Shadcn_,
  Command_Shadcn_,
  IconAlertTriangle,
  IconCheck,
  IconChevronDown,
  IconExternalLink,
  Input,
  PopoverContent_Shadcn_,
  PopoverTrigger_Shadcn_,
  Popover_Shadcn_,
  ScrollArea,
  Tabs,
} from 'ui'

import AlertError from 'components/ui/AlertError'
import Panel from 'components/ui/Panel'
import ShimmeringLoader from 'components/ui/ShimmeringLoader'
import { useProjectSettingsQuery } from 'data/config/project-settings-query'
import { useOrgSubscriptionQuery } from 'data/subscriptions/org-subscription-query'
import { useResourceWarningsQuery } from 'data/usage/resource-warnings-query'
import { useSelectedOrganization } from 'hooks'
import { pluckObjectFields } from 'lib/helpers'
import Telemetry from 'lib/telemetry'
import { MOCK_DATABASES } from '../../Infrastructure/InfrastructureConfiguration/InstanceConfiguration.constants'
import ConfirmDisableReadOnlyModeModal from './ConfirmDisableReadOnlyModal'
import ResetDbPassword from './ResetDbPassword'

const DatabaseSettings = () => {
  const router = useRouter()
  const { ref: projectRef, connectionString } = useParams()
  const telemetryProps = useTelemetryProps()
  const organization = useSelectedOrganization()
  const selectedOrganization = useSelectedOrganization()

  const connectionStringsRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)
  const [selectedDatabaseId, setSelectedDatabaseId] = useState<string>('1')
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const { data, error, isLoading, isError, isSuccess } = useProjectSettingsQuery({ projectRef })
  const { data: subscription } = useOrgSubscriptionQuery({ orgSlug: organization?.slug })
  const { data: resourceWarnings } = useResourceWarningsQuery()

  const isReadOnlyMode =
    (resourceWarnings ?? [])?.find((warning) => warning.project === projectRef)
      ?.is_readonly_mode_enabled ?? false

  const { project } = data ?? {}
  const DB_FIELDS = ['db_host', 'db_name', 'db_port', 'db_user', 'inserted_at']
  const connectionInfo =
    project !== undefined
      ? pluckObjectFields(project, DB_FIELDS)
      : { db_user: '', db_host: '', db_port: '', db_name: '' }

  const databases = MOCK_DATABASES
  const selectedDatabase = databases.find((db) => db.id.toString() === selectedDatabaseId)

  const handleCopy = (labelValue?: string) =>
    Telemetry.sendEvent(
      {
        category: 'settings',
        action: 'copy_connection_string',
        label: labelValue ? labelValue : '',
      },
      telemetryProps,
      router
    )
  const uriConnString =
    `postgresql://${connectionInfo.db_user}:[YOUR-PASSWORD]@` +
    `${connectionInfo.db_host}:${connectionInfo.db_port.toString()}` +
    `/${connectionInfo.db_name}`
  const golangConnString =
    `user=${connectionInfo.db_user} password=[YOUR-PASSWORD] ` +
    `host=${connectionInfo.db_host} port=${connectionInfo.db_port.toString()}` +
    ` dbname=${connectionInfo.db_name}`
  const psqlConnString =
    `psql -h ${connectionInfo.db_host} -p ` +
    `${connectionInfo.db_port.toString()} -d ${connectionInfo.db_name} ` +
    `-U ${connectionInfo.db_user}`

  useEffect(() => {
    if (connectionString !== undefined && connectionStringsRef.current !== undefined) {
      setSelectedDatabaseId(connectionString)
      connectionStringsRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [connectionString])

  return (
    <>
      <div className="space-y-10">
        <section className="space-y-6">
          <h3 className="text-foreground mb-2 text-xl">Database Settings</h3>

          {isReadOnlyMode && (
            <Alert_Shadcn_ variant="destructive">
              <IconAlertTriangle />
              <AlertTitle_Shadcn_>
                Project is in read-only mode and database is no longer accepting write requests
              </AlertTitle_Shadcn_>
              <AlertDescription_Shadcn_>
                You have reached 95% of your project's disk space, and read-only mode has been
                enabled to preserve your database's stability and prevent your project from
                exceeding its current billing plan. To resolve this, you may:
                <ul className="list-disc pl-6 mt-1">
                  <li>
                    Temporarily disable read-only mode to free up space and reduce your database
                    size
                  </li>
                  {subscription?.plan.id === 'free' ? (
                    <li>
                      <Link
                        href={`/org/${selectedOrganization?.slug}/billing?panel=subscriptionPlan`}
                      >
                        <a className="text underline">Upgrade to the Pro plan</a>
                      </Link>{' '}
                      to increase your database size limit to 8GB.
                    </li>
                  ) : subscription?.plan.id === 'pro' && subscription?.usage_billing_enabled ? (
                    <li>
                      <Link
                        href={`/org/${selectedOrganization?.slug}/billing?panel=subscriptionPlan`}
                      >
                        <a className="text-foreground underline">Disable your Spend Cap</a>
                      </Link>{' '}
                      to allow your project to auto-scale and expand beyond the 8GB database size
                      limit
                    </li>
                  ) : null}
                </ul>
              </AlertDescription_Shadcn_>
              <div className="mt-4 flex items-center space-x-2">
                <Button type="default" onClick={() => setShowConfirmationModal(true)}>
                  Disable read-only mode
                </Button>
                <Button asChild type="default" icon={<IconExternalLink />}>
                  <Link
                    href="https://supabase.com/docs/guides/platform/database-size#disabling-read-only-mode"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Learn more
                  </Link>
                </Button>
              </div>
            </Alert_Shadcn_>
          )}

          <Panel
            title={
              <h5 key="panel-title" className="mb-0">
                Connection info
              </h5>
            }
            className="!m-0"
          >
            <Panel.Content className="space-y-6">
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid gap-2 items-center md:grid md:grid-cols-12 md:gap-x-4 w-full"
                  >
                    <ShimmeringLoader className="h-4 w-1/3 col-span-4" delayIndex={i} />
                    <ShimmeringLoader className="h-8 w-full col-span-8" delayIndex={i} />
                  </div>
                ))}
              {isError && (
                <AlertError error={error} subject="Failed to retrieve database settings" />
              )}
              {isSuccess && (
                <>
                  <Input
                    className="input-mono"
                    layout="horizontal"
                    readOnly
                    copy
                    disabled
                    value={connectionInfo.db_host}
                    label="Host"
                    onCopy={() => {
                      handleCopy('Host')
                    }}
                  />

                  <Input
                    className="input-mono"
                    layout="horizontal"
                    readOnly
                    copy
                    disabled
                    value={connectionInfo.db_name}
                    label="Database name"
                  />

                  <Input
                    className="input-mono"
                    layout="horizontal"
                    readOnly
                    copy
                    disabled
                    value={connectionInfo.db_port.toString()}
                    label="Port"
                  />

                  <Input
                    layout="horizontal"
                    className="input-mono table-input-cell text-base"
                    readOnly
                    copy
                    disabled
                    value={connectionInfo.db_user}
                    label="User"
                  />

                  <Input
                    className="input-mono"
                    layout="horizontal"
                    disabled
                    readOnly
                    value={'[The password you provided when you created this project]'}
                    label="Password"
                  />
                </>
              )}
            </Panel.Content>
          </Panel>
        </section>

        <ResetDbPassword disabled={isLoading || isError} />

        <section className="space-y-6">
          <Panel
            title={
              <div ref={connectionStringsRef} className="w-full flex items-center justify-between">
                <h5 key="panel-title" className="mb-0">
                  Connection string
                </h5>
                <Popover_Shadcn_ open={open} onOpenChange={setOpen} modal={false}>
                  <PopoverTrigger_Shadcn_ asChild>
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <Button
                        type="default"
                        className="pr-2"
                        iconRight={
                          <IconChevronDown
                            className="text-foreground-light"
                            strokeWidth={2}
                            size={12}
                          />
                        }
                      >
                        Database:{' '}
                        <span className="capitalize">
                          {(selectedDatabase?.type ?? '').split('_').join(' ').toLowerCase()}
                        </span>{' '}
                        {selectedDatabase?.type === 'READ_REPLICA' && (
                          <span>(ID: {selectedDatabase?.id})</span>
                        )}
                      </Button>
                    </div>
                  </PopoverTrigger_Shadcn_>
                  <PopoverContent_Shadcn_ className="p-0 w-48" side="bottom" align="end">
                    <Command_Shadcn_>
                      <CommandList_Shadcn_>
                        <CommandGroup_Shadcn_>
                          <ScrollArea className={(databases || []).length > 7 ? 'h-[210px]' : ''}>
                            {databases?.map((database) => {
                              return (
                                <CommandItem_Shadcn_
                                  key={database.id}
                                  value={database.id.toString()}
                                  className="cursor-pointer w-full"
                                  onSelect={() => {
                                    setSelectedDatabaseId(database.id.toString())
                                    setOpen(false)
                                  }}
                                  onClick={() => {
                                    setSelectedDatabaseId(database.id.toString())
                                    setOpen(false)
                                  }}
                                >
                                  <div className="w-full flex items-center justify-between">
                                    <p>
                                      {database.type === 'PRIMARY'
                                        ? 'Primary database'
                                        : `Read replica (ID: ${database.id})`}
                                    </p>
                                    {database.id.toString() === selectedDatabaseId && <IconCheck />}
                                  </div>
                                </CommandItem_Shadcn_>
                              )
                            })}
                          </ScrollArea>
                        </CommandGroup_Shadcn_>
                      </CommandList_Shadcn_>
                    </Command_Shadcn_>
                  </PopoverContent_Shadcn_>
                </Popover_Shadcn_>
              </div>
            }
            className="!m-0"
          >
            <Panel.Content>
              {isLoading && <ShimmeringLoader className="h-8 w-full" />}
              {isError && (
                <AlertError error={error} subject="Failed to retrieve database settings" />
              )}
              {isSuccess && (
                <Tabs type="underlined" size="small">
                  <Tabs.Panel id="psql" label="PSQL">
                    <Input
                      copy
                      readOnly
                      disabled
                      value={psqlConnString}
                      onCopy={() => {
                        handleCopy('PSQL')
                      }}
                    />
                  </Tabs.Panel>

                  <Tabs.Panel id="uri" label="URI">
                    <Input
                      copy
                      readOnly
                      disabled
                      value={uriConnString}
                      onCopy={() => {
                        handleCopy('URI')
                      }}
                    />
                  </Tabs.Panel>

                  <Tabs.Panel id="golang" label="Golang">
                    <Input
                      copy
                      readOnly
                      disabled
                      value={golangConnString}
                      onCopy={() => {
                        handleCopy('Golang')
                      }}
                    />
                  </Tabs.Panel>

                  <Tabs.Panel id="jdbc" label="JDBC">
                    <Input
                      copy
                      readOnly
                      disabled
                      value={
                        `jdbc:postgresql://${
                          connectionInfo.db_host
                        }:${connectionInfo.db_port.toString()}` +
                        `/${connectionInfo.db_name}?user=${connectionInfo.db_user}&password=[YOUR-PASSWORD]`
                      }
                      onCopy={() => {
                        handleCopy('JDBC')
                      }}
                    />
                  </Tabs.Panel>

                  <Tabs.Panel id="dotnet" label=".NET">
                    <Input
                      copy
                      readOnly
                      disabled
                      value={
                        `User Id=${connectionInfo.db_user};Password=[YOUR-PASSWORD];` +
                        `Server=${
                          connectionInfo.db_host
                        };Port=${connectionInfo.db_port.toString()};` +
                        `Database=${connectionInfo.db_name}`
                      }
                      onCopy={() => {
                        handleCopy('.NET')
                      }}
                    />
                  </Tabs.Panel>

                  <Tabs.Panel id="nodejs" label="Nodejs">
                    <Input
                      copy
                      readOnly
                      disabled
                      value={uriConnString}
                      onCopy={() => {
                        handleCopy('Nodejs')
                      }}
                    />
                  </Tabs.Panel>

                  <Tabs.Panel id="php" label="PHP">
                    <Input
                      copy
                      readOnly
                      disabled
                      value={golangConnString}
                      onCopy={() => {
                        handleCopy('PHP')
                      }}
                    />
                  </Tabs.Panel>

                  <Tabs.Panel id="python" label="Python">
                    <Input
                      copy
                      readOnly
                      disabled
                      value={
                        `user=${connectionInfo.db_user} password=[YOUR-PASSWORD]` +
                        ` host=${
                          connectionInfo.db_host
                        } port=${connectionInfo.db_port.toString()}` +
                        ` database=${connectionInfo.db_name}`
                      }
                      onCopy={() => {
                        handleCopy('Python')
                      }}
                    />
                  </Tabs.Panel>
                </Tabs>
              )}
            </Panel.Content>
          </Panel>
        </section>
      </div>

      <ConfirmDisableReadOnlyModeModal
        visible={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
      />
    </>
  )
}

export default DatabaseSettings
