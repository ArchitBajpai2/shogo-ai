// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Shogo Technologies, Inc.
/**
 * `bun dev:all` hardcoded its web port to 8081 and clears that port with
 * `kill -9` before starting. With a Docker/OrbStack container publishing 8081,
 * the listener is the container runtime itself, so dev:all killed it. The
 * port is now configurable through SHOGO_DEV_WEB_PORT.
 */
import { describe, test, expect } from 'bun:test'
import { resolveDevWebPort } from '../dev-all'

describe('resolveDevWebPort', () => {
  test('defaults to 8081 when SHOGO_DEV_WEB_PORT is unset or blank', () => {
    expect(resolveDevWebPort({})).toBe(8081)
    expect(resolveDevWebPort({ SHOGO_DEV_WEB_PORT: '  ' })).toBe(8081)
  })

  test('uses SHOGO_DEV_WEB_PORT when set', () => {
    expect(resolveDevWebPort({ SHOGO_DEV_WEB_PORT: '8131' })).toBe(8131)
  })

  test('rejects a port that is not a valid TCP port', () => {
    for (const bad of ['abc', '0', '65536', '81.5', '-1']) {
      expect(() => resolveDevWebPort({ SHOGO_DEV_WEB_PORT: bad })).toThrow('SHOGO_DEV_WEB_PORT is invalid')
    }
  })
})
