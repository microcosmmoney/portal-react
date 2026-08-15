'use client'

import { ComponentType, createElement, Fragment } from 'react'
import { MicrocosmEcosystemBanner } from './components/ecosystem-banner'

export interface EcosystemBannerOptions {
  showEcosystemBanner?: boolean
  ecosystemProjectName?: string
}

export function withEcosystemBanner<P extends object>(Component: ComponentType<P>): ComponentType<P & EcosystemBannerOptions> {
  function Wrapped(props: P & EcosystemBannerOptions) {
    const { showEcosystemBanner, ecosystemProjectName, ...rest } = props as EcosystemBannerOptions & Record<string, unknown>

    const banner =
      showEcosystemBanner === false
        ? null
        : createElement(MicrocosmEcosystemBanner, {
            projectName: ecosystemProjectName,
            autoHideOnOwnHost: showEcosystemBanner !== true,
          })

    return createElement(Fragment, null, banner, createElement(Component as ComponentType<any>, rest))
  }
  Wrapped.displayName = `withEcosystemBanner(${Component.displayName || Component.name || 'Component'})`
  return Wrapped as ComponentType<P & EcosystemBannerOptions>
}
