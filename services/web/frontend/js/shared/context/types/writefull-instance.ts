export interface WritefullEvents {
  'writefull-login-complete': {
    method: 'email-password' | 'login-with-overleaf'
  }
  'writefull-received-suggestions': { numberOfSuggestions: number }
  'writefull-register-as-auto-account': { email: string }
}

type InsertPosition = {
  parentSelector: string
  insertBeforeSelector?: string
}

export interface WritefullAPI {
  init({
    toolbarPosition,
    iconPosition,
    hasAgreedToTOS,
    overleafUserId,
  }: {
    toolbarPosition: InsertPosition
    iconPosition: InsertPosition
    hasAgreedToTOS: boolean
    overleafUserId: string
  }): Promise<void>
  addEventListener<eventName extends keyof WritefullEvents>(
    name: eventName,
    callback: (detail: WritefullEvents[eventName]) => void
  ): void
}
