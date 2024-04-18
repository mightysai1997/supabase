// see apps/www/components/LaunchWeek/X/Releases/data/lwx_advent_days.tsx for reference

import { ReactNode } from 'react'

export interface AdventDay {
  icon?: ReactNode // use svg jsx with 34x34px viewport
  className?: string
  id: string
  title: string
  description?: string
  is_shipped: boolean
  links: AdventLink[]
  icons?: AdventLink[]
  type?: string
}

export interface AdventLink {
  url: string
  label?: string
  icon?: any
  target?: '_blank'
}

export const days: AdventDay[] = [
  {
    title: 'PostgreSQL Index Advisor',
    description: 'A PostgreSQL extension for recommending indexes to improve query performance.',
    id: 'pg-index-advisor',
    is_shipped: true,
    links: [
      {
        url: 'https://github.com/supabase/index_advisor',
        label: 'Learn more',
        target: '_blank',
      },
    ],
    icon: (
      <svg
        width="34"
        height="32"
        viewBox="0 0 34 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.43881 3.75378C4.10721 1.93324 5.84055 0.723145 7.77992 0.723145H15.6033V0.734736H17.0394C23.8756 0.734736 29.4173 6.27652 29.4173 13.1127V20.1749C29.4173 20.7272 28.9696 21.1749 28.4173 21.1749C27.8651 21.1749 27.4173 20.7272 27.4173 20.1749V13.1127C27.4173 7.38109 22.771 2.73474 17.0394 2.73474H15.4396C15.3877 2.73474 15.3366 2.73078 15.2868 2.72314H7.77992C6.6793 2.72314 5.6956 3.40989 5.31627 4.44308L2.7812 11.3479C2.37375 12.4577 2.69516 13.7038 3.58855 14.4781L5.32807 15.9856C6.12772 16.6786 6.58711 17.6847 6.58709 18.7428L6.58706 21.5134C6.58702 23.8192 8.45627 25.6885 10.7621 25.6885C11.4007 25.6885 11.9184 25.1708 11.9184 24.5322L11.9185 12.1874C11.9185 9.59233 12.955 7.10481 14.7977 5.27761C15.1899 4.88873 15.823 4.8914 16.2119 5.28357C16.6008 5.67574 16.5981 6.3089 16.2059 6.69777C14.742 8.14943 13.9185 10.1257 13.9185 12.1874L13.9184 24.5323C13.9184 26.2754 12.5053 27.6885 10.7621 27.6885C7.35169 27.6885 4.58701 24.9238 4.58706 21.5134L4.58709 18.7428C4.5871 18.2647 4.37953 17.8101 4.01822 17.497L2.27871 15.9894C0.757203 14.6708 0.209829 12.5486 0.90374 10.6586L3.43881 3.75378ZM16.539 18.5225C17.0348 18.2791 17.634 18.4838 17.8773 18.9796C19.1969 21.6686 21.9313 23.3727 24.9267 23.3726L32.8043 23.3726C33.3566 23.3725 33.8043 23.8203 33.8043 24.3725C33.8044 24.9248 33.3566 25.3725 32.8044 25.3726L29.4081 25.3726C29.4142 25.4172 29.4173 25.4628 29.4173 25.5091C29.4173 29.0627 26.1868 31.4165 22.6091 31.4165C19.2966 31.4165 16.5385 29.0518 15.9271 25.9188C15.8213 25.3767 16.175 24.8516 16.717 24.7458C17.2591 24.64 17.7843 24.9936 17.89 25.5357C18.3217 27.7475 20.2716 29.4165 22.6091 29.4165C25.447 29.4165 27.4173 27.6256 27.4173 25.5091C27.4173 25.4628 27.4205 25.4172 27.4266 25.3726L24.9267 25.3726C21.1684 25.3727 17.7375 23.2346 16.0818 19.8607C15.8385 19.3649 16.0432 18.7658 16.539 18.5225Z"
          fill="hsl(var(--foreground-light))"
        />
        <path
          d="M21.7224 13.0006C21.7224 13.6338 22.2358 14.1472 22.869 14.1472C23.5022 14.1472 24.0156 13.6338 24.0156 13.0006C24.0156 12.3674 23.5022 11.854 22.869 11.854C22.2358 11.854 21.7224 12.3674 21.7224 13.0006Z"
          fill="hsl(var(--foreground-light))"
        />
      </svg>
    ),
  },
  {
    title: 'Branching now Publicly Available',
    description: 'Supabase Branching is now available on Pro Plan and above.',
    id: 'branching',
    is_shipped: true,
    icon: (
      <svg
        width="31"
        height="21"
        viewBox="0 0 31 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M25.8657 12.5851C24.9374 12.5878 24.0363 12.8984 23.3035 13.4682C22.5707 14.038 22.0477 14.8349 21.8164 15.7339H17.469C16.6342 15.733 15.8338 15.4009 15.2435 14.8106C14.6532 14.2203 14.3211 13.4199 14.3202 12.5851V8.38674C14.3162 7.24753 13.938 6.1412 13.2437 5.23796H21.8164C22.0718 6.22737 22.6794 7.08964 23.5251 7.66315C24.3709 8.23666 25.3967 8.48203 26.4104 8.35327C27.4242 8.22452 28.3561 7.73047 29.0316 6.96374C29.7071 6.197 30.0798 5.21023 30.0798 4.18837C30.0798 3.16652 29.7071 2.17974 29.0316 1.41301C28.3561 0.646277 27.4242 0.152228 26.4104 0.0234703C25.3967 -0.105288 24.3709 0.140085 23.5251 0.713594C22.6794 1.2871 22.0718 2.14938 21.8164 3.13878H8.9232C8.66774 2.14938 8.0602 1.2871 7.21446 0.713594C6.36872 0.140085 5.34285 -0.105288 4.32914 0.0234703C3.31543 0.152228 2.38348 0.646277 1.70798 1.41301C1.03247 2.17974 0.65979 3.16652 0.65979 4.18837C0.65979 5.21023 1.03247 6.197 1.70798 6.96374C2.38348 7.73047 3.31543 8.22452 4.32914 8.35327C5.34285 8.48203 6.36872 8.23666 7.21446 7.66315C8.0602 7.08964 8.66774 6.22737 8.9232 5.23796H9.07225C9.90707 5.23888 10.7074 5.57092 11.2978 6.16123C11.8881 6.75154 12.2201 7.55191 12.221 8.38674V12.5851C12.2227 13.9764 12.7761 15.3103 13.7599 16.2942C14.7437 17.278 16.0776 17.8314 17.469 17.8331H21.8164C22.014 18.5916 22.4203 19.2796 22.9892 19.8188C23.5581 20.3581 24.2669 20.727 25.035 20.8836C25.803 21.0403 26.5996 20.9784 27.3343 20.7051C28.069 20.4317 28.7123 19.9578 29.1911 19.3372C29.67 18.7166 29.9652 17.9741 30.0433 17.1942C30.1214 16.4142 29.9792 15.6279 29.6329 14.9247C29.2865 14.2215 28.7499 13.6295 28.084 13.2159C27.4181 12.8024 26.6496 12.5838 25.8657 12.5851ZM25.8657 2.08919C26.2809 2.08919 26.6867 2.21231 27.032 2.44297C27.3772 2.67363 27.6462 3.00148 27.8051 3.38505C27.964 3.76863 28.0056 4.1907 27.9246 4.5979C27.8436 5.0051 27.6436 5.37914 27.3501 5.67272C27.0565 5.96629 26.6824 6.16622 26.2752 6.24722C25.868 6.32822 25.446 6.28665 25.0624 6.12776C24.6788 5.96888 24.351 5.69982 24.1203 5.35462C23.8896 5.00941 23.7665 4.60355 23.7665 4.18837C23.7672 3.63183 23.9885 3.09827 24.3821 2.70473C24.7756 2.3112 25.3092 2.08983 25.8657 2.08919ZM4.87388 6.28755C4.4587 6.28755 4.05285 6.16444 3.70764 5.93378C3.36243 5.70312 3.09337 5.37527 2.93449 4.99169C2.77561 4.60812 2.73404 4.18604 2.81503 3.77884C2.89603 3.37164 3.09596 2.9976 3.38954 2.70403C3.68311 2.41045 4.05715 2.21052 4.46435 2.12953C4.87155 2.04853 5.29363 2.0901 5.6772 2.24898C6.06078 2.40786 6.38863 2.67692 6.61929 3.02213C6.84995 3.36734 6.97306 3.77319 6.97306 4.18837C6.97251 4.74494 6.75117 5.27855 6.35761 5.6721C5.96406 6.06566 5.43045 6.287 4.87388 6.28755ZM25.8657 18.8826C25.4505 18.8826 25.0447 18.7595 24.6995 18.5289C24.3543 18.2982 24.0852 17.9704 23.9263 17.5868C23.7674 17.2032 23.7259 16.7811 23.8069 16.3739C23.8879 15.9667 24.0878 15.5927 24.3814 15.2991C24.6749 15.0055 25.049 14.8056 25.4562 14.7246C25.8634 14.6436 26.2855 14.6852 26.669 14.8441C27.0526 15.003 27.3805 15.272 27.6111 15.6172C27.8418 15.9624 27.9649 16.3683 27.9649 16.7835C27.9641 17.34 27.7427 17.8735 27.3492 18.267C26.9557 18.6605 26.4222 18.8819 25.8657 18.8826Z"
          fill="currentColor"
        />
      </svg>
    ),
    links: [
      {
        url: '/blog/branching-publicly-available',
        label: 'Blog post',
        target: '_blank',
      },
    ],
  },
  {
    title: 'Oriole joins Supabase',
    description:
      'The Oriole team are joining Supabase to build a faster storage engine for Postgres.',
    id: 'oriole',
    is_shipped: true,
    links: [
      {
        url: '/blog/supabase-aquires-oriole',
        label: 'Blog post',
        target: '_blank',
      },
    ],
    icon: (
      <svg
        width="49"
        height="50"
        viewBox="0 0 49 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M32.3419 16.1687C26.9198 19.0762 22.2245 19.1919 20.5547 18.8863C24.0908 22.894 28.1618 23.1755 29.7552 22.8152C37.4684 22.442 40.855 13.0158 48.2546 13.2545C46.6043 11.4734 44.4237 11.05 43.5397 11.0609C39.6868 10.8581 35.3857 14.269 32.3419 16.1687Z"
          fill="hsl(var(--foreground-light))"
        />
        <path
          d="M12.6959 13.353C17.8299 18.0154 25.4872 16.6927 28.6741 15.4485C25.7928 15.1342 22.0602 11.6504 20.554 9.94776C15.0031 4.03282 7.47323 1.59481 0.253906 6.21518C4.37942 6.80454 6.27846 7.52486 12.6959 13.353Z"
          fill="hsl(var(--foreground-light))"
        />
        <path
          d="M24.5485 2.22059C21.6148 -0.555946 15.8172 0.496169 13.2852 1.36929C17.4762 1.36929 22.8022 7.61206 24.9414 10.7334C27.6059 14.037 30.8974 13.9871 32.2101 13.5493C31.1624 12.8158 29.7217 10.1441 29.1324 8.89988C27.194 5.18037 25.2688 2.89722 24.5485 2.22059Z"
          fill="hsl(var(--foreground-light))"
        />
        <path
          d="M31.1956 7.73838C30.7536 5.49555 28.9582 3.13734 27.8886 1.82766C30.4359 1.82766 35.7101 3.85375 34.6335 7.26286C34.162 9.88223 34.0878 12.196 34.1096 13.0255C32.3809 11.7158 31.4532 9.04546 31.1956 7.73838Z"
          fill="hsl(var(--foreground-light))"
        />
      </svg>
    ),
  },
  {
    title: 'Supabase on AWS Marketplace',
    description:
      'Supabase is now available on the AWS Marketplace, Simplifying Procurement for Enterprise Customers.',
    id: 'aws-marketplace',
    is_shipped: true,
    icon: (
      <svg
        width="41"
        height="33"
        viewBox="0 0 41 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.00976 32.2636C10.4187 32.2636 11.5609 31.1214 11.5609 29.7124C11.5609 28.3035 10.4187 27.1613 9.00976 27.1613C7.6008 27.1613 6.45862 28.3035 6.45862 29.7124C6.45862 31.1214 7.6008 32.2636 9.00976 32.2636Z"
          fill="currentColor"
        />
        <path
          d="M23.6109 32.2636C25.0199 32.2636 26.1621 31.1214 26.1621 29.7124C26.1621 28.3035 25.0199 27.1613 23.6109 27.1613C22.202 27.1613 21.0598 28.3035 21.0598 29.7124C21.0598 31.1214 22.202 32.2636 23.6109 32.2636Z"
          fill="currentColor"
        />
        <path
          d="M40.1662 6.15511H28.876L24.3709 21.5705H7.92416L5.1559 12.5058H0.813538L5.26446 26.0214H27.0305L32.0785 9.62901H40.1662V6.15511Z"
          fill="currentColor"
        />
        <path
          d="M16.7175 8.92336L21.6026 11.2031L26.4878 3.38686H16.7175V8.92336Z"
          fill="currentColor"
        />
        <path
          d="M26.4878 8.92336L21.6026 11.2031V3.44114L26.4878 3.38686V8.92336Z"
          fill="currentColor"
        />
        <path
          d="M21.6027 0.889999L16.7175 3.38685L21.6027 5.61232L26.4878 3.38685L21.6027 0.889999Z"
          fill="currentColor"
        />
        <path
          d="M5.64447 8.92336L10.4753 11.2031L15.4148 3.38686H5.64447V8.92336Z"
          fill="currentColor"
        />
        <path d="M15.4148 8.92336L10.4754 11.2031V3.38686H15.4148V8.92336Z" fill="currentColor" />
        <path
          d="M10.4753 0.889999L5.64444 3.38685L10.4753 5.61232L15.4148 3.38685L10.4753 0.889999Z"
          fill="currentColor"
        />
        <path
          d="M11.1809 18.0423L16.0661 20.3221L20.9513 12.343H11.1809V18.0423Z"
          fill="currentColor"
        />
        <path d="M20.9513 18.0423L16.0661 20.3221V12.343H20.9513V18.0423Z" fill="currentColor" />
        <path
          d="M16.0661 10.0632L20.9513 12.343L16.0661 14.7313L11.181 12.343L16.0661 10.0632Z"
          fill="currentColor"
        />
      </svg>
    ),
    links: [
      {
        url: '/blog/supabase-aws-marketplace',
        label: 'Blog post',
        target: '_blank',
      },
    ],
  },
  {
    title: 'Supabase Bootstrap',
    description:
      'Launch a new hosted Supabase project directly from the CLI using pre-built applications.',
    id: 'supabase-bootstrap',
    is_shipped: true,
    icon: (
      <svg
        width="37"
        height="37"
        viewBox="0 0 37 37"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.17327 36.1237C8.80564 36.1237 8.44388 36.0998 8.08939 36.0536L8.01632 36.6138C7.23514 36.5119 6.48595 36.3082 5.7825 36.0165L5.9989 35.4946C5.32499 35.2152 4.69568 34.8493 4.12483 34.4106L3.78061 34.8585C3.16696 34.387 2.61683 33.8368 2.14527 33.2232L2.59321 32.879C2.15454 32.3081 1.78864 31.6788 1.50918 31.0049L0.987341 31.2213C0.695631 30.5179 0.491954 29.7687 0.390057 28.9875L0.95024 28.9144C0.904 28.5599 0.880114 28.1982 0.880114 27.8305V26.6573H0.315186V24.3107H0.880114V21.9642H0.315186V19.6176H0.880114V17.2711H0.315186V14.9246H0.880114V12.578H0.315186V10.2315H0.880114V9.05822C0.880114 8.69059 0.904 8.32883 0.95024 7.97434L0.390057 7.90127C0.491954 7.12009 0.69563 6.3709 0.987342 5.66745L1.50918 5.88385C1.78864 5.20994 2.15454 4.58063 2.59321 4.00978L2.14527 3.66556C2.61683 3.05191 3.16696 2.50178 3.78061 2.03022L4.12484 2.47816C4.69568 2.03949 5.325 1.67359 5.9989 1.39413L5.7825 0.87229C6.48596 0.580579 7.23515 0.376903 8.01632 0.275005L8.08939 0.835189C8.44388 0.788948 8.80565 0.765063 9.17327 0.765063H10.3465V0.200134H12.6931V0.765063H15.0396V0.200134H17.3862V0.765063H19.7327V0.200134H22.0792V0.765063H24.4258V0.200134H26.7723V0.765063H27.9456C28.3132 0.765063 28.675 0.788948 29.0295 0.835189L29.1025 0.275005C29.8837 0.376903 30.6329 0.58058 31.3364 0.872291L31.12 1.39413C31.7939 1.67359 32.4232 2.03949 32.994 2.47816L33.3383 2.03022C33.9519 2.50178 34.502 3.05191 34.9736 3.66556L34.5257 4.00978C34.9643 4.58063 35.3302 5.20994 35.6097 5.88385L36.1315 5.66745C36.4232 6.37091 36.6269 7.12009 36.7288 7.90127L36.1686 7.97434C36.2149 8.32883 36.2387 8.69059 36.2387 9.05822V10.2315H36.8037V12.578H36.2387V14.9246H36.8037V17.2711H36.2387V19.6177H36.8037V21.9642H36.2387V24.3107H36.8037V26.6573H36.2387V27.8305C36.2387 28.1982 36.2149 28.5599 36.1686 28.9144L36.7288 28.9875C36.6269 29.7687 36.4232 30.5179 36.1315 31.2213L35.6097 31.0049C35.3302 31.6788 34.9643 32.3081 34.5256 32.879L34.9736 33.2232C34.502 33.8369 33.9519 34.387 33.3383 34.8585L32.994 34.4106C32.4232 34.8493 31.7939 35.2152 31.12 35.4946L31.3364 36.0165C30.6329 36.3082 29.8837 36.5119 29.1025 36.6138L29.0295 36.0536C28.675 36.0998 28.3132 36.1237 27.9456 36.1237H26.7723V36.6886H24.4258V36.1237H22.0792V36.6886H19.7327V36.1237H17.3862V36.6886H15.0396V36.1237H12.6931V36.6886H10.3465V36.1237H9.17327Z"
          stroke="currentColor"
          strokeWidth="1.12986"
          strokeDasharray="2.26 2.26"
        />
        <path
          d="M9.26641 19.2458V19.3588H9.37939C9.97925 19.3588 10.5345 19.4987 10.9374 19.817C11.3359 20.1319 11.5997 20.6326 11.5997 21.3882V24.273C11.5997 25.606 11.9385 26.6254 12.6104 27.3112C13.2828 27.9973 14.2709 28.3314 15.5309 28.3314H15.8066H15.9196V28.2184V26.6275V26.5146H15.8066H15.5309C14.7589 26.5146 14.2791 26.3472 13.9872 26.0195C13.6924 25.6884 13.5651 25.1676 13.5651 24.4003V20.9427C13.5651 20.2088 13.3456 19.5929 12.9437 19.1269C12.63 18.7631 12.2096 18.4957 11.7071 18.3337C12.2096 18.1716 12.63 17.9042 12.9437 17.5404C13.3456 17.0744 13.5651 16.4585 13.5651 15.7246V12.2458C13.5651 11.4785 13.6924 10.9577 13.9872 10.6266C14.2791 10.2989 14.7589 10.1315 15.5309 10.1315H15.8066H15.9196V10.0185V8.42764V8.31466H15.8066H15.5309C14.2709 8.31466 13.2828 8.64876 12.6104 9.33493C11.9385 10.0207 11.5997 11.0401 11.5997 12.3731V15.2791C11.5997 16.0347 11.3359 16.5354 10.9374 16.8503C10.5345 17.1686 9.97925 17.3085 9.37939 17.3085H9.26641V17.4215V19.2458ZM27.8522 17.4215V17.3085H27.7392C27.1394 17.3085 26.5841 17.1686 26.1812 16.8503C25.7827 16.5354 25.5189 16.0347 25.5189 15.2791V12.3731C25.5189 11.0401 25.1802 10.0207 24.5082 9.33493C23.8359 8.64876 22.8477 8.31466 21.5877 8.31466H21.312H21.199V8.42764V10.0185V10.1315H21.312H21.5877C22.3598 10.1315 22.8395 10.2989 23.1314 10.6266C23.4262 10.9577 23.5535 11.4785 23.5535 12.2458V15.7246C23.5535 16.4585 23.7731 17.0744 24.1749 17.5404C24.4886 17.9042 24.909 18.1716 25.4115 18.3337C24.909 18.4957 24.4886 18.7631 24.1749 19.1269C23.7731 19.5929 23.5535 20.2088 23.5535 20.9427V24.4003C23.5535 25.1676 23.4262 25.6884 23.1314 26.0195C22.8395 26.3472 22.3598 26.5146 21.5877 26.5146H21.312H21.199V26.6275V28.2184V28.3314H21.312H21.5877C22.8477 28.3314 23.8359 27.9973 24.5082 27.3112C25.1802 26.6254 25.5189 25.606 25.5189 24.273V21.3882C25.5189 20.6326 25.7827 20.1319 26.1812 19.817C26.5841 19.4987 27.1394 19.3588 27.7392 19.3588H27.8522V19.2458V17.4215Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0.225972"
        />
      </svg>
    ),
    links: [
      {
        url: '/blog/supabase-bootstrap',
        label: 'Blog post',
        target: '_blank',
      },
    ],
  },
  {
    title: 'Supabase Swift',
    description: 'Supabase Swift is now officially supported.',
    id: 'supabase-swift',
    is_shipped: true,
    icon: (
      <svg
        width="37"
        height="37"
        viewBox="0 0 37 37"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M36.5368 9.18927V27.6498C36.5368 28.4764 36.4679 29.2685 36.3301 30.0607C36.1924 30.8528 35.9513 31.6105 35.5724 32.3338C35.1936 33.0226 34.7458 33.677 34.1603 34.2625C33.6093 34.848 32.9549 35.2957 32.2316 35.6746C31.5083 36.0535 30.7506 36.2945 29.9585 36.4323C29.1775 36.5681 28.3631 36.6035 27.5812 36.6375L27.5476 36.639H9.05265C8.22606 36.639 7.43391 36.5701 6.64176 36.4323C5.84961 36.2945 5.0919 36.0535 4.36863 35.6746C3.67981 35.2957 3.02543 34.848 2.43993 34.2625C1.85443 33.7114 1.40669 33.0571 1.02783 32.3338C0.648979 31.6105 0.407891 30.8528 0.270126 30.0607C0.134298 29.2797 0.0989065 28.4652 0.0649292 27.6832L0.0634766 27.6498V9.15483C0.0979178 8.32824 0.132361 7.53609 0.270126 6.74394C0.407891 5.95179 0.648979 5.19408 1.02783 4.47082C1.40669 3.78199 1.85443 3.12761 2.43993 2.54211C2.50881 2.47322 2.5863 2.40434 2.66379 2.33546C2.74128 2.26658 2.81878 2.1977 2.88766 2.12882C3.36984 1.74996 3.85202 1.40555 4.40308 1.13002C4.48918 1.09558 4.58389 1.05253 4.67861 1.00947C4.77332 0.966423 4.86803 0.92337 4.95413 0.888929C5.50519 0.682281 6.0907 0.510077 6.6762 0.406753C7.24546 0.306296 7.84728 0.270952 8.41835 0.237415C8.43464 0.236458 8.45091 0.235502 8.46715 0.234547C8.63935 0.200106 8.846 0.200104 9.05265 0.200104H27.5476C28.3742 0.200104 29.1663 0.268988 29.9585 0.406753C30.7506 0.544518 31.5083 0.785601 32.2316 1.16445C32.9204 1.54331 33.5748 1.99105 34.1603 2.57655C34.7458 3.12761 35.1936 3.78199 35.5724 4.50526C35.9513 5.22853 36.1924 5.98624 36.3301 6.77839C36.4659 7.55938 36.5013 8.37386 36.5353 9.1558L36.5368 9.18927ZM29.0286 22.3114L28.9253 22.7247C32.0939 26.5821 31.2328 30.7151 30.7507 29.9918C29.0975 26.8232 26.0666 27.6153 24.5168 28.4075C24.4479 28.4419 24.379 28.485 24.3101 28.528C24.2413 28.5711 24.1724 28.6141 24.1035 28.6486C24.1035 28.683 24.0691 28.683 24.0691 28.683C20.866 30.4051 16.5264 30.5084 12.1868 28.6486C8.53605 27.0643 5.53966 24.3779 3.61095 21.2782C4.60974 22.0014 5.67742 22.6558 6.81399 23.1724C11.3947 25.3422 16.0098 25.17 19.2817 23.1724C14.6322 19.5905 10.7403 14.941 7.77834 11.1524C7.22728 10.498 6.71066 9.77478 6.26292 9.05151C9.84481 12.289 15.4587 16.3875 17.4908 17.5241C13.2201 13.0123 9.43152 7.43277 9.60372 7.60498C16.3542 14.3899 22.5881 18.2473 22.5881 18.2473C22.8292 18.3506 23.0014 18.454 23.1391 18.5573C23.2769 18.2129 23.3802 17.8685 23.4836 17.5241C24.5512 13.5978 23.3458 9.08595 20.5905 5.3663C26.8588 9.12039 30.544 16.2842 29.0286 22.3114Z"
          fill="currentColor"
        />
      </svg>
    ),
    links: [
      {
        url: '/blog/supabase-swift',
        label: 'Blog post',
        target: '_blank',
      },
    ],
  },
  {
    title: '',
    description: '',
    icon: null,
    id: '',
    is_shipped: false,
    links: [
      {
        url: '',
        label: 'Learn more',
        target: '_blank',
      },
    ],
  },
  {
    title: '',
    description: '',
    icon: null,
    id: '',
    is_shipped: false,
    links: [
      {
        url: '',
        label: 'Learn more',
        target: '_blank',
      },
    ],
  },
  {
    title: '',
    description: '',
    icon: null,
    id: '',
    is_shipped: false,
    links: [
      {
        url: '',
        label: 'Learn more',
        target: '_blank',
      },
    ],
  },
  {
    title: '',
    description: '',
    icon: null,
    id: '',
    is_shipped: false,
    links: [
      {
        url: '',
        label: 'Learn more',
        target: '_blank',
      },
    ],
  },
  {
    title: '',
    description: '',
    icon: null,
    id: '',
    is_shipped: false,
    links: [
      {
        url: '',
        label: 'Learn more',
        target: '_blank',
      },
    ],
  },
  {
    title: '',
    description: '',
    icon: null,
    id: '',
    is_shipped: false,
    links: [
      {
        url: '',
        label: 'Learn more',
        target: '_blank',
      },
    ],
  },
]
