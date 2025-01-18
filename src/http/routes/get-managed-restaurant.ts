import Elysia from "elysia";
import { auth } from "../auth";
import { db } from "../../db/db";
import { restaurants } from "../../db/schema";
import { eq } from "drizzle-orm";

export const getManagedRestaurant = new Elysia().use(auth).get('/managed-restaurant', async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
        throw new Error('User is not a manager.')
    }

    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, restaurantId))

    if (!restaurant) {
        throw new Error('Restaurant not found')
    }

    return restaurant
});
