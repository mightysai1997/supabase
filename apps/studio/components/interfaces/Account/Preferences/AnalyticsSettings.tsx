import { Toggle } from 'ui'

import Panel from 'components/ui/Panel'
import { useAppStateSnapshot } from 'state/app-state'

const AnalyticsSettings = () => {
  const snap = useAppStateSnapshot()

  const onToggleOptIn = () => {
    const value = !snap.isOptedInTelemetry ? 'true' : 'false'
    snap.setIsOptedInTelemetry(value === 'true')
  }

  return (
    <Panel title={<h5 key="panel-title">Analytics</h5>}>
      <Panel.Content>
        <Toggle
          checked={snap.isOptedInTelemetry}
          onChange={onToggleOptIn}
          label="Opt-in to sending anonymous telemetry data from the dashboard"
          descriptionText="By opting-in to sending anonymous telemetry data, Supabase can improve your overall dashboard user experience"
        />
      </Panel.Content>
    </Panel>
  )
}

export default AnalyticsSettings
