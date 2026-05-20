export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export const navigation: NavItem[] = []
