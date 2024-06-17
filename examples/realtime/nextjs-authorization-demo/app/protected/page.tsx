'use client'
import CreateRoomModal from '@/components/create-room-modal'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect, use } from 'react'

export default function Chat() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [rooms, setRooms] = useState<any>([])
  const [users, setUsers] = useState<any>([])
  const [selectedRoom, setSelectedRoom] = useState<string | undefined>()
  const [channel, setChannel] = useState<any>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  const getChannels = async () => {
    const channels = await supabase.from('rooms').select('topic')
    setRooms(channels.data?.map(({ topic }) => topic) || [])
  }

  const addUserToChannel = async (email: string) => {
    const user = await supabase.from('profiles').select('user_id').eq('email', email)
    console.log()
    if (!user.data?.length) {
      addMessage(true, true, `User ${email} not found`)
    } else {
      console.log(user.count)
      const room = await supabase.from('rooms').select('id').eq('topic', selectedRoom)

      await supabase
        .from('rooms_users')
        .upsert({ user_id: user.data?.[0].user_id, room_id: room.data?.[0].id })
      addMessage(true, true, `Added ${email} to channel ${selectedRoom}`)
      setUsers([...users, email])
    }
  }

  const addMessage = async (mine: boolean, system: boolean, message: string) => {
    const bubble = document.createElement('div')
    const is_self_classes = mine ? ['bg-green-600', 'self-end'] : ['bg-blue-600', 'self-start']
    const is_system_classes = system ? ['bg-stone-500', 'self-center', 'italic', 'text-center'] : []
    const style = [
      'flex',
      'gap-2',
      'items-center',
      'rounded-xl',
      'text-white',
      'text-bold',
      'w-2/3',
      'p-2',
    ]
      .concat(is_self_classes)
      .concat(is_system_classes)
    bubble.classList.add(...style)
    bubble.innerHTML = message
    document.getElementById('chat')!.appendChild(bubble)
  }

  useEffect(() => {
    supabase.auth
      .getUser()
      .then((user) => setUserId(user.data.user?.id || null))
      .then(async () => {
        await supabase.auth.getUser()
        const token = (await supabase.auth.getSession()).data.session?.access_token!
        supabase.realtime.setAuth(token)
        getChannels()
      })
      .then(() => {
        setLoading(false)
      })
  }, [supabase])

  useEffect(() => {
    if (document.getElementById('chat')) {
      document.getElementById('chat')!.innerHTML = ''
    }

    if (selectedRoom) {
      channel?.unsubscribe()

      let newChannel = supabase.realtime.channel(selectedRoom, {
        config: {
          broadcast: { self: true },
          presence: { key: userId! },
          private: true, // This line will tell the server that you want to use a private channel for this connection
        },
      })

      newChannel
        .on('broadcast', { event: 'message' }, ({ payload: payload }) =>
          addMessage(payload.user_id == userId, false, payload.message)
        )
        .on('presence', { event: 'sync' }, () => {
          console.log(['sync', newChannel.presenceState()])
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log(['join', key, newPresences])
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log(['leave', key, leftPresences])
        })
        .subscribe((status, err) => {
          if (status == 'SUBSCRIBED') {
            console.log(err)
            setChannel(newChannel)
            setLoading(false)
            setError(null)
          }
          if (status == 'CLOSED') {
            console.log(err)
            setChannel(null)
          }
          if (status == 'CHANNEL_ERROR') {
            console.log(err)
            setError(err?.message || null)
            setLoading(false)
          }
        })
    }
  }, [selectedRoom])

  return (
    <div className="flex w-full h-full p-10">
      {loading && (
        <div className="fixed top-0 left-0 right-0 flex flex-col h-full w-full justify-center items-center align-middle gap-2 z-10 bg-[#000000CC]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-foreground"></div>
        </div>
      )}
      {showModal ? <CreateRoomModal /> : ''}
      <div className="flex w-full h-full gap-4">
        <div className="grow-0 flex flex-col gap-2 w-[20rem] overflow-hidden">
          <div className="bg-white h-full rounded-sm text-slate-900">
            <div className="flex flex-col">
              {rooms?.map((room: string) => {
                return (
                  <button
                    key={room}
                    onClick={() => {
                      setLoading(true)
                      setSelectedRoom(room)
                    }}
                    className={
                      selectedRoom == room
                        ? 'bg-green-600 rounded-sm pointer p-2 text-white text-left'
                        : 'rounded-sm cursor-pointer hover:bg-green-100 p-2 text-black text-left'
                    }
                  >
                    #{room}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="bg-white h-full rounded-sm text-slate-900">
            <div className="flex flex-col gap-2 p-2">
              {users?.map((email: string) => {
                return <div key={email}>{email}</div>
              })}
            </div>
          </div>
          <button
            className="border border-foreground/20 rounded-md px-4 py-2 text-foreground"
            onClick={() => setShowModal(!showModal)}
          >
            Create Room
          </button>
        </div>
        <div className="grow flex flex-col gap-2">
          {error ? (
            <div className="bg-white h-full rounded-md text-slate-900 p-1 flex justify-center items-center">
              <h1 className="text-xl font-bold">You do not have access to this room</h1>
            </div>
          ) : (
            <div
              className="bg-white h-full rounded-md text-slate-900 p-1 flex flex-col gap-2"
              id="chat"
            />
          )}

          <form
            className="flex text-foreground w-full gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.target as HTMLFormElement
              const target = form.elements[0] as HTMLInputElement
              const message = target.value

              if (message.startsWith('/invite')) {
                const email = message.replace('/invite ', '')
                addUserToChannel(email)
              } else {
                channel?.send({
                  type: 'broadcast',
                  event: 'message',
                  payload: { message, user_id: userId },
                })
              }

              target.value = ''
            }}
          >
            <label className="hidden" htmlFor="message" />
            <input
              name="message"
              className="grow rounded-md text-black p-2"
              placeholder="Insert your message"
              disabled={!channel}
            ></input>
            <button
              type="submit"
              className="border border-foreground/20 rounded-md px-4 py-2 text-foreground"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
