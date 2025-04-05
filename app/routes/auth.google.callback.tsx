import type { LoaderFunction } from "@remix-run/node";
import { authenticator } from "common/auth/auth.server";

export const loader: LoaderFunction = ({ request }) => {
  return authenticator.authenticate("google", request, {
    successRedirect: "/?startChoose=true",
    failureRedirect: "/login/failure",
  });
}; 