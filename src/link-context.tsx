'use client'

import React, { createContext, useContext } from 'react'

export interface LinkProps {
  href: string
  className?: string
  children?: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  target?: string
  rel?: string
}

export type LinkComponent = React.ComponentType<LinkProps>

const DefaultLink: LinkComponent = ({ href, className, children, onClick, target, rel }) => (
  <a href={href} className={className} onClick={onClick} target={target} rel={rel}>{children}</a>
)

const LinkContext = createContext<LinkComponent>(DefaultLink)

export function LinkProvider({ component, children }: { component: LinkComponent; children: React.ReactNode }) {
  return <LinkContext.Provider value={component}>{children}</LinkContext.Provider>
}

export function useLinkComponent(): LinkComponent {
  return useContext(LinkContext)
}
