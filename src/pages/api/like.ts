import { Like } from '@prisma/client'
import { NextApiResponse } from 'next'
import nextConnect from 'next-connect'
import {NextApiRequestWithUserId} from "@/src/types";
import checkFields from "@/src/utils/checkFields";
import prisma from "@/src/utils/prisma";
import authGuard from "@/src/utils/authGuard";

const likeHandler = nextConnect<NextApiRequestWithUserId, NextApiResponse>()

// обработка POST-запроса
// создание лайка
likeHandler.post(async (req, res) => {
    const data = JSON.parse(req.body) as Pick<Like, 'postId'>

    if (!checkFields(data, ['postId'])) {
        return res.status(400).json({ message: 'Some required fields are missing' })
    }

    try {
        const like = await prisma.like.create({
            data: {
                postId: data.postId,
                userId: req.userId
            }
        })
        res.status(201).json(like)
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Like create error' })
    }
})

// обработка DELETE-запроса
// удаление поста
likeHandler.delete(async (req, res) => {
    const { likeId, postId } = req.query as Record<string, string>

    if (!likeId || !postId) {
        return res
            .status(400)
            .json({ message: 'Some required queries are missing' })
    }

    try {
        const like = await prisma.like.delete({
            // гарантия того, что пользователь удаляет свой лайк конкретного поста
            where: {
                id_userId_postId: {
                    id: likeId,
                    userId: req.userId,
                    postId
                }
            }
        })
        res.status(200).json(like)
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Like remove error' })
    }
})

export default authGuard(likeHandler)