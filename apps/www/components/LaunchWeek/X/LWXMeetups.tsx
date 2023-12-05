import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { cn } from 'ui'
import useConfData from '../hooks/use-conf-data'
import { SupabaseClient } from '@supabase/supabase-js'

export interface Meetup {
  id?: any
  title: string
  isLive: boolean
  link: string
  display_info: string
  start_at: string
}

function addHours(date: Date, hours: number) {
  const dateCopy = new Date(date)

  dateCopy.setHours(dateCopy.getHours() + hours)

  return dateCopy
}

const LWXMeetups = ({ meetups }: { meetups?: Meetup[] }) => {
  const { supabase } = useConfData()
  const now = new Date(Date.now())
  const [meets, setMeets] = useState<Meetup[]>(meetups ?? [])
  const [realtimeChannel, setRealtimeChannel] = useState<ReturnType<
    SupabaseClient['channel']
  > | null>(null)
  const [activeMeetup, setActiveMeetup] = useState<Meetup>(meets[0])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Listen to realtime changes
    if (supabase && !realtimeChannel) {
      const channel = supabase
        .channel('lwx_meetups')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'lwx_meetups',
            filter: undefined,
          },
          async () => {
            const { data: newMeets } = await supabase.from('lwx_meetups').select('*')
            setMeets(
              newMeets?.sort((a, b) => (new Date(a.start_at) > new Date(b.start_at) ? 1 : -1))!
            )
          }
        )
        .subscribe(async (status) => {
          if (status !== 'SUBSCRIBED') {
            return null
          }
          console.log('subscribed', channel)
          // await channel.track(meets)
        })
      setRealtimeChannel(channel)
    }

    return () => {
      // Cleanup realtime subscription on unmount
      realtimeChannel?.unsubscribe()
    }
  }, [])

  function handleSelectMeetup(meetup: Meetup) {
    setActiveMeetup(meetup)
  }

  if (!isMounted) return null

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-8">
      <div className="col-span-1 xl:col-span-4 flex flex-col justify-center max-w-lg text-foreground-lighter">
        <h2 className="text-sm font-mono uppercase tracking-[1px] mb-4">Community meetups</h2>
        <p className="text-base xl:max-w-md">
          Celebrate Launch Week 🆇 at our live community-driven meetups. Network with the community,
          listen to tech talks and grab some swag.
        </p>
      </div>
      <div className="col-span-1 xl:col-span-7 xl:col-start-6 w-full max-w-4xl flex flex-wrap gap-x-3 mt-4">
        {meets &&
          meets
            ?.sort((a, b) => (new Date(a.start_at) > new Date(b.start_at) ? 1 : -1))
            .map((meetup: Meetup, i: number) => {
              const startAt = new Date(meetup.start_at)
              const endAt = addHours(new Date(meetup.start_at), 3)
              const after = now > startAt
              const before3H = now < endAt
              const liveNow = after && before3H

              return (
                <Link
                  href={meetup.link ?? ''}
                  target="_blank"
                  onClick={() => handleSelectMeetup(meetup)}
                  onMouseOver={() => handleSelectMeetup(meetup)}
                  title={liveNow ? 'Live now' : undefined}
                  className={cn(
                    'group py-1 flex items-center flex-wrap text-4xl',
                    'hover:text-foreground transition-colors',
                    meetup.id === activeMeetup.id ? 'text-foreground' : 'text-foreground-muted',
                    liveNow && 'text-foreground-light'
                  )}
                >
                  <div className="flex flex-wrap items-center">
                    {liveNow && (
                      <div className="w-2 h-2 rounded-full bg-brand mr-2 mb-4 animate-pulse" />
                    )}
                    <span>{meetup.title}</span>
                    {i !== meets.length - 1 && ', '}
                  </div>
                </Link>
              )
            })}
      </div>
      <div className="col-span-1 xl:col-span-7 xl:col-start-6 w-full max-w-4xl text-sm flex-1">
        {activeMeetup?.display_info}
      </div>
    </div>
  )
}

export default LWXMeetups
