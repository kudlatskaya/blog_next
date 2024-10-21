import { CookieSerializeOptions } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'

// параметры, принимаемые функцией
export type CookieArgs = {
    name: string
    value: any
    options?: CookieSerializeOptions
}

// расширяем объект ответа
export type NextApiResponseWithCookie = NextApiResponse & {
    cookie: (args: CookieArgs) => void
}

// расширяем обработчик запросов
export type NextApiHandlerWithCookie = (
    req: NextApiRequest,
    res: NextApiResponseWithCookie
) => unknown | Promise<unknown>

// определяем тип посредника
export type CookiesMiddleware = (
    handler: NextApiHandlerWithCookie
) => (req: NextApiRequest, res: NextApiResponseWithCookie) => void


export type NextApiRequestWithUserId = NextApiRequest & {
    userId: string
}

export type NextApiHandlerWithUserId = (
    req: NextApiRequestWithUserId,
    res: NextApiResponse
) => unknown | Promise<unknown>

export type AuthGuardMiddleware = (
    handler: NextApiHandlerWithUserId
) => (req: NextApiRequestWithUserId, res: NextApiResponse) => void