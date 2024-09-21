import { PostgresMaterializedView, PostgresTable, PostgresView } from '@supabase/postgres-meta'
import { PostgresForeignTable } from '@supabase/postgres-meta/dist/lib/types'
import { ENTITY_TYPE } from 'data/entity-types/entity-type-constants'

type Entity = {
  type: ENTITY_TYPE
  id: number
  name: string
  comment: string | null
  rows: number | undefined
  size: string | undefined
  columns: unknown[]
  schema: string
}

// [Joshen] We just need name, description, rows, size, and the number of columns
// Just missing partitioned tables as missing pg-meta support
export const formatAllEntities = ({
  tables = [],
  views = [],
  materializedViews = [],
  foreignTables = [],
}: {
  tables?: PostgresTable[]
  views?: PostgresView[]
  materializedViews?: PostgresMaterializedView[]
  foreignTables?: PostgresForeignTable[]
}): Entity[] => {
  const formattedTables: Entity[] = tables.map((x) => {
    return {
      ...x,
      type: ENTITY_TYPE.TABLE,
      rows: x.live_rows_estimate,
      columns: x.columns ?? [],
      schema: x.schema,
    }
  })

  const formattedViews: Entity[] = views.map((x) => {
    return {
      type: ENTITY_TYPE.VIEW,
      id: x.id,
      name: x.name,
      comment: x.comment,
      rows: undefined,
      size: undefined,
      columns: x.columns ?? [],
      schema: x.schema,
    }
  })

  const formattedMaterializedViews: Entity[] = materializedViews.map((x) => {
    return {
      type: ENTITY_TYPE.MATERIALIZED_VIEW,
      id: x.id,
      name: x.name,
      comment: x.comment,
      rows: undefined,
      size: undefined,
      columns: x.columns ?? [],
      schema: x.schema,
    }
  })

  const formattedForeignTables: Entity[] = foreignTables.map((x) => {
    return {
      type: ENTITY_TYPE.FOREIGN_TABLE,
      id: x.id,
      name: x.name,
      comment: x.comment,
      rows: undefined,
      size: undefined,
      columns: x.columns ?? [],
      schema: x.schema,
    }
  })

  return [
    ...formattedTables,
    ...formattedViews,
    ...formattedMaterializedViews,
    ...formattedForeignTables,
  ].sort((a, b) => a.name.localeCompare(b.name))
}
