// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Shogo Technologies, Inc.

/**
 * Instances that share the machine with another Shogo (e2e runs, a dev build
 * pointed at its own `SHOGO_USER_DATA_DIR`) must not run the machine-wide
 * startup sweeps (`pkill -f qemu-system`, `kill -9` on the preferred API
 * port), or they kill the other install's API and VMs. Returns the env var
 * responsible, or null when the sweeps should run.
 */
export function machineWideSweepSkipReason(env: NodeJS.ProcessEnv): string | null {
  if (env.SHOGO_E2E === '1' || env.SHOGO_E2E === 'true') return 'SHOGO_E2E'
  if (env.SHOGO_USER_DATA_DIR) return 'SHOGO_USER_DATA_DIR'
  return null
}
