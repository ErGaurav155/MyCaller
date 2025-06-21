import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  ignoredRoutes: [
    "/",
    "/pricing",
    "/contactUs",
    "/Features",
    "/Review",
    "/api/webhooks/clerk",
    "/TermsandCondition",
    "/privacy-policy",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
