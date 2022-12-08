// @ts-nocheck

import { NextSeo } from 'next-seo'

import _days from '~/components/LaunchWeek/lw6_days.json'
import DefaultLayout from '~/components/Layouts/Default'
import SectionContainer from '~/components/Layouts/SectionContainer'

import { createClient, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import TicketContainer from '~/components/LaunchWeek/Ticket/TicketContainer'
import { useTheme } from '~/components/Providers'
import classNames from 'classnames'
import styleUtils from '~/components/LaunchWeek/Ticket/utils.module.css'
import { SITE_ORIGIN } from '~/lib/constants'
import { Accordion, Badge, IconExternalLink } from 'ui'
import { WeekDayProps } from '~/components/LaunchWeek/types'

const days = _days as WeekDayProps[]
const constellation = [
  [60, 8],
  [13, 20],
  [42, 24],
  [68, 27],
  [23, 42],
  [52, 52],
  [0, 55],
  [33, 65],
  [66, 70],
  [55, 82],
]

export default function launchweek() {
  const { isDarkMode } = useTheme()
  const title = 'Launch Week 6'
  const description = 'Supabase Launch Week 6 | 12-18 Dec 2022'

  const [supabase] = useState(() =>
    createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  )

  const [session, setSession] = useState<Session | null>(null)
  const [creators, setCreators] = useState<any>([])
  const [activeCreator, setActiveCreator] = useState<any>(null)
  const { query } = useRouter()
  const ticketNumber = query.ticketNumber?.toString()
  const defaultUserData = {
    id: query.id?.toString(),
    ticketNumber: ticketNumber ? parseInt(ticketNumber, 10) : undefined,
    name: query.name?.toString(),
    username: query.username?.toString(),
  }

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })

    getCreators()
  }, [])

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark bg-[#121212]' : 'light bg-[#fff]'
  }, [isDarkMode])

  async function getCreators() {
    try {
      // setLoading(true)
      let supa = await supabase.from('lw6_creators').select()

      let { data, error, status } = supa

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setCreators(data)
      }
    } catch (error) {
      // alert('Error loading user data!')
      console.log(error)
    } finally {
      // setLoading(false)
    }
  }

  const AccordionHeader = ({ date, day, title, shipped }: any) => {
    return (
      <div className="flex flex-1 flex-col sm:flex-row">
        <div className="flex gap-4 min-w-[320px]">
          <Badge className="!bg-transparent !py-1 !px-4 text-transparent bg-clip-text bg-gradient-to-r from-[#99bbab] to-[#396f55] border-[#598973] dark:from-white dark:to-[#1a7a4ca1] dark:border-[#598973] h-fit">
            {shipped ? 'Shipped' : 'Coming Soon'}
          </Badge>
          <span className="text-scale-900 text-sm">
            {day} ・ {date}
          </span>
        </div>
        <span className="text-scale-1200 mt-3 sm:mt-0">{title}</span>
      </div>
    )
  }

  const SectionButtons = ({ blog, docs }) => {
    return (
      <div className="flex gap-2 z-10">
        <a href={blog} target="_blank" rel="noopener">
          <div className="flex items-center border border-slate-400 bg-gradient-to-r from-[#fcfcfc] to-[#f2f2f2] text-black dark:text-white dark:from-[#191919] dark:to-[#464444] rounded-full text-sm py-2 pl-3 pr-2">
            Blog post
            <div className="bg-[#eeeeee] dark:bg-[#313131] rounded-full inline-block p-1 ml-2">
              <IconExternalLink className="text-[#4cc38a] w-3 h-3" />
            </div>
          </div>
        </a>
        <a href={docs} target="_blank" rel="noopener">
          <div className="flex items-center border border-slate-400 bg-gradient-to-r from-[#fcfcfc] to-[#f2f2f2] text-black dark:text-white dark:from-[#191919] dark:to-[#464444] rounded-full text-sm py-2 pl-3 pr-2">
            Docs
            <div className="bg-[#eeeeee] dark:bg-[#313131] rounded-full inline-block p-1 ml-2">
              <IconExternalLink className="text-[#4cc38a] w-3 h-3" />
            </div>
          </div>
        </a>
      </div>
    )
  }
  const [day1, day2, day3, day4, day5] = days
  return (
    <>
      <NextSeo
        title={title}
        openGraph={{
          title: title,
          description: description,
          url: `https://supabase.com/launch-week`,
          images: [
            {
              url: `${SITE_ORIGIN}/images/launchweek/launch-week-6.jpg`,
            },
          ],
        }}
      />
      <DefaultLayout>
        <SectionContainer className="flex flex-col !pb-1 items-center lg:pt-32 gap-32">
          <div
            className={classNames(
              styleUtils.appear,
              styleUtils['appear-first'],
              'flex flex-col justify-center gap-3'
            )}
          >
            <div className="flex justify-center">
              <img
                src="/images/launchweek/launchweek-logo--light.svg"
                className="flex w-40 dark:hidden lg:w-80"
              />
              <img
                src="/images/launchweek/launchweek-logo--dark.svg"
                className="hidden w-40 dark:flex lg:w-80"
              />
            </div>
            <p className="text-scale-1100 text-sm text-center">Dec 12 – 16 at 8 AM PT | 11 AM ET</p>
          </div>
          {!process.env.NEXT_PUBLIC_LW_STARTED && (
            <div className={classNames(styleUtils.appear, styleUtils['appear-second'])}>
              <TicketContainer
                supabase={supabase}
                session={session}
                defaultUserData={defaultUserData}
                defaultPageState={query.ticketNumber ? 'ticket' : 'registration'}
              />
            </div>
          )}
        </SectionContainer>
        <div
          className={classNames(
            styleUtils.appear,
            styleUtils['appear-third'],
            'gradient-container'
          )}
        >
          <div
            className={classNames(styleUtils.appear, styleUtils['appear-fourth'], 'gradient-mask')}
          ></div>
          <div className="gradient-mask--masked bottom-of-the-circle"></div>

          <div
            className={classNames(
              // styleUtils.appear,
              // styleUtils['appear-second'],
              'flair-mask-a the-stroke-of-the-circle'
            )}
          ></div>
          <div
            className={classNames(
              // styleUtils.appear,
              // styleUtils['appear-second'],
              'flair-mask-b inside-the-circle'
            )}
          ></div>
        </div>
        {process.env.NEXT_PUBLIC_LW_STARTED && (
          <>
            <SectionContainer className="!pt-0 ">
              <div className="border rounded-2xl border-slate-400 text-sm px-5 py-7 flex flex-col sm:flex-row justify-between items-center">
                <div className="relative flex items-center mb-4 sm:mb-0">
                  <div className="flex">
                    <div className="bg-[url('/images/launchweek/copple.png')] h-[42px] w-[42px] z-10"></div>
                    <div className="bg-[url('/images/launchweek/ant.png')] h-[42px] w-[42px] ml-[-10px]"></div>
                  </div>
                  <div className="flex flex-col lg:flex-row ml-8 sm:ml-10">
                    <span className="text-black dark:text-white mr-2">How we launch</span>
                    <span className="text-slate-900">Fireside chat with founders</span>
                  </div>
                </div>
                <div className="flex gap-2 z-10">
                  <a href={'/blog'} target="_blank" rel="noopener">
                    <div className="flex items-center border border-slate-400 bg-gradient-to-r from-[#fcfcfc] to-[#f2f2f2] text-black dark:text-white dark:from-[#191919] dark:to-[#464444] rounded-full text-sm py-2 pl-3 pr-2 min-w-[130px]">
                      Watch video
                      <div className="bg-[#eeeeee] dark:bg-[#313131] rounded-full inline-block p-1 ml-2">
                        <IconExternalLink className="text-[#4cc38a] w-3 h-3" />
                      </div>
                    </div>
                  </a>
                  <a href={'/docs'} target="_blank" rel="noopener">
                    <div className="flex items-center border border-slate-400 bg-gradient-to-r from-[#fcfcfc] to-[#f2f2f2] text-black dark:text-white dark:from-[#191919] dark:to-[#464444] rounded-full text-sm py-2 pl-3 pr-2 min-w-[142px]">
                      Read blogpost
                      <div className="bg-[#eeeeee] dark:bg-[#313131] rounded-full inline-block p-1 ml-2">
                        <IconExternalLink className="text-[#4cc38a] w-3 h-3" />
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </SectionContainer>
            <SectionContainer className="!pt-0">
              <Accordion
                type="default"
                openBehaviour="multiple"
                size="large"
                className="text-scale-900 dark:text-white"
                justified={false}
                bordered={false}
                chevronAlign="right"
              >
                <div className="border-b pb-3">
                  <Accordion.Item
                    header={
                      <AccordionHeader
                        date={day1.date}
                        day={day1.dd}
                        title={day1.title}
                        shipped={day1.shipped}
                      />
                    }
                    disabled={!day1.shipped}
                    className="h-[79px]"
                    id={day1.d.toString()}
                  >
                    <div className="h-[400px] flex flex-col lg:flex-row">
                      <div
                        className={`flex flex-col flex-1 justify-between border rounded-xl h-full relative after:opacity-10 xl:after:opacity-90 after:absolute after:bg-no-repeat after:bg-[center_top_50px] lg:after:bg-[right_20%_top_50px]  after:bg-contain after:bg-[url('/images/launchweek/docs-update-bg.png')] after:top-0 after:right-0 after:bottom-0 after:left-0  p-14 text-2xl`}
                      >
                        <div className="flex items-center relative z-10">
                          <span>{day1.description}</span>
                          <Badge className="!bg-transparent h-fit ml-4 text-sm !py-1 !px-4 text-transparent bg-clip-text bg-gradient-to-r from-[#99bbab] to-[#396f55] border-[#598973] dark:from-white dark:to-[#1a7a4ca1] dark:border-[#598973]">
                            Redesigned
                          </Badge>
                        </div>
                        <SectionButtons docs={day1.steps[0].docs} blog={day1.steps[0].blog} />
                      </div>
                    </div>
                  </Accordion.Item>
                </div>
                <div className="border-b pb-3">
                  <Accordion.Item
                    header={
                      <AccordionHeader
                        date={day2.date}
                        day={day2.dd}
                        title={day2.title}
                        shipped={day2.shipped}
                      />
                    }
                    disabled={!day2.shipped}
                    className="h-[79px]"
                    id={day2.d.toString()}
                  >
                    <div className="h-[800px] lg:h-[400px] flex flex-col gap-5 lg:flex-row">
                      <div
                        className={`flex-1 flex flex-col justify-between basis-1/2 lg:basis-2/3 border rounded-xl h-full p-14 text-2xl bg-no-repeat bg-[url('/images/launchweek/image-processing-bg-light.png')] dark:bg-[url('/images/launchweek/image-processing-bg.png')] bg-[right_28px_top_35px] bg-contain`}
                      >
                        <div className="flex items-center">
                          <div>{day2.steps[0].title}</div>
                          <Badge className="!bg-transparent h-fit ml-4 text-sm !py-1 !px-4 text-transparent bg-clip-text bg-gradient-to-r from-[#99bbab] to-[#396f55] border-[#598973] dark:from-white dark:to-[#1a7a4ca1] dark:border-[#598973]">
                            New
                          </Badge>
                        </div>
                        <SectionButtons docs={day2.steps[0].docs} blog={day2.steps[0].blog} />
                      </div>
                      <div
                        className={`flex-1 flex flex-col items-center justify-between basis-1/2 lg:basis-1/3 border rounded-xl h-full bg-no-repeat p-14 text-2xl bg-[url('/images/launchweek/cdn-caching-bg-light.png')] dark:bg-[url('/images/launchweek/cdn-caching-bg.png')] bg-[center_bottom] bg-contain`}
                      >
                        <div className="flex flex-col items-center gap-2 min-w-[300px]">
                          <Badge className="!bg-transparent h-fit text-sm !py-1 !px-4 text-transparent bg-clip-text bg-gradient-to-r from-[#99bbab] to-[#396f55] border-[#598973] dark:from-white dark:to-[#1a7a4ca1] dark:border-[#598973]">
                            New
                          </Badge>
                          <span>{day2.steps[1].title}</span>
                          <p className="text-sm text-slate-900">{day2.steps[1].description}</p>
                        </div>
                        <SectionButtons docs={day2.steps[1].docs} blog={day2.steps[1].blog} />
                      </div>
                    </div>
                  </Accordion.Item>
                </div>
                <div className="border-b pb-3">
                  <Accordion.Item
                    header={
                      <AccordionHeader
                        date={day3.date}
                        day={day3.dd}
                        title={day3.title}
                        shipped={day3.shipped}
                      />
                    }
                    disabled={!day3.shipped}
                    className="h-[79px]"
                    id={day3.d.toString()}
                  >
                    <div className="h-[800px] lg:h-[400px] flex flex-col gap-5 lg:flex-row">
                      <div
                        className={`flex flex-col justify-between flex-1 basis-1/2 lg:basis-2/3 border rounded-xl h-full p-14 text-2xl bg-no-repeat bg-contain bg-[url('/images/launchweek/vault-bg-light.png')] dark:bg-[url('/images/launchweek/vault-bg.png')] bg-[center_bottom]`}
                      >
                        <div className="flex items-center">
                          <span>{day3.steps[0].title}</span>
                          <Badge className="!bg-transparent h-fit ml-4 text-sm !py-1 !px-4 text-transparent bg-clip-text bg-gradient-to-r from-[#99bbab] to-[#396f55] border-[#598973] dark:from-white dark:to-[#1a7a4ca1] dark:border-[#598973]">
                            New
                          </Badge>
                        </div>
                        <SectionButtons docs={day3.steps[0].docs} blog={day3.steps[0].blog} />
                      </div>
                      <div
                        className={`flex-1 flex flex-col items-center justify-between basis-1/2 lg:basis-1/3 border rounded-xl h-full bg-no-repeat p-14 text-2xl bg-[url('/images/launchweek/encryption-bg-light.png')] dark:bg-[url('/images/launchweek/encryption-bg.svg')] bg-contain bg-[center_center] shadow-[inset_0px_130px_50px_-52p_rgb(10,31,30)]`}
                      >
                        {/* inset 0px 130px 50px -52px #121f1e; */}
                        <div className="flex flex-col items-center gap-2 min-w-[300px]">
                          <Badge className="!bg-transparent h-fit text-sm !py-1 !px-4 text-transparent bg-clip-text bg-gradient-to-r from-[#99bbab] to-[#396f55] border-[#598973] dark:from-white dark:to-[#1a7a4ca1] dark:border-[#598973]">
                            New
                          </Badge>
                          <span className="text-center">{day3.steps[1].title}</span>
                        </div>
                        <SectionButtons docs={day3.steps[1].docs} blog={day3.steps[1].blog} />
                      </div>
                    </div>
                  </Accordion.Item>
                </div>
                <div className="border-b pb-3">
                  <Accordion.Item
                    header={
                      <AccordionHeader
                        date={day4.date}
                        day={day4.dd}
                        title={day4.title}
                        shipped={day4.shipped}
                      />
                    }
                    disabled={!day4.shipped}
                    className="h-[79px]"
                    id={day4.d.toString()}
                  >
                    <div className="h-[400px] flex gap-5">
                      <div
                        className={`flex flex-col justify-between flex-1 border rounded-xl h-full bg-no-repeat p-14 text-2xl bg-[url('/images/launchweek/mfa-bg-light.png')] dark:bg-[url('/images/launchweek/mfa-bg.png')] bg-[bottom_right_30%] bg-contain`}
                      >
                        <div className="flex items-center">
                          <span>{day4.steps[0].title}</span>
                          <Badge className="!bg-transparent h-fit ml-4 text-sm !py-1 !px-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#1a7a4ca1] border-[#598973]">
                            Updated
                          </Badge>
                        </div>
                        <SectionButtons docs={day4.steps[0].docs} blog={day4.steps[0].blog} />
                      </div>
                    </div>
                  </Accordion.Item>
                </div>
                <div className="border-b pb-3">
                  <Accordion.Item
                    header={
                      <AccordionHeader
                        date={day5.date}
                        day={day5.dd}
                        title={day5.title}
                        shipped={day5.shipped}
                      />
                    }
                    disabled={!day5.shipped}
                    className="h-[79px]"
                    id={day5.d.toString()}
                  >
                    <div className="h-[800px] lg:h-[400px] flex flex-col gap-5 lg:flex-row">
                      <div
                        className={`flex flex-col justify-between flex-1 basis-1/2 lg:basis-2/3 border rounded-xl h-full bg-no-repeat p-14 text-2xl bg-[url('/images/launchweek/wrappers-bg-light.png')] dark:bg-[url('/images/launchweek/wrappers-bg.png')] bg-contain bg-[right]`}
                      >
                        <div className="flex items-center">
                          <span>{day5.steps[0].title}</span>
                          <Badge className="!bg-transparent h-fit ml-4 text-sm !py-1 !px-4 text-transparent bg-clip-text bg-gradient-to-r from-[#99bbab] to-[#396f55] border-[#598973] dark:from-white dark:to-[#1a7a4ca1] dark:border-[#598973]">
                            New
                          </Badge>
                        </div>
                        <SectionButtons docs={day5.steps[0].docs} blog={day5.steps[0].blog} />
                      </div>
                      <div
                        className={`flex-1 flex flex-col items-center justify-between basis-1/2 lg:basis-1/3 border rounded-xl h-full bg-no-repeat p-14 text-2xl bg-[url('/images/launchweek/pitr-bg-light.png')] dark:bg-[url('/images/launchweek/pitr-bg.png')] bg-cover bg-[center_center]`}
                      >
                        <div className="flex flex-col items-center gap-2 min-w-[300px]">
                          <Badge className="!bg-transparent h-fit text-sm !py-1 !px-4 text-transparent bg-clip-text bg-gradient-to-r from-[#99bbab] to-[#396f55] border-[#598973] dark:from-white dark:to-[#1a7a4ca1] dark:border-[#598973]">
                            New
                          </Badge>
                          <span>{day5.steps[1].title}</span>
                        </div>
                        <SectionButtons docs={day5.steps[1].docs} blog={day5.steps[1].blog} />
                      </div>
                    </div>
                  </Accordion.Item>
                </div>
              </Accordion>
            </SectionContainer>
          </>
        )}
        <SectionContainer
          className={classNames(
            'flex gap-6 min-h-[350px] !py-3 mb-11 flex-col-reverse md:flex-row',
            styleUtils.appear,
            styleUtils['appear-third']
          )}
        >
          <div
            className={`flex-1 bg-[url('/images/launchweek/orbit.svg')] bg-auto bg-no-repeat bg-bottom relative min-h-[360px]`} //grid grid-cols-5 grid-rows-5
          >
            {creators.map((creator: any, index: number) => {
              return (
                <div
                  className={`justify-self-center absolute overflow-visible`}
                  onMouseEnter={() => {
                    setActiveCreator(index)
                  }}
                  style={{
                    top: `${constellation[index][0]}%`,
                    left: `${constellation[index][1]}%`,
                  }}
                >
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-brand-1100 rounded-full opacity-75 group-hover:opacity-100 group-hover:blur-sm transition duration-500"></div>
                    <a href={creator.link} target="_blank" rel="noopener">
                      <img
                        className="relative rounded-full w-12 h-12 border border-brand-900 hover:shadow-md"
                        src={creator.profile_picture}
                      />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex-1">
            <Badge className="mb-6 bg-gradient-to-r from-[#0E3737C2] to-[#67947F] hover:to-[#39617D94] dark:hover:to-[#A6FFD899] text-whiteA-1200 dark:text-black font-normal !py-1 !px-4 dark:from-white dark:via-white dark:to-[#1a7a4c75] bg-slate-1200">
              Currently happening
            </Badge>
            <h2 className="text-4xl dark:text-white mb-2">The Supabase Content Storm</h2>
            <p className="text-slate-900 md:max-w-[80%] mb-16">
              We worked with +30 content creators from around the world to drop a mountain of
              content simultaneously!
              <a rel="noopener" target="_blank" href="/blog/the-supabase-content-storm">
                <div className="text-brand-900 flex items-center">
                  See all the content
                  <IconExternalLink size="small" className="inline-block ml-1" />
                </div>
              </a>
            </p>
            {activeCreator !== null && (
              <div className="lg:max-w-[50%] min-h-[120px]">
                <h3 className="dark:text-white">
                  {activeCreator !== null
                    ? `${creators[activeCreator].first_name} ${creators[activeCreator].last_name}`
                    : 'Title'}
                </h3>
                <p className="text-brand-900">
                  <a rel="noopener" target="_blank" href={creators[activeCreator].link}>
                    <span>
                      {creators[activeCreator].link_title}
                      <IconExternalLink size="small" className="inline-block ml-2" />
                    </span>
                  </a>
                </p>
              </div>
            )}
          </div>
        </SectionContainer>
        <SectionContainer className="!pt-0">
          <div className="flex">
            <div className="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-16">
              <div className="flex flex-col">
                <h3 className="text-lg text-black dark:text-white mb-2">Prizes</h3>
                <p className="text-slate-900 w-[70%]">
                  There are 5 categories to win, there will be prizes for a winner and a runner-up
                  prize for each category.
                </p>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg text-black dark:text-white mb-2">Community</h3>
                <p className="text-slate-900 w-[70%]">
                  If you need help or advice when building, find other people to join your team, or
                  if you just want to chill and watch people build, come and join us!
                </p>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-col">
                  <h3 className="text-lg text-black dark:text-white mb-2">Judges</h3>
                  <p className="text-slate-900 w-[70%]">
                    We have assembled an All Star Judging Panel, one of which is{' '}
                    <a
                      href="https://twitter.com/swyx"
                      target="_blank"
                      rel="nooper noreferrer"
                      className="text-brand-900"
                    >
                      @swyx
                    </a>{' '}
                    Shawn Wang.
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg text-black dark:text-white mb-2">Submision</h3>
                <p className="text-slate-900 w-[70%]">
                  Submit your project through madewithsupabase.com. All submissions must be open
                  source and publically available. Submissions close Sunday 21st Aug 23:59 (PT).
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-16 basis-1/3"></div>
            <div>
              <div className="flex basis-1/3">Community</div>
            </div>
          </div>
        </SectionContainer>
      </DefaultLayout>
    </>
  )
}
