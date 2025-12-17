export const HomeTabEnum = {
  ALL: 'ALL',
  GROUP: 'GROUP',
  DIRECT: 'DIRECT',
}

export type HomeTab = (typeof HomeTabEnum)[keyof typeof HomeTabEnum]

export const HOME_TABS = [
  {
    value: 'All',
    label: HomeTabEnum.ALL,
  },
  {
    value: 'Groups',
    label: HomeTabEnum.GROUP,
  },
  {
    value: 'Direct',
    label: HomeTabEnum.DIRECT,
  },
]

export const FALLBACK_USER_AVATAR_LIGHT = '/images/user-avatar.png'
