
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import useStore from './store'

const get = useStore.getState
const set = useStore.setState

export const init = async () => {
  if (get().didInit) {
    return
  }

  set(state => {
    state.didInit = true
    state.isFetching = true
  })

  const celestialBodies = await fetch('meta.json').then(res => res.json())

  set(state => {
    state.celestialBodies = celestialBodies
    state.isFetching = false
  })
}

export const clearSelection = () =>
  set(state => {
    state.targetBody = null
    state.caption = null
    state.resetCam = true
  })

export const setTargetBody = async targetBodyId => {
  const currentTarget = get().targetBody;

  if (targetBodyId === currentTarget) {
    // Deselect if clicking the same body again
    set(state => {
        state.targetBody = null;
        state.caption = null;
        state.resetCam = true;
    });
    return;
  }
  
  set(state => {
    state.targetBody = targetBodyId
    state.resetCam = false
  })

  if (!targetBodyId) {
    set(state => {
      state.caption = null;
    })
    return
  }

  const body = get().celestialBodies.find(b => b.id === targetBodyId)
  if (body) {
    set(state => {
      state.caption = body.description
    })
  }
}

export const toggleSidebar = () =>
  set(state => {
    state.isSidebarOpen = !state.isSidebarOpen
  })

export const setSidebarOpen = isOpen =>
  set(state => {
    state.isSidebarOpen = isOpen
  })

init()
