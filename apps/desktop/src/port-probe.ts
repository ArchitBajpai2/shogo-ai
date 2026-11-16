// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Shogo Technologies, Inc.
import { connect, createServer } from 'net'

function hasListener(port: number, timeoutMs: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = connect({ port, host: '127.0.0.1' })
    const done = (listening: boolean) => {
      socket.destroy()
      resolve(listening)
    }
    socket.once('connect', () => done(true))
    socket.once('error', () => done(false))
    socket.setTimeout(timeoutMs, () => done(false))
  })
}

function canBindLoopback(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer()
    server.once('error', () => resolve(false))
    server.once('listening', () => {
      server.close(() => resolve(true))
    })
    server.listen(port, '127.0.0.1')
  })
}

/**
 * Whether the local API can take `port`. A loopback bind alone is not enough:
 * the API binds the wildcard address, and on macOS/BSD a `127.0.0.1` bind
 * succeeds next to an existing `*:port` listener (SO_REUSEADDR), so another
 * Shogo's API looked free. Probing with a connect avoids binding the wildcard
 * from the Electron process, which can raise a firewall prompt.
 */
export async function isPortAvailable(port: number, connectTimeoutMs = 500): Promise<boolean> {
  if (await hasListener(port, connectTimeoutMs)) return false
  return canBindLoopback(port)
}
