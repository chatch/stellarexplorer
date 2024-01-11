import { NavLink } from '@remix-run/react'

const TabLink = ({
  base,
  title,
  activeTab,
  path = title?.toLowerCase(),
}: {
  base: string
  title: string
  activeTab: string
  path?: string
}) => (
  <NavLink
    to={`${base}/${path}`}
    className={activeTab === path ? 'active-tab-in-tab-link' : ''}
  >
    {title}
  </NavLink>
)

export default TabLink
