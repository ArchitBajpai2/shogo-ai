// SPDX-License-Identifier: MIT
// Copyright (C) 2026 Shogo Technologies, Inc.
/**
 * The desktop's free-port probe bound 127.0.0.1, but the local API binds the
 * wildcard address. On macOS a loopback bind succeeds next to a `*:port`
 * listener, so a port held by another Shogo's API was reported free and the
 * new API crash-looped on EADDRINUSE.
 */
import { describe, it, expect, afterEach } from 'bun:test'
import { createServer, type Server } from 'net'
import { isPortAvailable } from '../port-probe'

const servers: Server[] = []

function listen(host?: string): Promise<number> {
  const server = createServer()
  servers.push(server)
  return new Promise((resolve) => {
    const onListening = () => resolve((server.address() as { port: number }).port)
    if (host) server.listen(0, host, onListening)
    else server.listen(0, onListening)
  })
}

afterEach(async () => {
  await Promise.all(servers.splice(0).map((s) => new Promise<void>((r) => s.close(() => r()))))
})

describe('isPortAvailable', () => {
  it('reports a port held on the wildcard address as taken', async () => {
    const port = await listen()
    expect(await isPortAvailable(port)).toBe(false)
  })

  it('reports a port held on loopback as taken', async () => {
    const port = await listen('127.0.0.1')
    expect(await isPortAvailable(port)).toBe(false)
  })

  it('reports a released port as free', async () => {
    const port = await listen()
    await new Promise<void>((r) => servers.pop()!.close(() => r()))
    expect(await isPortAvailable(port)).toBe(true)
  })
})
