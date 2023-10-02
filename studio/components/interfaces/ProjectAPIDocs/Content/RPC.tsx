import { useParams } from 'common'
import { Badge } from 'ui'

import Table from 'components/to-be-cleaned/Table'
import { useProjectJsonSchemaQuery } from 'data/docs/project-json-schema-query'
import { useStore } from 'hooks'
import { useAppStateSnapshot } from 'state/app-state'
import { DOCS_RESOURCE_CONTENT } from '../ProjectAPIDocs.constants'
import ResourceContent from '../ResourceContent'

const RPC = () => {
  const { ref } = useParams()
  const { meta } = useStore()
  const snap = useAppStateSnapshot()
  const { data: jsonSchema } = useProjectJsonSchemaQuery({ projectRef: ref })

  const selectedLanguage = 'js'
  const rpcName = snap.activeDocsSection[1]
  const rpc = meta.openApi.data?.functions.find((fn) => fn.name === rpcName)
  const rpcJsonSchema = jsonSchema.paths[rpc?.path]

  const summary = rpcJsonSchema?.post.summary
  const parameters = rpc?.get.parameters ?? []

  if (rpc === undefined) return null

  return (
    <div className="divide-y">
      <div className="space-y-1 px-4 py-6">
        <h2 className="text-xl">{rpc.name}</h2>
        <p className="text-sm text-foreground-light">{summary ?? 'No description available'}</p>
      </div>
      <div className="space-y-2 px-4 py-4">
        <p className="text-sm text-foreground-light">Function arguments</p>
        <Table
          head={[
            <Table.th key="name">Name</Table.th>,
            <Table.th key="format">Format</Table.th>,
            <Table.th key="type">Type</Table.th>,
            <Table.th key="required"></Table.th>,
          ]}
          body={parameters.map((parameter: any) => (
            <Table.tr key={parameter.name}>
              <Table.td title={parameter.name}>
                <p className="font-mono text-xs text-foreground truncate">{parameter.name}</p>
              </Table.td>
              <Table.td title={parameter.format}>{parameter.format}</Table.td>
              <Table.td title={parameter.type}>{parameter.type}</Table.td>
              <Table.td>
                {parameter.required ? (
                  <Badge color="amber">Required</Badge>
                ) : (
                  <p className="text-foreground-light">Optional</p>
                )}
              </Table.td>
            </Table.tr>
          ))}
        />
      </div>
      <ResourceContent
        selectedLanguage={selectedLanguage}
        snippet={DOCS_RESOURCE_CONTENT.rpcSingle}
        codeSnippets={DOCS_RESOURCE_CONTENT.rpcSingle.code({
          rpcName,
          rpcParams: parameters,
          endpoint: 'endpoint',
          apiKey: 'apiKey',
          showBearer: true,
        })}
      />
    </div>
  )
}

export default RPC
