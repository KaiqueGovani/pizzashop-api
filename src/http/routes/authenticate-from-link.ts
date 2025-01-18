import { Elysia, t } from "elysia";
import { db } from "../../db/db";
import { authLinks, restaurants } from "../../db/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";
import { auth } from "../auth";

export const authenticateFromLink = new Elysia().use(auth).get("/auth-links/authenticate", 
    async ({ query, jwt: { sign }, redirect, cookie: { auth } }) => {
        const { code, redirect: redirectUrl } = query

        const [authLinkFromCode] = await db.select().from(authLinks).where(eq(authLinks.code, code))

        if (!authLinkFromCode) {
            throw new Error("Auth link not found.")
        }

        const daysSinceAuthLinkWasCreated = dayjs().diff(authLinkFromCode.createdAt, "days")

        if (daysSinceAuthLinkWasCreated > 7) {
            throw new Error("Auth link expired, please generate a new one.")
        }

        const [managedRestaurant] = await db.select().from(restaurants).where(eq(restaurants.managerId, authLinkFromCode.userId))

        const token = await sign({
            sub: authLinkFromCode.userId,
            restaurantId: managedRestaurant?.id,
        })

        auth.set({
            value: token,
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })
        
        await db.delete(authLinks).where(eq(authLinks.code, code))
        
        return redirect(redirectUrl)
    }, {
        query: t.Object({
            code: t.String(),
            redirect: t.String(),
        })
    }
)