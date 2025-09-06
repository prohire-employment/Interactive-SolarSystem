
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import 'immer'
import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {createSelectorFunctions} from 'auto-zustand-selectors-hook'

export default createSelectorFunctions(
  create(
    immer(() => ({
      didInit: false,
      celestialBodies: null,
      isFetching: false,
      isSidebarOpen: false,
      targetBody: null,
      caption: null,
      resetCam: false,
    }))
  )
)
