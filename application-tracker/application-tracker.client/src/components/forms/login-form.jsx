import { GalleryVerticalEnd,House } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-provider"
import { toast } from "sonner"
import { LoginSkeleton } from "@/components/login-skeleton"
import { useGoogleLogin } from '@react-oauth/google';
"You have created a new client application that uses libraries for user authentication or authorization that are deprecated. New clients must use the new libraries instead. See the [Migration Guide](https://developers.google.com/identity/gsi/web/guides/gis-migration) for more information."

export function LoginForm({
  className,
  ...props
}) {
  const {login} = useAuth();
  const navigate = useNavigate(); 
  const queryClient = useQueryClient();
  const loginMutation = useMutation({
    mutationFn: async (tokenResponse) => {const user = await handleLogin(tokenResponse);
  return user;
},
    onSuccess: (user) => {
      if (user) {
        queryClient.setQueryData(["user"], user);
        login(user); 
        navigate("/"); 
        toast.success("Login successful!");
      } else {
        toast.error("Login failed: User data not found in response.");
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast.error("Login failed: " + error.message);
    },
  });
  async function handleLogin  (tokenResponse) { 
    if (!tokenResponse.code) {
      toast.error("Login failed: No authorization code received from Google.");
      return null;
    }
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({
          code: tokenResponse.code, 
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.text(); 
        throw new Error(
          `Failed to connect - HTTP status ${res.status}. Response: ${errorData}`
        );
      }

      const data = await res.json();

      if (data?.user) {
        return data.user;
      }
      toast.error("Login failed: Response did not include user data.");
      return null;
    } catch (e) {
      toast.error("Login failed: " + e);
      return null;
    }
    
  };

  const GoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        loginMutation.mutate(tokenResponse);
      } catch (error) {
        handleError(error);
      }
    },
    onError: (error) => {
      handleError(error);
    },
    flow: 'auth-code',
  });
  
  const handleError = (error) => {
    console.error("Login error in handleError:", error);
    toast.error("Error logging in: " + error);
  };
  if (loginMutation.isPending) {
    return <LoginSkeleton />;
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              to="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <House className="size-6" />
              </div>
              <span className="sr-only">Minh.</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to my website.</h1>
            {/* <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div> */}
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full">
                  {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg> */}
                  (More options coming soon)
                </Button>
                <Button variant="outline" className="w-full cursor-pointer" onClick={() => GoogleLogin()} type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
          </div>
          {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div> */}
          
          {/* in case i add magic link login in the future */}
          {/* <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
              />
            </div> */}
            {/* <Button type="submit" className="w-full">
              Login
            </Button> */}
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
