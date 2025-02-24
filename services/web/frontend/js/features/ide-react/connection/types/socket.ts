export type Socket = {
  publicId: string
  on(event: string, callback: (...data: any[]) => void): void
  removeListener(event: string, callback: (...data: any[]) => void): void
  emit(
    event: string,
    arg0: any,
    callback?: (error: Error, ...data: any[]) => void
  ): void
  emit(
    event: string,
    arg0: any,
    arg1: any,
    callback?: (error: Error, ...data: any[]) => void
  ): void
  emit(
    event: string,
    arg0: any,
    arg1: any,
    arg2: any,
    callback?: (error: Error, ...data: any[]) => void
  ): void
  socket: {
    connected: boolean
    connecting: boolean
    connect(): void
    onDisconnect(reason: string): void
    disconnect(): void
    sessionid: string
    transport?: {
      name: string
    }
    transports: string[]
  }
  disconnect(): void
}
