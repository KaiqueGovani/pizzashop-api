import { Elysia, t } from "elysia";
import { db } from "../../db/db";
import { authLinks, restaurants } from "../../db/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";
import { auth } from "../auth";

export const authenticateFromLink = new Elysia().use(auth).get("/auth-links/authenticate", 
    async ({ query, redirect, signUser }) => {
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

        await signUser({
            sub: authLinkFromCode.userId,
            restaurantId: managedRestaurant?.id,
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