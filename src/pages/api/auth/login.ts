import { User } from '@prisma/client'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import {NextApiHandlerWithCookie} from "@/src/types";
import checkFields from "@/src/utils/checkFields";
import prisma from "@/src/utils/prisma";
import {cookies} from "next/headers";

const loginHandler: NextApiHandlerWithCookie = async (req, res) => {
    const data: Pick<User, 'email' | 'password'> = JSON.parse(req.body)

    if (!checkFields(data, ['email', 'password'])) {
        return res.status(400).json({ message: 'Some required fields are missing' })
    }

    try {
        // получаем данные пользователя
        const user = await prisma.user.findUnique({
            where: {
                email: data.email
            },
            // важно!
            // здесь нам нужен пароль
            select: {
                id: true,
                email: true,
                password: true,
                username: true,
                avatarUrl: true
            }
        })

        // если данные отсутствуют
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // проверяем пароль
        const isPasswordCorrect = await argon2.verify(user.password, data.password)

        // если введен неправильный пароль
        if (!isPasswordCorrect) {
            return res.status(403).json({ message: 'Wrong password' })
        }

        // генерируем токен идентификации
        const idToken = await jwt.sign(
            { userId: user.id },
            process.env.ID_TOKEN_SECRET,
            {
                expiresIn: '7d'
            }
        )

        // генерируем токен доступа
        const accessToken = await jwt.sign(
            { userId: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '1d'
            }
        )

        // записываем токен идентификации в куки
        res.cookie({
            name: process.env.COOKIE_NAME,
            value: idToken,
            options: {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7,
                path: '/',
                sameSite: true,
                secure: true
            }
        })

        // возвращаем данные пользователя (без пароля!)
        // и токен доступа
        res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                avatarUrl: user.avatarUrl
            },
            accessToken
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'User login error' })
    }
}

export default cookies(loginHandler)