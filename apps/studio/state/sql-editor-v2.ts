import { debounce, memoize } from 'lodash'
import toast from 'react-hot-toast'
import { proxy, snapshot, subscribe, useSnapshot } from 'valtio'
import { devtools, proxySet } from 'valtio/utils'

import { UpsertContentPayloadV2, upsertContent } from 'data/content/content-upsert-v2-mutation'
import { createSQLSnippetFolder } from 'data/content/sql-folder-create-mutation'
import { updateSQLSnippetFolder } from 'data/content/sql-folder-update-mutation'
import { Snippet, SnippetFolder, SnippetFolderResponse } from 'data/content/sql-folders-query'

export type StateSnippetFolder = {
  projectRef: string
  folder: SnippetFolder
  status?: 'editing' | 'saving' | 'idle'
}

// [Joshen] API codegen is somehow missing the content property
export interface SnippetContent extends Snippet {
  content?: any
}

export type StateSnippet = {
  projectRef: string
  splitSizes: number[]
  snippet: SnippetContent
}

const NEW_FOLDER_ID = 'new-folder'

export const sqlEditorState = proxy({
  // ========================================================================
  // ## Data properties within the store
  // ========================================================================
  folders: {} as {
    [folderId: string]: StateSnippetFolder
  },
  snippets: {} as {
    [snippetId: string]: StateSnippet
  },
  // Query results, if any, for a snippet
  results: {} as {
    [snippetId: string]: {
      rows: any[]
      error?: any
      autoLimit?: number
    }[]
  },
  // Project ref as the key, marks which project already has snippets loaded
  loaded: {} as {
    [projectRef: string]: boolean
  },
  // Synchronous saving of folders and snippets (debounce behaviour)
  needsSaving: proxySet<string>([]),
  // Stores the state of each snippet
  savingStates: {} as {
    [snippetId: string]: 'IDLE' | 'UPDATING' | 'UPDATING_FAILED'
  },
  limit: 100,

  order: 'inserted_at' as 'name' | 'inserted_at',

  get sortedSnippets() {
    return Object.values(sqlEditorState.snippets)
      .map((x) => x.snippet)
      .sort((a, b) => {
        if (sqlEditorState.order === 'name') return a.name.localeCompare(b.name)
        else return new Date(b.inserted_at).valueOf() - new Date(a.inserted_at).valueOf()
      })
  },

  // ========================================================================
  // ## Methods to interact the store with
  // ========================================================================

  // Initial loading of data into UI, only called once when first loading data
  // Note that snippets here do not have the content property, and will need to be
  // further loaded on demand instead. Entry point from SQLEditorNav.tsx
  initializeRemoteSnippets: ({
    projectRef,
    data,
    sort,
  }: {
    projectRef: string
    data: SnippetFolderResponse
    sort: 'name' | 'inserted_at'
  }) => {
    const { folders, contents } = data
    folders?.forEach((folder) => {
      sqlEditorState.folders[folder.id] = { projectRef, folder }
    })
    contents?.forEach((snippet) => {
      sqlEditorState.addSnippet({ projectRef, snippet })
    })
    sqlEditorState.loaded[projectRef] = true
    sqlEditorState.order = sort
  },

  setOrder: (value: 'name' | 'inserted_at') => (sqlEditorState.order = value),

  addSnippet: ({ projectRef, snippet }: { projectRef: string; snippet: Snippet }) => {
    if (snippet.id && sqlEditorState.snippets[snippet.id]?.snippet?.content === undefined) {
      sqlEditorState.snippets[snippet.id] = { projectRef, splitSizes: [50, 50], snippet }
      sqlEditorState.results[snippet.id] = []
      sqlEditorState.savingStates[snippet.id] = 'IDLE'
    }
  },

  updateSnippet: (id: string, snippet: Snippet) => {
    if (sqlEditorState.snippets[id]) {
      sqlEditorState.snippets[id].snippet = snippet
      sqlEditorState.needsSaving.add(id)
    }
  },

  setSql: (id: string, sql: string) => {
    if (sqlEditorState.snippets[id]) {
      sqlEditorState.snippets[id].snippet.content.sql = sql
      sqlEditorState.needsSaving.add(id)
    }
  },

  renameSnippet: ({
    id,
    name,
    description,
  }: {
    id: string
    name: string
    description?: string
  }) => {
    if (sqlEditorState.snippets[id]) {
      const { snippet } = sqlEditorState.snippets[id]
      snippet.name = name
      snippet.description = description

      sqlEditorState.needsSaving.add(id)
    }
  },

  removeSnippet: (id: string) => {
    const { [id]: snippet, ...otherSnippets } = sqlEditorState.snippets
    sqlEditorState.snippets = otherSnippets

    const { [id]: result, ...otherResults } = sqlEditorState.results
    sqlEditorState.results = otherResults

    sqlEditorState.needsSaving.delete(id)
  },

  addNewFolder: ({ projectRef }: { projectRef: string }) => {
    // [Joshen] Use this to identify new folders that have yet to be saved
    const id = NEW_FOLDER_ID
    sqlEditorState.folders[id] = {
      projectRef,
      status: 'editing',
      folder: {
        id,
        name: '',
        owner_id: -1,
        project_id: -1,
        parent_id: null,
      },
    }
  },

  editFolder: (id: string) => {
    sqlEditorState.folders[id] = { ...sqlEditorState.folders[id], status: 'editing' }
  },

  saveFolder: ({ id, name }: { id: string; name: string }) => {
    const hasChanges = sqlEditorState.folders[id].folder.name !== name
    sqlEditorState.folders[id] = {
      projectRef: sqlEditorState.folders[id].projectRef,
      status: hasChanges ? 'saving' : 'idle',
      folder: {
        ...sqlEditorState.folders[id].folder,
        id,
        name,
      },
    }
    if (hasChanges) sqlEditorState.needsSaving.add(id)
  },

  removeFolder: (id: string) => {
    const { [id]: folder, ...otherFolders } = sqlEditorState.folders
    sqlEditorState.folders = otherFolders
  },

  setLimit: (value: number) => (sqlEditorState.limit = value),

  addNeedsSaving: (id: string) => sqlEditorState.needsSaving.add(id),

  addFavorite: (id: string) => {
    if (sqlEditorState.snippets[id]) {
      sqlEditorState.snippets[id].snippet.favorite = true
      sqlEditorState.needsSaving.add(id)
    }
  },

  removeFavorite: (id: string) => {
    if (sqlEditorState.snippets[id]) {
      sqlEditorState.snippets[id].snippet.favorite = false
      sqlEditorState.needsSaving.add(id)
    }
  },

  shareSnippet: (id: string, visibility: 'user' | 'project' | 'org' | 'public') => {
    if (sqlEditorState.snippets[id]) {
      const { snippet, projectRef } = sqlEditorState.snippets[id]
      snippet.visibility = visibility

      // sqlEditorState.reorderSnippets(projectRef)
      sqlEditorState.needsSaving.add(id)
    }
  },

  addResult: (id: string, results: any[], autoLimit?: number) => {
    if (sqlEditorState.results[id]) {
      sqlEditorState.results[id].unshift({ rows: results, autoLimit })
    }
  },

  addResultError: (id: string, error: any, autoLimit?: number) => {
    if (sqlEditorState.results[id]) {
      sqlEditorState.results[id].unshift({ rows: [], error, autoLimit })
    }
  },

  resetResult: (id: string) => {
    if (sqlEditorState.results[id]) {
      sqlEditorState.results[id] = []
    }
  },
})

// ========================================================================
// ## Expose entry points into this Valtio store
// ========================================================================

export const getSqlEditorV2StateSnapshot = () => snapshot(sqlEditorState)

export const useSqlEditorV2StateSnapshot = (options?: Parameters<typeof useSnapshot>[1]) =>
  useSnapshot(sqlEditorState, options)

// ========================================================================
// ## Below are all the asynchronous saving logic for the SQL Editor
// ========================================================================

async function upsertSnippet(id: string, projectRef: string, payload: UpsertContentPayloadV2) {
  try {
    sqlEditorState.savingStates[id] = 'UPDATING'
    await upsertContent({
      projectRef,
      payload,
    })
    sqlEditorState.savingStates[id] = 'IDLE'
  } catch (error) {
    sqlEditorState.savingStates[id] = 'UPDATING_FAILED'
  }
}

const memoizedUpdateSnippet = memoize((_id: string) => debounce(upsertSnippet, 1000))

const debouncedUpdateSnippet = (id: string, projectRef: string, payload: UpsertContentPayloadV2) =>
  memoizedUpdateSnippet(id)(id, projectRef, payload)

async function upsertFolder(id: string, projectRef: string, name: string) {
  try {
    if (id === NEW_FOLDER_ID) {
      const res = await createSQLSnippetFolder({ projectRef, name })
      toast.success('Successfully created folder')
      sqlEditorState.removeFolder(NEW_FOLDER_ID)
      sqlEditorState.folders[res.id] = { projectRef, status: 'idle', folder: res }
    } else {
      await updateSQLSnippetFolder({ projectRef, id, name })
      toast.success('Successfully updated folder')
      sqlEditorState.folders[id] = { ...sqlEditorState.folders[id], status: 'idle' }
    }
  } catch (error: any) {
    toast.error(`Failed to save folder: ${error.message}`)
  }
}

if (typeof window !== 'undefined') {
  devtools(sqlEditorState, {
    name: 'sqlEditorState',
    // [Joshen] So that jest unit tests can ignore this
    enabled: process.env.NEXT_PUBLIC_ENVIRONMENT !== undefined,
  })

  subscribe(sqlEditorState.needsSaving, () => {
    const state = getSqlEditorV2StateSnapshot()

    Array.from(state.needsSaving).forEach((id) => {
      const snippet = state.snippets[id]
      const folder = state.folders[id]

      if (snippet) {
        debouncedUpdateSnippet(id, snippet.projectRef, {
          id,
          type: 'sql',
          name: snippet.snippet.name ?? 'Untitled',
          description: snippet.snippet.description ?? '',
          visibility: snippet.snippet.visibility ?? 'user',
          project_id: snippet.snippet.project_id ?? 0,
          owner_id: snippet.snippet.owner_id,
          folder_id: snippet.snippet.folder_id,
          content: { ...snippet.snippet.content, content_id: id },
        })
        sqlEditorState.needsSaving.delete(id)
      } else if (folder) {
        upsertFolder(id, folder.projectRef, folder.folder.name)
        sqlEditorState.needsSaving.delete(id)
      }
    })
  })
}
