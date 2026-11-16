// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Shogo Technologies, Inc.
/**
 * A dev build launched with its own SHOGO_USER_DATA_DIR used to `kill -9`
 * whatever held port 39100 at startup, which is the installed Shogo's API,
 * and `pkill` every QEMU on the machine. Isolated instances must skip both.
 */
import { describe, it, expect } from 'bun:test'
import { machineWideSweepSkipReason } from '../machine-sweeps'

describe('machineWideSweepSkipReason', () => {
  it('runs the sweeps for a normal install', () => {
    expect(machineWideSweepSkipReason({})).toBeNull()
  })

  it('skips the sweeps for an isolated dev instance', () => {
    expect(machineWideSweepSkipReason({ SHOGO_USER_DATA_DIR: '/tmp/shogo-dev' })).toBe('SHOGO_USER_DATA_DIR')
  })

  it('skips the sweeps for e2e runs (both spellings)', () => {
    expect(machineWideSweepSkipReason({ SHOGO_E2E: '1' })).toBe('SHOGO_E2E')
    expect(machineWideSweepSkipReason({ SHOGO_E2E: 'true' })).toBe('SHOGO_E2E')
  })

  it('treats an empty SHOGO_USER_DATA_DIR as unset', () => {
    expect(machineWideSweepSkipReason({ SHOGO_USER_DATA_DIR: '' })).toBeNull()
  })
})
