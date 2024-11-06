import { 
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    isAuthenticatedNextjs,
    nextjsMiddlewareRedirect,

    
  } from "@convex-dev/auth/nextjs/server";
  const isSignInPage = createRouteMatcher(["/auth"]);
  export default convexAuthNextjsMiddleware(async (request) => {

    if (!isSignInPage(request) && !isAuthenticatedNextjs()) {
      return nextjsMiddlewareRedirect(request, "/auth");
    }
    if (isSignInPage(request) && isAuthenticatedNextjs()) {
      return nextjsMiddlewareRedirect(request, "/");
    }

   
    
    
  });
   
  export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  };