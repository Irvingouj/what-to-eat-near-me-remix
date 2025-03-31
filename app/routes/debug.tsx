import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { db } from "common/db";
import { users } from "common/db/schema";
import { authenticator } from "common/auth/auth.server";



export const loader: LoaderFunction = async ({ request }) => {
    if (process.env.NODE_ENV === "production") {
        return redirect("/");
    }

    const cookie = await authenticator.isAuthenticated(request);
    const user = await db.query.users.findFirst({
        where: eq(users.id, cookie?.id ?? ""),
    });

    if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ user });
};

export default function Debug() {
    const { user, error } = useLoaderData<typeof loader>();
    return <div>
        <pre>{JSON.stringify(user, null, 2)}</pre>
        <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>;
}