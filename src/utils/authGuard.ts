import jwt from 'jsonwebtoken'
import { AuthGuardMiddleware } from '../types'

const authGuard: AuthGuardMiddleware =
    (handler) => async (req, res) => {
        // извлекаем токен доступа из заголовка `Authorization`
        // значением этого заголовка должна быть строка `Bearer [accessToken]`
        const accessToken = req.headers.authorization?.split(' ')[1]

        // если токен доступа отсутствует
        if (!accessToken) {
            return res.status(403).json({ message: 'Access token must be provided' })
        }

        // декодируем токен
        // сигнатура токена - `{ userId: string }`
        const decodedToken = (await jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        )) as unknown as {
            userId: string
        }

        // если полезная нагрузка отсутствует
        if (
            !decodedToken || !decodedToken.userId
        ) {
            return res.status(403).json({ message: 'Invalid token' })
        }

        // записываем id прользователя в объект запроса
        req.userId = decodedToken.userId

        // передаем управление следующему обработчику
        return handler(req, res)
    }

export default authGuard